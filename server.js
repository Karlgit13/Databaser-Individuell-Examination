require('dotenv').config(); // läser in miljövariabler från .env-filen
const express = require('express'); // Importerar express för att skapa en server
const connectDB = require('./config/db'); // Importerar databasanslutningsfunktionen

connectDB(); // Anropar funktionen för att ansluta till databasen

const app = express(); // Skapar en express-applikation
app.use(express.json()); // Middleware för att tolka JSON-data i inkommande förfrågningar

// grundroute för test
app.get("/", (req, res) => {
    res.send("API is running..."); // Svarar med ett meddelande när root-routen anropas
})


// start servern på port från miljövariabel eller standardport 5000
const PORT = process.env.PORT || 5000; // Använder miljövariabeln PORT eller standardport 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Loggar att servern är igång
})