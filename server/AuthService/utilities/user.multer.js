import multer from "multer";
import path from "path"
import fs from "fs"
/*
  Create upload directory if it doesn't exist

  Why:
  Prevent file system errors while uploading
*/

const uploadPath = path.join(
 process.cwd(),
 "Images",
 "Profile"
);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
/*
  Configure storage location + filename
*/
const storage = multer.diskStorage({
  /*
    Where file should be stored
  */
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  /*
    Create unique filename

    Why:
    Prevent filename collision
  */
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, uniqueName + extension);
  },
});

/*
  Validate uploaded file

  Allow only image files
*/
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  /*
    Reject non-image files
  */
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only image files are allowed"
      ),
      false
    );
  }

  /*
    Accept valid image
  */
  cb(null, true);
};

/*
  Create multer upload middleware
*/
export const upload = multer({
  storage,

  fileFilter,

  limits: {
    /*
      Max file size: 5MB
    */
    fileSize: 5 * 1024 * 1024,
  },
});

