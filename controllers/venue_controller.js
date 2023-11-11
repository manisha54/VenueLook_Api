const Venue = require('../models/Venue')

// const getAllVenues = (req, res, next) => {
//     Venue.find()
//         .then(venues => res.json(venues))
//         .catch(next)
// }

const getAllVenues = (req, res, next) => {
    Venue.find()
        .then(venues => res.json({
            success: true,
            count: venues.length,
            data: venues,
        }))
        .catch(next)
}