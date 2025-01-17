import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8001,
  connectionstring: process.env.CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
