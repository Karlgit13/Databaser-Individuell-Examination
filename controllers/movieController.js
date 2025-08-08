const Movie = require('../models/movie');
const Review = require('../models/review');
const { validateId } = require('../middleware/validateId');



exports.getAllMovies = async (req, res) => {

    try {
        const movies = await Movie.find().populate("reviews");
        res.json(movies)
    } catch (error) {
        console.error("kunde inte hämta filmer:", error)
        res.status(500).json({ error: "Fel vid hämtning av filmer." })
    }
}


exports.getMoviesById = async (req, res) => {

    try {
        const foundMovie = await Movie.findById(req.params.id)
        if (!foundMovie) {
            return res.status(404).json({ error: "Filmen hittades inte." });
        }
        res.json(foundMovie);
    } catch (error) {
        console.error("kunde inte hämta filmen:", error)
        res.status(500).json({ error: "Fel vid hämtning av filmen." });
    }
}


exports.createMovie = async (req, res) => {

    try {
        const { title, director, releaseYear, genre } = req.body
        const newMovie = new Movie({ title, director, releaseYear, genre })
        await newMovie.save()
        res.status(201).json(newMovie)
    } catch (error) {
        console.error("kunde inte skapa filmen:", error)
        res.status(500).json({ error: "Fel vid skapande av filmen." })
    }
}


exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!updatedMovie) {
            return res.status(404).json({ error: "Filmen hittades inte." });
        }
        res.json({ message: "Filmen uppdaterades.", movie: updatedMovie });
    } catch (error) {
        console.error("kunde inte uppdatera filmen:", error)
        res.status(500).json({ error: "Fel vid uppdatering av filmen." });
    }
}


exports.deleteMovie = async (req, res) => {

    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
        if (!deletedMovie) {
            return res.status(404).json({ error: "Filmen hittades inte," })
        }
        res.json({ message: "Filmen togs bort." })
    } catch (error) {
        console.error("kunde inte ta bort filmen;", error)
        res.status(500).json({ error: "Fel vid borttagning av filmen." })
    }
}


exports.getReviewsByMovieId = async (req, res) => {

    try {
        const review = await Review.find({ movieId: req.params.id }).populate("userId");
        if (review.length === 0) {
            return res.status(404).json({ error: "Inga recensioner hittades för denna film." });
        }
        res.json(review)
    } catch (error) {
        console.error("kunde inte hämta recensioner:", error)
        res.status(500).json({ error: "Fel vid hämtning av recensioner." })
    }
}