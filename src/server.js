const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // Enable JSON body parsing for Admin API

// API Routes
const stationsRouter = require('./routes/stations');
const adminRouter = require('./routes/admin');

app.use('/api/stations', stationsRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
