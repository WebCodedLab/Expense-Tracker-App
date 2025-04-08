import User from "../models/user.model.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redisClient.js";

// Helper function to cache user data
const cacheUser = async (key, data, ttl = 3600) => {
  if (redis.isReady) {
      await redis.setex(key, ttl, JSON.stringify(data));
  }
};

// Helper function to get cached user data
const getCachedUser = async (key) => {
  if (redis.isReady) {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
  }
  return null;
};

const registerUser = async (req, res) => {
  try {
    const { displayName, username, password, email } = req.body;

    if (!displayName || !username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ifUserAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (ifUserAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      displayName,
      username,
      password,
      email,
    });

    if (!newUser) {
      if (profilePic?.public_id) {
        await deleteImage(profilePic.public_id);
        console.log(`Image ${profilePic.public_id} deleted successfully`);
      }
      return res.status(400).json({ message: "Error creating user" });
    }

    const user = await User.findOne({ _id: newUser._id }).select("-password");

    if (!user) {
      if (profilePic?.public_id) {
        await deleteImage(profilePic.public_id);
        console.log(`Image ${profilePic.public_id} deleted successfully`);
      }
      return res.status(400).json({ message: "Error fetching user" });
    }

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    let userWithNewRefreshToken = await User.findOne(user._id);
    userWithNewRefreshToken.refreshToken = refreshToken;
    await userWithNewRefreshToken.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const loginUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!password || (!email && !username)) {
      return res.status(400).json({ 
        message: "Please provide either email or username and password" 
      });
    }

    const user = await User.findOne({
      $or: [
        { email: email || null }, 
        { username: username || null }
      ]
    }).select('+password'); // Include password field

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure both password and user.password exist
    if (!password || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );

    // Cache user data
    const cacheKey = `user:${user._id}`;
    await cacheUser(cacheKey, user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const IncomingRefreshToken = req.cookies.refreshToken;
    if (!IncomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (IncomingRefreshToken !== user.refreshToken) {
      return res.status(403).json({
        message: "Refresh token has expired",
        IncomingRefreshToken: IncomingRefreshToken,
        userRefreshToken: user.refreshToken,
      });
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({ message: "Access token refreshed successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: "" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear user cache
    const cacheKey = `user:${user._id}`;
    await redis.del(cacheKey);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    user.password = newPassword;
    await user.save();

    // Invalidate cache
    const cacheKey = `user:${user._id}`;
    await redis.del(cacheKey);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Password changed successfully. Please log in again." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const cacheKey = `user:${req.user._id}`;
    const cachedUser = await getCachedUser(cacheKey);
    
    if (cachedUser) {
      return res.status(200).json(cachedUser);
    }

    const user = req.user;
    await cacheUser(cacheKey, user);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateAccountDetails = async (req, res) => {
  const { email, displayName } = req.body;
  try {
    if (!email && !displayName) {
      return res.status(400).json({ message: "At least displayName or email is required" });
    }

    const updateData = {};
    if (email) updateData.email = email; 
    if (displayName) updateData.displayName = displayName;

    let user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");

    // Update cache
    const cacheKey = `user:${user._id}`;
    await cacheUser(cacheKey, user);

    res.status(200).json({ message: "Account details updated successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateProfilePic = async (req, res) => {
  const { profilePic: oldProfilePic } = await User.findById(
    req.user._id
  ).select("profilePic -_id");

  const profifePicPath = req.file?.path;
  console.log(profifePicPath);

  try {
    if (!profifePicPath) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const profilePic = await uploadImage(profifePicPath);
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Error uploading profile picture" });
    }

    const oldPublicId = oldProfilePic
      ?.split("/")
      .slice(-2)
      .join("/")
      .replace(/\.[^/.]+$/, "");
    console.log(oldPublicId);

    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }

    let user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePic: profilePic.url } },
      { new: true }
    ).select("-password -refreshToken");
    res
      .status(200)
      .json({ message: "Profile Picrure updated successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateProfilePic,
};
