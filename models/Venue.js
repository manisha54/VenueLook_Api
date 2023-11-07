const mongoose = require('mongoose')




//review venue schema
const reviewScheme = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: 10
    },

    //for user id on review (name should match with model name )
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: {
        type: String
    }
})


//remove unnessary

reviewScheme.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString()
        delete returnedDocument._id

    }

})