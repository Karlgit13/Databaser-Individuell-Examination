require('dotenv').config(); // läser in miljövariabler från .env-filen
const express = require('express'); // Importerar express för att skapa en server
const connectDB = require('./config/db'); // Importerar databasanslutningsfunktionen

connectDB(); // Anropar funktionen för att ansluta till databasen

const app = express(); // Skapar en express-applikation
app.use(express.json()); // Middleware för att tolka JSON-data i inkommande förfrågningar


const authRoutes = require('./routes/authRoutes'); // Importerar autentiseringsrutter
const movieRoutes = require('./routes/movieRoutes'); // Importerar filmrutter
const ratingRoutes = require('./routes/ratingRoutes'); // Importerar betygsrutter
const reviewRoutes = require('./routes/reviewRoutes'); // Importerar recensionsrutter
app.use("/api", authRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/movies", ratingRoutes) // Använder betygsrutter under /api
app.use("/api/reviews", reviewRoutes) // Använder recensionsrutter under /api


// start servern på port från miljövariabel eller standardport 5000
const PORT = process.env.PORT || 5000; // Använder miljövariabeln PORT eller standardport 5000
app.listen(PORT, () => { // Startar servern och lyssnar på angiven port
    console.log(`Server is running on port ${PORT}`); // Loggar att servern är igång
})

