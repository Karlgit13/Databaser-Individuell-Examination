// controllers/reviewController.js
const Review = require('../models/review');
const Movie = require('../models/movie');
const { validateId } = require('../middleware/validateId');

// POST /api/reviews
exports.createReview = async (req, res) => {

    // Validera movieId från body
    if (!validateId(req.body.movieId, res)) return;

    try {
        const { movieId, rating, comment } = req.body;
        // Kontrollera att filmen finns
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Filmen hittades inte.' });
        }
        const newReview = new Review({
            movieId,
            userId: req.user.id,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Fel vid skapande av recension:', error);
        res.status(500).json({ error: 'Kunde inte skapa recensionen.' });
    }
};

// GET /api/reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'username')
            .populate('movieId', 'title');
        res.json(reviews);
    } catch (error) {
        console.error('Fel vid hämtning av recensioner:', error);
        res.status(500).json({ error: 'Kunde inte hämta recensionerna.' });
    }
};

// GET /api/reviews/:id
exports.getReviewById = async (req, res) => {

    // Validera movieId från body
    if (!validateId(req.body.movieId, res)) return;

    try {
        const review = await Review.findById(req.params.id)
            .populate('userId', 'username')
            .populate('movieId', 'title');
        if (!review) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }
        res.json(review);
    } catch (error) {
        console.error('Fel vid hämtning av recension:', error);
        res.status(500).json({ error: 'Kunde inte hämta recensionen.' });
    }
};

// PUT /api/reviews/:id
exports.updateReview = async (req, res) => {

    // Validera movieId från body
    if (!validateId(req.body.movieId, res)) return;

    try {
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }
        res.json({ message: 'Recensionen uppdaterades.', review: updated });
    } catch (error) {
        console.error('Fel vid uppdatering av recension:', error);
        res.status(500).json({ error: 'Kunde inte uppdatera recensionen.' });
    }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {

    // Validera movieId från body
    if (!validateId(req.body.movieId, res)) return;

    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }
        res.json({ message: 'Recensionen togs bort.' });
    } catch (error) {
        console.error('Fel vid borttagning av recension:', error);
        res.status(500).json({ error: 'Kunde inte ta bort recensionen.' });
    }
};
