const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const Session = require('../models/Session');

// GET /api/stations - JSON list of stations
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find({}, { _id: 0, __v: 0 }).sort({ id: 1 });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/stations/:id - Single station details
router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findOne({ id: parseInt(req.params.id) }, { _id: 0, __v: 0 });
        if (!station) return res.status(404).json({ error: 'Station not found' });
        res.json(station);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/stations/:id/book - Book a station
router.post('/:id/book', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const station = await Station.findOne({ id });
        
        if (!station) return res.status(404).json({ error: 'Station not found' });
        
        if (station.status === 'Available') {
            station.status = 'Occupied';
            station.currentSessionStartTime = new Date();
            await station.save();
            return res.json({ success: true, message: 'Station successfully booked.', station });
        } else if (station.status === 'Occupied') {
            return res.status(400).json({ error: 'Station already in use' });
        } else if (station.status === 'Maintenance') {
            return res.status(400).json({ error: 'Station under maintenance' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/stations/:id/release - Release a station
router.post('/:id/release', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const station = await Station.findOne({ id });
        
        if (!station) return res.status(404).json({ error: 'Station not found' });

        if (station.status === 'Occupied') {
            const endTime = new Date();
            const startTime = station.currentSessionStartTime || endTime;
            
            // Calculate duration in minutes (ensure at least 1 min for realism if instaclicked)
            let durationMinutes = Math.floor((endTime - startTime) / 60000);
            if (durationMinutes === 0) durationMinutes = 1;

            station.status = 'Available';
            station.currentSessionStartTime = null;
            await station.save();

            // Simulate charging amount based on duration (approx 2 kWh per minute of charge)
            const energyDelivered = durationMinutes * 2;
            
            await Session.create({
                station: station.name,
                startTime: startTime,
                endTime: endTime,
                durationMinutes: durationMinutes,
                energyDelivered: energyDelivered,
                createdAt: endTime
            });

            return res.json({ success: true, message: 'Station released successfully. Session logged.', station });
        } else {
            return res.status(400).json({ error: 'Station is not currently occupied by a user.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
