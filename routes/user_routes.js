const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const { verifyUser, verifyOwner } = require('../middleware/auth')

const userController = require('../controllers/user_controller')
