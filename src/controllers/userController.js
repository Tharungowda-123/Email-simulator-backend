const User = require("../models/User");  // ✅ IMPORT MODEL

const createUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = new User({
      email: email
    });

    await user.save();

    res.json(user);

  } catch (err) {
    console.log("ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ EXPORT FUNCTIONS (VERY IMPORTANT)
module.exports = { createUser, getUserStats };