const User = require('../models/User')


const getAllUsers = (req, res, next) => {
    User.find()
        .then(users => res.json(users))
        .catch(next)
}