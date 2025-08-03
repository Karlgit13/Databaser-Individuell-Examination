const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true }, // Reference to the movie being reviewed
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who wrote the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String, required: true }, // Review comment
    createdAt: { type: Date, default: Date.now } // Timestamp for when the review was created
})