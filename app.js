require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const user_routes = require('./routes/user_routes')
const venue_routes = require('./routes/venue_routes')
const booking_routes = require('./routes/booking_routes')
const { verifyUser } = require('./middleware/auth')
const { verifyOwner } = require('./middleware/auth')
const upload = require('./middleware/upload')
const Venue = require('./models/Venue')
const User = require('./models/User')


const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URL
  : process.env.DB_URL



mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log(`connected to the ${MONGODB_URL} server`)
  })
  .catch((err) => console.log(err))



const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send("testing")
})


app.use('/users', user_routes)
app.use('/bookings', verifyUser, booking_routes)
app.use('/venues', verifyUser, venue_routes)
//app.post('/upload/:venue_id', upload.single('photo'), (req, res, next) => {


// app.post('/upload/', upload.single('photo'), (req, res, next) => {

//   res.json({data: req.file.filename})

// })




// // Endpoint to check if user's password has expired
// app.get('/check-password-expiration', verifyToken, (req, res) => {
//   const userId = req.user.id; // Assuming the authenticated user ID is extracted from the token
//   const user = user.find(u => u.id === userId);

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   const currentDate = new Date();
//   const lastPasswordChangeDate = new Date(user.lastPasswordChange);
//   const ninetyDays = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

//   if (currentDate - lastPasswordChangeDate >= ninetyDays) {
//     res.status(200).json({ message: 'Please update your password. Your password has expired.' });
//   } else {
//     res.status(200).json({ message: 'Your password is up to date.' });
//   }
// });






// // Endpoint to change user's password
// app.post('/change-password', verifyToken, async (req, res) => {
//   const userId = req.user.id; 
//   const { currentPassword, newPassword } = req.body; 

//   const user = user.find(u => u.id === userId);

//   if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//   }

//   // Check if the current password matches the stored hashed password
//   const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

//   if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//   }
//   // Hash the new password
//   const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//   user.password = hashedNewPassword;
//   user.lastPasswordChange = new Date(); // Update last password change date

//   res.status(200).json({ message: 'Password updated successfully' });
// });





app.post('/upload', upload.single('photo'), (req, res, next) => {
  console.log(req.file)

  res.json({ data: req.file.filename })

})




//error handling middleware
app.use((err, req, res, next) => {
  console.log(err)
  if (err.name === 'ValidatioError') res.status(400)
  else if (err.name === 'CastError') res.status(400)
  console.log(err.message)
  res.json({ error: err.message })
})



//unknown path

app.use((req, res) => {
  res.status(404).json({ error: "path not found" })
})

module.exports = app