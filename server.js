require('dotenv').config(); // läser in miljövariabler från .env-filen
const express = require('express'); // Importerar express för att skapa en server
const connectDB = require('./config/db'); // Importerar databasanslutningsfunktionen

connectDB(); // Anropar funktionen för att ansluta till databasen

const app = express(); // Skapar en express-applikation
app.use(express.json()); // Middleware för att tolka JSON-data i inkommande förfrågningar


const authRoutes = require('./routes/authRoutes'); // Importerar autentiseringsrutter
const movieRoutes = require('./routes/movieRoutes'); // Importerar filmrutter
const Movie = require('./models/movie');
app.use("/api", authRoutes)
app.use("/api/movies", movieRoutes)


// start servern på port från miljövariabel eller standardport 5000
const PORT = process.env.PORT || 5000; // Använder miljövariabeln PORT eller standardport 5000
app.listen(PORT, () => { // Startar servern och lyssnar på angiven port
    console.log(`Server is running on port ${PORT}`); // Loggar att servern är igång
})