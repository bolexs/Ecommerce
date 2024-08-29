import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";
import Product from "../models/Product.js";

const registration = async (req, res) => {
  const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  try {
    // validate user/client request
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }
    // destructure fields/values from the request body
    const { fullName, email, phoneNumber, username, password, role } = req.body;

    // Check if user with the email sent from the client already exist in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `${email} already exist`,
        data: null,
      });
    }

    // Hashing of password before saving to the database
    const hashPassword = await bcrypt.hash(password, 10);

    if (req.user?.role !== "admin" && role === "admin") {
      return res.status(403).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Only admin can create admin user",
        data: null,
      });
    }

    // create the information as a new user
    user = new User({
      fullName,
      email,
      phoneNumber,
      username,
      password: hashPassword,
      role,
    });

    // save the user to the database
    await user.save();

    res.status(201).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} registered successfully`,
      data: {
        fullName,
        email,
        phoneNumber,
        username,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

const login = async (req, res) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    // validate user/client request
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // destructure fields/values from the request body
    const { email, password } = req.body;

    // find if the user email exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    // check if password sent matches the password on how database
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    // create/sign a token that the  user can use to access protected routes and also make sure the token expires in one hour
    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: "1h" });

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} login successfully`,
      data: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        token,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

const dashboard = async (req, res) => {
  try {
    let users = await User.find().lean();
    let products = await Product.find().lean();
    const userIds = users.map((user) => user._id);
    const ProductIds = products.map((product) => product._id);
    const totalUsers = await User.countDocuments({ _id: { $in: userIds } });
    const totalProducts = await Product.countDocuments({
      _id: { $in: ProductIds },
    });

    const responseData = {
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Dashboard Information",
      data: {
        totalUsers,
        totalProducts,
      },
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { registration, login, dashboard };
