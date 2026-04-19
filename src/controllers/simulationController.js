const User = require("../models/User");
const EmailLog = require("../models/EmailLog");

const startSimulation = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length < 2) {
      return res.json({ message: "Not enough users" });
    }

    let logs = [];

    for (let i = 0; i < users.length; i++) {
      let sender = users[i];

      // daily limit reset + increase
      const today = new Date();
      const last = new Date(sender.lastReset);

      if (today.toDateString() !== last.toDateString()) {
        sender.emailsSentToday = 0;
        sender.dailyLimit += 1;
        sender.lastReset = today;
      }

      if (sender.emailsSentToday >= sender.dailyLimit) continue;

      let receiver = users[(i + 1) % users.length];

      //  await inside async function (correct)
      await EmailLog.create({
        sender: sender.email,
        receiver: receiver.email
      });

      sender.emailsSentToday += 1;
      await sender.save();

      logs.push({
        from: sender.email,
        to: receiver.email
      });
    }

    res.json({
      message: "Simulation completed",
      logs
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { startSimulation };
