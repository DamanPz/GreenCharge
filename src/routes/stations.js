const express = require('express');
const router = express.Router();

const { stations } = require('../data/store');

// GET /api/stations - JSON list of stations
router.get('/', (req, res) => {
    res.json(stations);
});

// GET /api/stations/:id - Single station details
router.get('/:id', (req, res) => {
    const station = stations.find(s => s.id === parseInt(req.params.id));
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json(station);
});

module.exports = router;
