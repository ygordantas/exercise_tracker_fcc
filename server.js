require("dotenv").config();
//Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const moment = require("moment");
const _ = require("lodash");
//--

// Models
const User = require("./models/User");
const Exercise = require("./models/Exercise");
//--

// Database setup
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);
//--

// Middlewares setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
//--

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const username = req.body.username;
  if (!username.trim()) {
    // Avoid client to enter just use white space as username
    res.status(400).send("Username is required");
  } else {
    let user = await User.find({ username });
    if (user.length === 0) {
      user = await new User({ username }).save();
      res.send(user);
    } else {
      res.send("Username already taken");
    }
  }
});

app.post("/api/exercise/add", async (req, res) => {
  const { userId, description, duration, date } = req.body;
  // Validation rules
  if (!userId.trim()) {
    res.status(400).send("You must provide an username");
  } else if (!description.trim()) {
    res.status(400).send("You must provide a description");
  } else if (!+duration) {
    res.status(400).send("Duration must be a number");
  } else if (+duration <= 0) {
    res.status(400).send("Duration is too short");
  } else if (
    date.trim() !== "" &&
    !moment(
      date,
      ["YYYY-MM-D", "YYYY-M-D", "YYYY-MM-DD", "YYYY-M-DD"],
      true
    ).isValid()
  ) {
    res.status(400).send("Invalid date");
  } else {
    // If we do not find any error in the form proceed:

    const exerciseLog = {
      description,
      duration: +duration,
      date: date || moment().format("YYYY-MM-DD")
    };
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { log: exerciseLog },
        $inc: { count: 1 }
      },
      { new: true }
    );
    if (!user) {
      res.send(`Unable to find user with the id of ${userId}`);
    } else {
      res.send({ user: user.username, _id: user._id, ...exerciseLog });
    }
  }
});

app.get("/api/exercise/log", async (req, res) => {
  if (!req.query.userId) {
    res.send(`User ID is required`);
  } else {
    const { userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      res.send(`Unable to find user with the id of ${userId}`);
    } else {
      res.send(user);
    }
  }
});

app.get("/api/exercise/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

//--
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
