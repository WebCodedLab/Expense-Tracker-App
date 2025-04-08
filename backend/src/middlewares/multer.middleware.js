import multer from "multer";
import path from "path"; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        const fileExtension = path.extname(file.originalname);

        const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;

        cb(null, filename);
    }
});

export const upload = multer({ storage });