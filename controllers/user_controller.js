const User = require('../models/User')


const getAllUsers = (req, res, next) => {
    User.find()
        .then(users => res.json(users))
        .catch(next)
}




const deleteAllUsers = (req, res, next) => {
    User.deleteMany()
        .then(reply => res.json(reply))
        .catch(next)
}


const getUserById = (req, res, next) => {
    User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: 'user not found' })
            }
            res.json({
                success: true,
                data: [user]
            })
        })
        .catch(next)
}