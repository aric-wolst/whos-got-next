/*
 *                            User Manager Module
 *
 * This module is responsible for creating, updating, and deleting user profiles.
 * Retrieval requests for a specific user profile are also handled here.
 */

var express = require("express");
var router = express.Router();
var authenticateWithFB = require("../utils/auth.js");
var axios = require("axios");

// MongoDB mDBConnector
const MongoDBConnector = require("../utils/mongoDBConnector")
const mDBConnector = MongoDBConnector.sharedInstance()

// Data Models.
const mongoose = require("mongoose")
const userSchema = require("../model/user.js")
const User = mongoose.model("user", userSchema, "user")

router.use(express.json());

router.use(function(req, res, next) {
    console.log("You are in the userManager module");
    next();
});

router.post("/", (req, res) => {
	const user = new User(req.body);
    User.findOne({"authentication.type": user.authentication.type, "authentication.identifier": user.authentication.identifier}, (err,existingUser) => {
        if (err) { res.status(400).send(err); console.log("errror"); return; }

        if (existingUser) {
            res.status(401).send("User with auth: " + existingUser.authentication + " is already in the database");
        } else {
            const token = user.authentication.token
            if (token) {
                authenticateWithFB(token).then(() => {
                    mDBConnector.create(user).then(savedUser => {
                        res.status(200).send(savedUser);
                    }).catch((err) => {
                        res.status(400).send(err);
                    })

                    //Get user name
                    const user_id = user.authentication.identifier
                    const fb_url = "https://graph.facebook.com/" + user_id + "?fields=name&access_token=" + user.authentication.token
                    axios.get(fb_url).then(response => {
                        const name = response.data.name
                        console.log("Successfully authenticated " + name)
                    })
                }).catch(err => {
                    res.status(402).send(err)
                })
            }
        }
    });
})

router.get("/:userId", (req, res) => {
    const userId = req.params.userId
    if (userId == "self") {
        getSelf(req,res);
        return;
    }

    if (req.params.userId == "exists") {
        getExists(req,res);
        return;
    }

    User.findById(userId, (err,user) => {
        if (err) { res.status(400).send(err); return; }
        if (!user) { res.status(401).send("No user found with id: " + userId)}
        res.status(200).send(user)
    })
});

router.put("/:userId", (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body, {returnOriginal: false}, (err,user) => {
        if (err) {
            res.status(400).send(err)
            return
        }

        res.status(200).send(user)
    })
});

router.put("/:userId/save-expo-push-token/:expoPushToken", (req, res) => {
    User.findByIdAndUpdate(req.params.userId, {expoPushToken: req.params.expoPushToken}, {returnOriginal: false}, (err,user) => {
        if (err) {
            res.status(400).send(err)
            return
        }

        res.status(200).send(user)
    })
});

router.delete("/:userId", (req, res) => {
    User.findByIdAndDelete(req.params.userId, req.body, (err,user) => {
        if (err) {
            res.status(400).send(err)
            return
        }

        res.status(200).send("User deleted")
    })
})

function getSelf(req,res) {
    User.findOne({}, (err,user) => {
        if (err) {
            res.status(400).send(err)
            return
        }

        res.status(200).send(user)
    })
}

function getExists(req,res) {
    User.findOne({"authentication.type": req.query.type, "authentication.identifier": req.query.identifier}, (err, user) => {
        if (err) { res.status(400).send(err); return; }
        if (!user) {console.log("no user exists")}
        res.status(200).send(user);
    });
}

module.exports = router;
