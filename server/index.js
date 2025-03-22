import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "./database/connect.js";
import authRoutes from "./routes/auth_route.js";
import profileRoutes from "./routes/profile_route.js";

dotenv.config();
const app = express();
const Port = 8000;

// CORS middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect to database
connectdb();

// Regular Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Register routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", profileRoutes);

app.listen(Port, () => {
  console.log(`⚙️ Server is running on http://localhost:${Port}`);
});
