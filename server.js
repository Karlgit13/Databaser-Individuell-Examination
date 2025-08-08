require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use("/api", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((error, req, res, next) => {
    if (error?.name === 'CastError') {
        return res.status(400).json({ error: 'Ogiltigt id.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internt serverfel' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

