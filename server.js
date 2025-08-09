/** Serveruppstart (Express + MongoDB)
 * Syfte:
 *  - Starta upp Express-servern.
 *  - Ansluta till MongoDB.
 *  - Ladda och registrera routes & middleware.
 *
 * Säkerhet:
 *  - .env används för portar och DB-konfiguration.
 *  - CORS aktiveras för att möjliggöra API-anrop från andra domäner.
 */
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// [1] Starta MongoDB-anslutning
connectDB();

// [2] Skapa en Express-app
const app = express();

// [3] Registrera global middleware
//     - express.json(): gör att req.body kan hantera JSON
//     - cors(): tillåter cross-origin-förfrågningar
app.use(express.json());
app.use(cors());

// [4] Ladda in alla routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// [5] Registrera routes med basvägar
//     Alla rutter under /api hanteras här
app.use("/api", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

// [6] Central felhanterare
//     - Fångar upp ogiltiga ObjectId (CastError)
//     - Loggar övriga fel och returnerar 500
app.use((error, req, res, next) => {
    if (error?.name === 'CastError') {
        return res.status(400).json({ error: 'Ogiltigt id.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internt serverfel' });
});

// [7] Starta servern
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
