const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'owner'],
        default: 'user'
    },
    resetPasswordToken: String, // Field for storing password reset token
    resetPasswordExpires: Date, // Field for storing token expiry date
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.password;
        delete returnedDocument.__v;
    }
});

module.exports = mongoose.model('User', userSchema);
