const Venue = require('../models/Venue')


const getAllReview = (req, res, next) => {
    Venue.findById(req.params.venue_id)
        .then((venue) => {
            if (!venue) return res.status(404).json({ error: " venue not found" })
            res.json(venue.reviews)
        })
        .catch(next)

}

const createReview = (req, res, next) => {
    Venue.findById(req.params.venue_id)
        .then((venue) => {
            if (!venue) return res.status(404).json({ error: " venue not found" })
          
            const review = {
                text: req.body.text,
                user: req.user.id,
                userName:`${ req.user.fName} ${req.user.lName}`
            }
            venue.reviews.push(review)
            venue.save()
                .then((venue) => res
                    .status(201)
                    .json(venue.reviews[venue.reviews.length - 1]))
                .catch(next)
        })
        .catch(next)
}



// const deleteAllReviews = (req, res, next) => {
//     Venue.findById(req.params.book_id)
//         .then((venue) => {
//             if (!venue) return res.status(404).json({ error: 'venue not found' })
//             venue.reviews = []
//             venue.save()
//                 .then((venue) => res.status(204).end())
//                 .catch(next)
//         }).catch(next)
// }

