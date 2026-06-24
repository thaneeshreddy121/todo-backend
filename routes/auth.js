const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ---------------- SIGNUP ---------------- */
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
    } = req.body;

if (
  !name?.trim() ||
  !email?.trim() ||
  !password?.trim() ||
  !securityQuestion?.trim() ||
  !securityAnswer?.trim()
) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

    // Check existing user
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
    });

    await user.save();

    res.json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    res.json({
      message: "Login Successful",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ---------------- FORGOT PASSWORD STEP 1 ---------------- */
/* Get security question using email */
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    res.json({
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- FORGOT PASSWORD STEP 2 ---------------- */
/* Verify security answer */
router.post("/verify-answer", async (req, res) => {
  try {
    const { email, answer } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.securityAnswer !== answer) {
      return res.status(400).json({
        message: "Incorrect Answer",
      });
    }

    res.json({
      message: "Verified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- FORGOT PASSWORD STEP 3 ---------------- */
/* Reset password */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    await User.findOneAndUpdate(
      { email },
      { password: newPassword }
    );

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ---------------- UPDATE PROFILE ---------------- */
router.put("/update-profile/:id", async (req, res) => {
  try {
    const { name, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
      },
      { new: true }
    );

    res.json({
      message: "Profile Updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});




module.exports = router;