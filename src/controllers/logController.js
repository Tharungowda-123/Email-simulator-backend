const EmailLog = require('../models/EmailLog');

// Get the latest 50 logs, sorted by timestamp descending
const getLogs = async (req, res) => {
    try {
        const logs = await EmailLog.find()
            .sort({ timestamp: -1 })
            .limit(50);
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch logs.' });
    }
};

module.exports = {
    getLogs
};