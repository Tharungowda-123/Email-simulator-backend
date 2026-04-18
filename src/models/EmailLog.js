const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

module.exports = EmailLog;