const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const { verifyUser, verifyOwner } = require('../middleware/auth')
const userController = require('../controllers/user_controller')



// Common passwords list
const commonPasswords = ['password', '123456', 'manisha','password12345', /* Add more common passwords here... */];

function isSimilarPassword(userPassword) {
    const threshold = 3; // Example threshold for similarity

    for (const commonPassword of commonPasswords) {
        const distance = calculateLevenshteinDistance(userPassword.toLowerCase(), commonPassword.toLowerCase());
        if (distance <= threshold) {
            return true; // Password is considered too similar
        }
    }
    return false; // Password is not too similar
}

// Function to calculate Levenshtein Distance between two strings
function calculateLevenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = [];

    for (let i = 0; i <= m; i++) {
        dp[i] = [];
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}

router.post('/register', (req, res, next) => {
    const { fName, lName, email, phoneNumber, password, role } = req.body;

    // Check if all fields are empty
    if (!fName && !lName && !email && !phoneNumber && !password) {
        return res.status(400).json({
            error: 'All fields are required.'
        });
    }

    // Check for individual empty fields
    if (!fName) {
        return res.status(400).json({
            error: 'First Name is required.'
        });
    }
    if (!lName) {
        return res.status(400).json({
            error: 'Last Name is required.'
        });
    }
    if (!email) {
        return res.status(400).json({
            error: 'Email is required.'
        });
    }
    if (!phoneNumber) {
        return res.status(400).json({
            error: 'Phone Number is required.'
        });
    }
    if (!password) {
        return res.status(400).json({
            error: 'Password is required.'
        });
    }


   
    // Regular expressions for password criteria
    const passwordRegex = {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        numbers: /[0-9]/,
        specialChars: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
    };

    // Check if the password meets the required criteria
    if (
        !passwordRegex.uppercase.test(password) ||
        !passwordRegex.lowercase.test(password) ||
        !passwordRegex.numbers.test(password) ||
        !passwordRegex.specialChars.test(password)
    ) {
        return res.status(400).json({
            error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        });
    }

    // Check for minimum password length
    const minPasswordLength = 8;
    if (password.length < minPasswordLength) {
        return res.status(400).json({
            error: `Password must be at least ${minPasswordLength} characters long.`
        });
    }

    // Check if the password is too similar to common passwords
    if (isSimilarPassword(password)) {
        return res.status(400).json({
            error: 'Password is too similar to common passwords. Please choose a stronger password.'
        });
    }
    // Check for other criteria as needed...




    
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) return res.status(400).json({ error: 'User already exists.' });

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err.message });

                User.create({ fName, lName, email, phoneNumber, role, password: hash })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch(next);
            });
        })
        .catch(next);
});








//login

const maxFailedAttempts = 5; // Define the maximum number of allowed failed login attempts

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    // Check if all fields are empty
    if (!email && !password) {
        return res.status(400).json({
            error: 'Email and password are required.'
        });
    }

    // Check for individual empty fields
    if (!email) {
        return res.status(400).json({
            error: 'Email is required.'
        });
    }
    if (!password) {
        return res.status(400).json({
            error: 'Password is required.'
        });
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) return res.status(400).json({ error: 'User is not registered' })

            if (user.isLocked) {
                return res.status(401).json({ error: 'Account locked. Please contact support.' });
            }

            bcrypt.compare(req.body.password, user.password, (err, success) => {
                if (err) return res.status(500).json({ error: err.message })

                if (!success) {
                    user.failedLoginAttempts += 1; // Increment failed login attempts
                    user.save(); // Save the updated user document

                    if (user.failedLoginAttempts >= maxFailedAttempts) {
                        user.isLocked = true; // Lock the account
                        user.save();
                        return res.status(401).json({ error: 'Account locked due to multiple failed login attempts.' });
                    }

                    return res.status(400).json({ error: 'Incorrect password' });
                }

                // Reset failed login attempts on successful login
                user.failedLoginAttempts = 0;
                user.save();

                const payload = {
                    id: user.id,
                    fName: user.fName,
                    lName: user.lName,
                    email: user.email,
                    role: user.role
                }

                // Generate JWT for authenticated user
                jwt.sign(payload,
                    process.env.SECRET,
                    { expiresIn: '20d' },
                    (err, token) => {
                        if (err) return res.status(500).json({ error: err.message })
                        res.json({ status: 'Login successful', token: token })
                    })
            })
        }).catch(next)
})




router.route('/')
    .get(userController.getAllUsers)
    .delete((req, res, next) => {
        // Add the logic to delete all users here
        User.deleteMany({})
            .then(() => {
                res.status(200).json({ message: 'All users deleted successfully.' });
            })
            .catch(next);
    })
// .post((req, res) => {
//     res.status(405).json({ error: 'POST request is not allowed' })
// })
// .put((req, res) => {
//     res.status(405).json({ error: "PUT request is not allowed" })
// })



router.route('/userinfo')
    .get(verifyUser, userController.getUserById)
    // .post((req, res) => {
    //     res.status(405).json({ error: 'POST request is not allowed' })
    // })
    .put(verifyUser, userController.updateUserById)
    .delete(verifyUser, userController.deleteUserById)







module.exports = router