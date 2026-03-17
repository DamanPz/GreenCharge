const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET /api/sessions - Returns all charging sessions, newest first
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find({}, { _id: 0, __v: 0 }).sort({ endTime: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
