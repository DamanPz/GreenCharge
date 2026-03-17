const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const Admin = require('../models/Admin');

// Utility to generate ID (fetch highest id from db)
const getNextId = async () => {
    const highestStation = await Station.findOne().sort({ id: -1 });
    return highestStation ? highestStation.id + 1 : 1;
};

// GET /api/admin/stations - List all
router.get('/stations', async (req, res) => {
    try {
        const stations = await Station.find({}, { _id: 0, __v: 0 }).sort({ id: 1 });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/stations - Add new
router.post('/stations', async (req, res) => {
    try {
        const id = await getNextId();
        const newStation = new Station({
            id,
            ...req.body
        });
        await newStation.save();
        
        // Return without mongo specific fields to match old API
        const stationObj = newStation.toObject();
        delete stationObj._id;
        delete stationObj.__v;

        res.status(201).json(stationObj);
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// PUT /api/admin/stations/:id - Update
router.put('/stations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedStation = await Station.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-_id -__v');

        if (!updatedStation) return res.status(404).json({ error: 'Station not found' });
        res.json(updatedStation);
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// DELETE /api/admin/stations/:id - Delete
router.delete('/stations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedStation = await Station.findOneAndDelete({ id });
        
        if (!deletedStation) return res.status(404).json({ error: 'Station not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/login - Authenticate Admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`[Login Attempt] Username: ${username}, Password: ${password}`); // DEBUG
        
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            console.log('[Login] Success');
            res.json({ success: true });
        } else {
            console.log('[Login] Failed: Invalid credentials');
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
