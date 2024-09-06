import express from "express";
import { dashboard, login, registration } from "../controllers/auth.js";
import authenticateAndAuthorize from "../utils/auth.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.js";
import {
  deleteUser,
  editUser,
  getAllUsers,
  // TempPromoteToAdmin,
} from "../controllers/admin.js";
import {
  editPassword,
  editProfile,
  getProfile,
} from "../controllers/userSettings.js";

const authRouter = express.Router();

authRouter.post("/register", registration);

authRouter.post("/login", login);
authRouter.get("/dashboard", authenticateAndAuthorize(), dashboard);

authRouter.get("/get-profile", authenticateAndAuthorize(), getProfile);

authRouter.put("/update-profile", authenticateAndAuthorize(), editProfile);

authRouter.put("/update-password", authenticateAndAuthorize(), editPassword);

authRouter.post("/create-product", authenticateAndAuthorize(), createProduct);

authRouter.get("/products", authenticateAndAuthorize(), getAllProducts);

authRouter.get("/product/:id", authenticateAndAuthorize(), getSingleProduct);

authRouter.put("/product/:id", authenticateAndAuthorize(), updateProduct);

authRouter.delete("/product/:id", authenticateAndAuthorize(), deleteProduct);

authRouter.post(
  "/admin-user-creation",
  authenticateAndAuthorize(true),
  registration
);

authRouter.put("/admin-user-edit", authenticateAndAuthorize(true), editUser);

authRouter.delete(
  "/admin-user-delete",
  authenticateAndAuthorize(true),
  deleteUser
);

authRouter.get(
  "/admin-get-allusers",
  authenticateAndAuthorize(true),
  getAllUsers
);

// authRouter.put(
//   "/promote/:id",
//   authenticateAndAuthorize(true),
//   TempPromoteToAdmin
// );

export default authRouter;
