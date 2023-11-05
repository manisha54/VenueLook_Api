const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const { verifyUser, verifyOwner } = require('../middleware/auth')

const userController = require('../controllers/user_controller')



//register
router.post('/register', (req, res, next) => {
    const { fName, lName, email, phoneNumber, password, role } = req.body
    User.findOne({ email: req.body.email })
        .then((user) => {
            // res.json(user)
            if (user) return res.status(400).json({ error: 'user already exist' })
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err.message })
                User.create({ fName, lName, email, phoneNumber, role, password: hash })
                    .then((user) => {
                        res.status(201).json(user)
                    }).catch(next)
            })
        }).catch(next)
})
