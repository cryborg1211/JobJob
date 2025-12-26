require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const interactionRoutes = require('./routes/interactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interactions', interactionRoutes);

app.get('/', (req, res) => {
    res.send('JobJob API is running');
});

// Health check with DB connection test
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'healthy', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
