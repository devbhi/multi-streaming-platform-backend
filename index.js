const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // For handling cookies
const cors = require("cors"); // Add CORS middleware
const { v4: uuidv4 } = require("uuid"); // For generating unique userId

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());
app.use(cookieParser()); // Enable cookie parsing

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://AbhiUser:m6B9ipS5TwkAf4Xu@cluster0.5no1izo.mongodb.net/multiStreamingPlatform"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  youtubeKey: { type: String },
  facebookKey: { type: String },
  twitchKey: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = uuidv4(); // Generate unique userId
    const newUser = new User({ userId, email, password });
    await newUser.save();
    res
      .status(201)
      .cookie("userId", userId, { httpOnly: true }) // Save userId in cookies
      .json({ message: "User signed up successfully", userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res
      .status(200)
      .cookie("userId", user.userId, { httpOnly: true }) // Save userId in cookies
      .json({ message: "Login successful", userId: user.userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/keys/youtube", async (req, res) => {
  try {
    const { userId, youtubeKey } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { youtubeKey },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "YouTube key saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/keys/facebook", async (req, res) => {
  try {
    const { userId, facebookKey } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { facebookKey },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Facebook key saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/keys/twitch", async (req, res) => {
  try {
    const { userId, twitchKey } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { twitchKey },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Twitch key saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/keys/youtube", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Fetching YouTube key for userId: ${userId}`);

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ youtubeKey: user.youtubeKey });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/keys/facebook", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ facebookKey: user.facebookKey });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/keys/twitch", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ twitchKey: user.twitchKey });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
