const express = require('express');
const router = express.Router()
const ratingsController = require('../controllers/ratingsController');


router.get("/ratings", ratingsController.getMovieRatings)


module.exports = router;