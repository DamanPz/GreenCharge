const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    currentSessionStartTime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Station', stationSchema);
