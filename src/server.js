const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Session = require('./models/Session');

const app = express();
const PORT = 3001;

// Connect to Database
connectDB();

// Seed Default Admin
const seedInitialData = async () => {
    try {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            await Admin.create({ username: 'admin', password: 'admin123' });
            console.log('Default admin created');
        }
    } catch (err) {
        console.error('Error seeding data:', err.message);
    }
};
seedInitialData();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); // Enable JSON body parsing for Admin API

// API Routes
const stationsRouter = require('./routes/stations');
const adminRouter = require('./routes/admin');
const analyticsRouter = require('./routes/analytics');
const sessionsRouter = require('./routes/sessions');

app.use('/api/stations', stationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/sessions', sessionsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
