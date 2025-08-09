/** Databasanslutning (MongoDB via Mongoose)
 * Syfte:
 *  - Etablera en anslutning till MongoDB med hjälp av Mongoose.
 *
 * Nyckelbegrepp:
 *  - MONGODB_URI hämtas från miljövariabler (.env)
 *  - connectDB() anropas tidigt i server.js innan routes laddas.
 *
 * Felhantering:
 *  - Vid fel loggas det till konsolen och process avslutas med kod 1.
 */
const mongoose = require("mongoose");

/** [1] Funktion för att ansluta till databasen
 *  - mongoose.connect returnerar ett Promise.
 *  - useNewUrlParser och useUnifiedTopology är rekommenderade inställningar.
 */
const connectDB = async () => {
    try {
        // [1.1] Försök ansluta med URL från .env
        await mongoose.connect(process.env.MONGODB_URI,);

        // [1.2] Bekräftelse vid lyckad anslutning
        console.log("MongoDB connected successfully");
    } catch (error) {
        // [1.3] Logga fel och avsluta processen
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

/** [2] Exportera anslutningsfunktionen */
module.exports = connectDB;
