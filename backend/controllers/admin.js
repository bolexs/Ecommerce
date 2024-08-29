import User from "../models/User.js";
import { apiResponseCode } from "../helper.js";
import Product from "../models/Product.js";

// const TempPromoteToAdmin = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findById({ _id: id });
//     if (!user) {
//       return res.status(404).json({
//         responseCode: apiResponseCode.NOT_FOUND,
//         responseMessage: "User not found",
//         data: null,
//       });
//     }

//     user.role = "admin";
//     await user.save();

//     res.status(200).json({
//       responseCode: apiResponseCode.SUCCESSFUL,
//       responseMessage: "User promoted to Admin",
//       data: user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
//       responseMessage: "Internal server error",
//       data: null,
//     });
//   }
// };

const editUser = async (req, res) => {
  try {
    const { _id, fullName, phoneNumber, username, role } = req.body;

    let user = await User.findById({ _id });

    if (!user) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "User not found",
        data: null,
      });
    }

    if (role) user.role = role;
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (username) user.username = username;

    await user.save();

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "User updated succsessfully",
      data: user,
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

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await User.findByIdAndDelete({ _id });

    if (!user) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "User not found",
        data: null,
      });
    }

    const products = await Product.find({ createdBy: _id });

    if (products.length > 0) {
      await Product.deleteMany({ createdBy: _id });
    }

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "User deleted successfully",
      data: user,
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -createdAt -updatedAt -__v")
      .lean();
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "All users",
      data: users,
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

export { editUser, deleteUser, getAllUsers };
