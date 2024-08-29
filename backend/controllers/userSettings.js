import User from "../models/User.js";
import { apiResponseCode } from "../helper.js";
import bcrypt from "bcryptjs";

const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, phoneNumber, username } = req.body;

    let user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "User not found",
        data: null,
      });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (username) user.username = username;

    await user.save();

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Profile updated successfully",
      data: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        username: user.username,
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

const editPassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    let user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "User not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Current password is incorrect",
        data: null,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "New password cannot be the same as current password",
        data: null,
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Password updated successfully",
      data: null,
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

export { editProfile, editPassword };
