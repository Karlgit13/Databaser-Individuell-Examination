const mongoose = require("mongoose")

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
    ref: "review",
    localField: "_id",
    foreignField: "movieId"
});



module.exports = mongoose.model("Movie", movieSchema)