const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET /api/analytics/station-sessions
// Returns number of charging sessions per station
router.get('/station-sessions', async (req, res) => {
    try {
        const result = await Session.aggregate([
            {
                $group: {
                    _id: "$station",
                    sessions: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    station: "$_id",
                    sessions: 1
                }
            },
            { $sort: { station: 1 } }
        ]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/analytics/weekly-energy
// Return energy delivered per day for the last 7 days
router.get('/weekly-energy', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await Session.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$createdAt" },
                    energyDelivered: 1
                }
            },
            {
                $group: {
                    _id: "$dayOfWeek",
                    energy: { $sum: "$energyDelivered" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map MongoDB dayOfWeek integers (1=Sun, 7=Sat) to short strings
        const dayMap = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
        
        const formattedResult = result.map(item => ({
            day: dayMap[item._id],
            energy: item.energy
        }));

        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
