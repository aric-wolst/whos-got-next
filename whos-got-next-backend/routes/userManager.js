/*
 *                            User Manager Module
 *
 * This module is responsible for creating, updating, and deleting user profiles.
 * Retrieval requests for a specific user profile are also handled here.
 */

var express = require("express");
var router = new express.Router();
var authenticateWithFB = require("../utils/auth.js");
var axios = require("axios");
const {guardErrors, guardDefaultError} = require("../utils/guardErrors.js");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// MongoDB mDBConnector
const MongoDBConnector = require("../utils/mongoDBConnector");
const mDBConnector = MongoDBConnector.sharedInstance();

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
        if (!user) {log.info("no user exists");}
        res.status(200).send(user);
    });
}

router.use(function(req, res, next) {
    log.info("You are in the userManager module");
    next();
});

router.post("/", (req, res) => {
	const user = new User(req.body);
    User.findOne({"authentication.type": user.authentication.type, "authentication.identifier": user.authentication.identifier}, (err,existingUser) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (existingUser), status: 401, message: "User with auth: " + existingUser.authentication + " is already in the database"},
        ], res)) { return; }

        const token = user.authentication.token;
        if (token) {
            authenticateWithFB(token).then(() => {
                mDBConnector.create(user).then( (savedUser) => {
                    res.status(200).send(savedUser);
                }).catch((err) => {
                    if (guardDefaultError(err,res)) {return;}
                });

                // Get user name.
                const userId = user.authentication.identifier;
                const fbUrl = "https://graph.facebook.com/" + userId + "?fields=name&access_token=" + user.authentication.token;
                axios.get(fbUrl).then( (response) => {
                    const name = response.data.name;
                    log.info("Successfully authenticated " + name);
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
    User.findByIdAndUpdate(req.params.userId, req.body, {returnOriginal: false}, (err,user) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(user);
    });
});

router.put("/:userId/save-expo-push-token/:expoPushToken", (req, res) => {
    User.findByIdAndUpdate(req.params.userId, {expoPushToken: req.params.expoPushToken}, {returnOriginal: false}, (err,user) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(user);
    });
});

router.delete("/:userId", (req, res) => {
    User.findByIdAndDelete(req.params.userId, req.body, (err) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send("User deleted");
    });
});


module.exports = router;
