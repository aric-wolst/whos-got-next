const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    emailVerified: {
        type: Boolean,
        required: [false]
    },
    birthday: {
        type: Date,
        required: [false]
    },
    gender: {
        type: String,
        required: [false]
    },
    description: {
        type: String,
        required: [false]
    },
    sports: {
        type: Array,
        required: [false]
    }
})

module.exports = userSchema
