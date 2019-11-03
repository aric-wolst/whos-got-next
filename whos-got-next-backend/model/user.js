const mongoose = require("mongoose");
const Auth = require("../model/auth.js");
const pointSchema = require("../model/point.js");

const userSchema = new mongoose.Schema({
    authentication: {
        type: Auth,
        required: [true, "Email or Facebook Id is required for authentication"]
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"]
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
        enum: ["male", "female", "other"],
        required: [false]
    },
    description: {
        type: String,
        required: [false]
    },
    sports: {
        type: [{
            sport : {
                type: String,
                enum : ["Badminton", "Baseball", "Basketball", "Cricket", "Football", "Handball",
                    "Hockey", "Rugby", "Soccer", "Street Fighting", "Squash", "Tennis", "Volleyball"],
                required: true
            },
            level : {
                type : Number,
                enum : [1, 2, 3],
                required : true
            }
        }],
        required: [false]
    },
    expoPushToken: {
        type: String,
        required: [false]
    },
    location : {
        type: pointSchema,
        required: [false]
    }
});

module.exports = userSchema
