const router = require("express").Router();
const User = require("../Models/user");
const List = require("../Models/list");

// Create Task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id, status } = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ title, body, status, user: existingUser._id });
    await list.save();

    existingUser.list.push(list._id);
    await existingUser.save();

    res.status(200).json({ list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, status } = req.body;
    const list = await List.findByIdAndUpdate(req.params.id, { title, body, status }, { new: true });

    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task Updated", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const existingUser = await User.findByIdAndUpdate(id, {
      $pull: { list: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Tasks
router.get("/getTasks/:id", async (req, res) => {
  try {
    const lists = await List.find({ user: req.params.id }).sort({
      createdAt: -1,
    });

    if (lists.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({ list: lists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
