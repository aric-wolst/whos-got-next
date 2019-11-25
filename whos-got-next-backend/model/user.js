const mongoose = require("mongoose");
const Auth = require("../model/auth.js");
const pointSchema = require("../model/point.js");

// Load Local Config if not in test environment.catch
let key;
if (process.env.NODE_ENV !== "test") {
    const localconfig = require("../localconfig");
    key = localconfig.privateKey;
}

const jwt = require("jsonwebtoken");

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

//Generate Authentication Token
userSchema.methods.generateAuthToken = function() {
    // Generate random request token in test environment.
    if (process.env.NODE_ENV === "test") { return "TestKey"; }

    const token = jwt.sign({fbToken: this.authentication.token}, key);
    return token;
};

module.exports = userSchema;
