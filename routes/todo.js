const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();
const History = require("../models/History");


router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.post("/", async (req, res) => {
  const { name, dueDate } = req.body;

  const todo = new Todo({
    name,
    dueDate,
  });

  await todo.save();

  res.json({
    message: "Todo Added",
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    await History.create({
      name: todo.name,
      dueDate: todo.dueDate,
    });

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: "Todo moved to history",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/history", async (req, res) => {
  try {
    const history = await History.find();

    res.json(history);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;