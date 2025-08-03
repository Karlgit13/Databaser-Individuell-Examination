// Den här koden använder MongoDBs aggregate-metod för att hämta filmer och beräkna deras genomsnittliga betyg.

// Steg 1: $lookup används för att slå upp (join:a) dokument från 'reviews'-kollektionen.
// Den kopplar ihop varje film (Movie) med dess recensioner (reviews) där filmens _id matchar reviews.movieId.
// Resultatet sparas i ett nytt fält som heter 'reviews'.
Movie.aggregate([
    {
        $lookup: {
            from: 'reviews',           // Kollektionen att slå upp från
            localField: '_id',         // Fältet i Movie-dokumentet
            foreignField: 'movieId',   // Fältet i reviews-dokumentet
            as: 'reviews'              // Namnet på det nya fältet med matchande reviews
        }
    },
    // Steg 2: $addFields lägger till ett nytt fält 'averageRating' till varje film.
    // Det beräknar genomsnittet av alla 'rating'-värden i 'reviews'-arrayen.
    {
        $addFields: {
            averageRating: { $avg: '$reviews.rating' }
        }
    },
    // Steg 3: $project bestämmer vilka fält som ska inkluderas i resultatet.
    // Här inkluderas titel, regissör, utgivningsår, genre och det nya fältet averageRating.
    // $ifNull används för att sätta averageRating till 0 om det inte finns några recensioner.
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
