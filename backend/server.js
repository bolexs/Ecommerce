import express from "express";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(path.resolve(), "uploads")));
app.use(cors());

//Routes
app.use("/api/auth", authRouter);

dbConnection();
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
