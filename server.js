// Läser in miljövariabler från .env (t.ex. PORT, MONGODB_URI, JWT_SECRET)
require('dotenv').config();

// Importerar Express (webbserver), DB-anslutning och CORS-stöd
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Startar anslutningen mot MongoDB
connectDB();

// Skapar en Express-app och registrerar global middleware
const app = express();

// Gör att inkommande JSON-body blir tillgänglig via req.body
app.use(express.json());

// Tillåter förfrågningar från andra domäner (CORS)
app.use(cors());

// Laddar in router-moduler
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Monterar rutter under gemensam basväg
// Exempel: /api/register, /api/login
app.use('/api', authRoutes);
// Exempel: /api/movies, /api/movies/:id, /api/movies/:id/reviews
app.use('/api/movies', movieRoutes);
// Exempel: /api/reviews, /api/reviews/:id
app.use('/api/reviews', reviewRoutes);

// Central felhanterare
// Svarar 400 vid ogiltigt ObjectId (CastError), annars 500
app.use((error, req, res, next) => {
    if (error?.name === 'CastError') {
        return res.status(400).json({ error: 'Ogiltigt id.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internt serverfel' });
});

// Startar servern på vald port (från .env eller 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
