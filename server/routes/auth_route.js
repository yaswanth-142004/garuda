import express from "express";
import Profile from "../database/schema/profileSchema.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await Profile.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Profile({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await Profile.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        res.status(200).json({
            message: "Login successful",
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
