const mongoose = require("mongoose")


// här defineras strukturen för en recension kopplad till en film och en användare
// varje recension har ett referens-ID till filmen, ett referens-ID till användaren som
// skrev recensionen, en betygsättning mellan 1 och 5, en kommentar och en tidsstämpel
// mongoose.Schema används för att skapa ett schema som definierar dessa fält
// varje fält har en typ och alla fält är markerade som obligatoriska (required
const reviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})


// här exporterar vi modellen för att kunna användas i controllers och routes
// mongoose.model skapar en modell baserad på schemat och namnger den "review"
// detta gör att vi kan interagera med recensioner i databasen
// vi kan skapa, läsa, uppdatera och ta bort recensioner genom denna modell
module.exports = mongoose.model("review", reviewSchema) 
