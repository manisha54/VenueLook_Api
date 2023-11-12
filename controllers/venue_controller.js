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



const createVenue = (req, res, next) => {
    Venue.create(req.body)
        .then((venue) => res.status(201).json({
            success: true,
            data: [venue],
        }))
        .catch(err => next(err))
}


const deleteAllvenues = (req, res, next) => {
    Venue.deleteMany()
        .then(reply => res.json(reply))
        .catch(next)
}