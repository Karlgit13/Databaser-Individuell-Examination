const mongoose = require("mongoose")

// här defineras strukturen för ett "Movie document" i MongoDB
// varje film har en titel, regissör, utgivningsår och genre
// mongoose.Schema används för att skapa ett schema som definierar dessa fält
// varje fält har en typ och alla fält är markerade som obligatoriska (required)
const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        director: { type: String, required: true, trim: true },
        releaseYear: { type: Number, required: true },
        genre: { type: String, required: true, trim: true },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


movieSchema.virtual("reviews", {
    ref: "review",           // Modellnamn (samma som du använde i review.js)
    localField: "_id",       // fält på Movie
    foreignField: "movieId"  // fält på Review
});


// exporterar modellen för att kunna användas i controllers och routes
// mongoose.model skapar en modell baserad på schemat och namnger den "Movie"
// detta gör att vi kan interagera med filmer i databasen
// vi kan skapa, läsa, uppdatera och ta bort filmer genom denna modell
module.exports = mongoose.model("Movie", movieSchema)