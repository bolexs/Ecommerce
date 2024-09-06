import express from "express";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

//Routes

app.get("/alive", (req, res) => {
  res.json({ status: "alive", message: "Service is running" });
});

app.use("/api/auth", authRouter);

dbConnection();
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
