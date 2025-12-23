const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Replace 'mongodb://localhost:27017/jobjob' with your actual connection string
// or process.env.MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobjob', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Routes
app.get('/', (req, res) => {
    res.send('JobJob API is running');
});

// Import Routes (Placeholder)
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
