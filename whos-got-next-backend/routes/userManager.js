/*
 *                            User Manager Module
 *
 * This module is responsible for creating, updating, and deleting user profiles.
 * Retrieval requests for a specific user profile are also handled here.
 */

var express = require("express");
var router = new express.Router();
var auth = require("../utils/auth.js");
const {guardErrors, guardDefaultError} = require("../utils/guardErrors.js");
const { Expo } = require("expo-server-sdk");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// Data Models.
const mongoose = require("mongoose");
const userSchema = require("../model/user.js");
const User = mongoose.model("user", userSchema, "user");

router.use(express.json());

function getSelf(req,res) {
    User.findOne({}, (err,user) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(user);
    });
}

function getExists(req,res) {
    User.findOne({"authentication.type": req.query.type, "authentication.identifier": req.query.identifier}, (err, user) => {
        if (guardDefaultError(err,res)) {return;}
        if (!user || user === null) {
            log.info("no user exists");
            res.status(200).send(user);
            return;
        }
        const reqToken = user.generateAuthToken();
        res.header("requestToken", reqToken).status(200).send(user);
    });
}

router.use(function(req, res, next) {
    log.info("You are in the userManager module");
    next();
});

router.post("/", (req, res) => {
	const user = new User(req.body);
    if (guardErrors([
        {condition: (user.validateSync()), status: 400, message: "User object is not valid"},
        {condition: (!user), status: 403, message: "No user info provided."}
    ], res)) { return; }

    User.findOne({"authentication.type": user.authentication.type, "authentication.identifier": user.authentication.identifier}, (err,existingUser) => {

        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (existingUser), status: 401, message: "User with auth: " + user.authentication + " is already in the database"},
        ], res)) { return; }

        const token = user.authentication.token;
        if (token) {
            auth.authenticateWithFB(token).then(() => {
                user.save().then( (savedUser) => {
                    const reqToken = user.generateAuthToken();
                    res.header("requestToken", reqToken).status(200).send(savedUser);
                }).catch((err) => {
                    if (guardDefaultError(err,res)) {return;}
                });
            }).catch( (err) => {
                guardErrors([{condition: true, status: 402, message: err}], res);
            });
        }
    });
});

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;
    if (userId === "self") {
        getSelf(req,res);
        return;
    }

    if (req.params.userId === "exists") {
        getExists(req,res);
        return;
    }

    User.findById(userId, (err,user) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (!user), status: 401, message: "No user found with id: " + userId},
        ], res)) {return;}

        res.status(200).send(user);
    });
});

router.put("/:userId", (req, res) => {
    // Find and update user.
    User.findByIdAndUpdate(req.params.userId, req.body, {returnOriginal: false}, (err,user) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(user);
    });
});

router.put("/:userId/save-expo-push-token/:expoPushToken", (req, res) => {
    // Check that pushToken is valid Expo push token on the form ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx].
    const pushToken = req.params.expoPushToken;
    if (guardErrors([ {condition: (!Expo.isExpoPushToken(pushToken)), status: 401, message: "Invalid expo push token."} ], res)) {return;}

    // Add Push token to user.
    User.findByIdAndUpdate(req.params.userId, {expoPushToken: req.params.expoPushToken}, {returnOriginal: false}, (err,user) => {
        if (guardDefaultError(err,res)) {return;}
        res.status(200).send(user);
    });
});

router.delete("/:userId", (req, res) => {
    const userId = req.params.userId;
    User.findByIdAndDelete(userId, req.body, (err, deletedUser) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (!deletedUser), status: 410, message: "No user found with id: " + userId},
        ], res)) {return;}

        res.status(200).send("User deleted");
    });
});


module.exports = router;
