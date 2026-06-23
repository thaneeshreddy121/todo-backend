const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

const app = express();

app.use(cors());
app.use(express.json());


console.log("URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "tododb",
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});