const mongoose = require('mongoose');
// importerar mongoose-biblioteket som andvänds för att hantera mongoDB i node.js

const connectDB = async () => {
    // här definieras en asynkron funktion för att ansluta till databasen
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // försöker ansluta till databasen med hjälp av mongoose.connect och miljövariabeln MONGODB_URI
        // useNewUrlParser och useUnifiedTopology är alternativ som används för att undvika varningar i konsolen
        // samt för att använda den senaste versionen av MongoDB:s drivrutin
        console.log('MongoDB connected successfully');
        // loggar ett meddelande om att anslutningen lyckades
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // fångar eventuella fel som uppstår under anslutningen och loggar ett felmeddelande
        process.exit(1); // avslutar processen med felkod 1 om anslutningen misslyckas
    }
}

module.exports = connectDB; // exporterar connectDB-funktionen så att den kan användas i andra filer
// detta gör att andra delar av applikationen kan anropa connectDB för att ansluta till databasen
// vanligtvis anropas denna funktion i server.js-filen för att säkerställa att
// databasen är ansluten innan servern startas
// detta är viktigt för att säkerställa att applikationen kan interagera med databasen korrekt
// och att data kan läsas och skrivas som förväntat.