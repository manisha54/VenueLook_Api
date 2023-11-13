
const Booking = require('../models/Booking')
const Venue = require('../models/Venue')



const getAllBookingVenue = (req, res, next) =>{
    Booking.find()
    .then(bookings => res.
        json(bookings))
    .catch(next)
}






const createBookingVenue = (req, res) => {
    Venue.findById(req.params.venue_id)
    .then(venue => {
        if (!venue) return res.status(404).json({ error: " venue not found" })
        const user_id = req.user.id;
        const newBooking = {
            time: req.body.time,
            date: req.body.date,
            contactNumber: req.body.contactNumber,
            user: user_id,
            venue: req.params.venue_id,
            fullName:`${ req.user.fName} ${req.user.lName}`
        
        }
        // res.json(newBooking);
        Booking.create(newBooking)
            .then(successBooking => {
                res.json({
                    success:true,
                    data:[successBooking]
                });
            })
            .catch(err => res.json({ error: err.message }))

        // res.json(venue);
    })
    .catch(err => res.json({ error: err.message }))
}
