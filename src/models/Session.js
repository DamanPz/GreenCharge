const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    station: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    energyDelivered: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
