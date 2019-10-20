const mongoose = require('mongoose')

const Auth = require('../model/auth.js')

const userSchema = new mongoose.Schema({
    authentication: {
        type: Auth,
        required: [true, 'Email or Facebook Id is required for authentication']
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
    },
    expoPushToken: {
        type: String,
        required: [false]
    }
})

module.exports = userSchema
