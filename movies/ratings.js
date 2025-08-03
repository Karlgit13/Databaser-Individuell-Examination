Movie.aggregate([
    {
        $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'movieId',
            as: 'reviews'
        }
    },
    {
        $addFields: {
            averageRating: { $avg: '$reviews.rating' }
        }
    },
    {
        $project: {
            title: 1,
            director: 1,
            releaseYear: 1,
            genre: 1,
            averageRating: { $ifNull: ['$averageRating', 0] }
        }
    }
])
