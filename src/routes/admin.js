const express = require('express');
const router = express.Router();
let { stations } = require('../data/store');

// Utility to generate ID
const getNextId = () => stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;

// GET /api/admin/stations - List all
router.get('/stations', (req, res) => {
    res.json(stations);
});

// POST /api/admin/stations - Add new
router.post('/stations', (req, res) => {
    const newStation = {
        id: getNextId(),
        ...req.body
    };
    stations.push(newStation);
    res.status(201).json(newStation);
});

// PUT /api/admin/stations/:id - Update
router.put('/stations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = stations.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Station not found' });

    stations[index] = { ...stations[index], ...req.body };
    res.json(stations[index]);
});

// DELETE /api/admin/stations/:id - Delete
router.delete('/stations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = stations.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Station not found' });

    stations.splice(index, 1);
    res.status(204).send();
});

// POST /api/admin/login - Authenticate Admin
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`[Login Attempt] Username: ${username}, Password: ${password}`); // DEBUG
    if (username === 'admin' && password === 'admin123') {
        console.log('[Login] Success');
        res.json({ success: true });
    } else {
        console.log('[Login] Failed: Invalid credentials');
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
