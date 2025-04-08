import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const JWTVerify = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
           if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = await User.findById(decoded.id).select("-password -refreshToken");
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" , error: error.message });
    }
}

