const express = require("express");
const Todo = require("../models/Todo");
const History = require("../models/History");

const router = express.Router();

/* ---------------- GET TODOS (USER ONLY) ---------------- */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const todos = await Todo.find({ userId });

    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- CREATE TODO (WITH USER) ---------------- */
router.post("/", async (req, res) => {
  try {
    const { name, dueDate, userId } = req.body;

    const todo = new Todo({
      name,
      dueDate,
      userId,
    });

    await todo.save();

    res.json({
      message: "Todo Added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- DELETE TODO + MOVE TO HISTORY ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    // move to history WITH userId
    await History.create({
      name: todo.name,
      dueDate: todo.dueDate,
      userId: todo.userId,
    });

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: "Todo moved to history",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- GET HISTORY (USER ONLY) ---------------- */
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;

    const history = await History.find({ userId });

    res.json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;