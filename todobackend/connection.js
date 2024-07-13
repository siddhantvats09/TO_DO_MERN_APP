const mongoose = require("mongoose");

const connect = async (req, res) => {
  try {
    await mongoose
      .connect("mongodb+srv://siddhant:siddhant@cluster0.6v1atry.mongodb.net/")
      .then(() => {
        console.log("connected");
      });
  } catch (error) {
    res.status(400).json({ message: "DB Not Connect" });
  }
};
connect();
