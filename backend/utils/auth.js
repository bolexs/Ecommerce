import jwt from "jsonwebtoken";
import config from "../config.js";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";

const authenticateAndAuthorize = (requiresAdmin = false) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "Access denied. No token provided.",
        data: null,
      });
    }

    try {
      const verified = jwt.verify(token, config.jwtSecret);
      req.user = verified;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({
          responseCode: apiResponseCode.UNAUTHORIZED,
          responseMessage: "Access denied: User not found",
          data: null,
        });
      }

      req.user.isAdmin = user.isAdmin;

      if (requiresAdmin && !user.isAdmin) {
        return res.status(403).json({
          responseCode: apiResponseCode.FORBIDDEN,
          responseMessage: "Access denied: Admin access required",
          data: null,
        });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid token",
        data: null,
      });
    }
  };
};

export default authenticateAndAuthorize;
