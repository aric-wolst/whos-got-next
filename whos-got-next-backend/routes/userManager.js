/*
 *                            User Manager Module
 *
 * This module is responsible for creating, updating, and deleting user profiles.
 * Retrieval requests for a specific user profile are also handled here.
 */

var express = require('express');
var router = express.Router();

// MongoDB mDBConnector
const MongoDBConnector = require('../utils/mongoDBConnector')
const mDBConnector = MongoDBConnector.sharedInstance()

// Data Models.
const mongoose = require('mongoose')
const userSchema = require('../model/user.js')
const User = mongoose.model('user', userSchema, 'user')

router.use(express.json());

router.use(function(req, res, next) {
    console.log("You are in the userManager module");
    next();
});

router.get('/self', (req, res) => {
    res.status(200).send("Here is your profile!")
});

router.get('/:userId', (req, res) => {
    User.findById(req.params.userId, (err,user) => {
        if (err) {
            res.status(400).send(err)
            return
        }
        res.status(200).send(user)
    })
});

router.post('/', (req, res) => {
	const user = new User(req.body);
	mDBConnector.create(user).then(savedUser => {
		// console.log("saved user: " + savedUser);
        res.status(200).send(savedUser);
	}).catch((err) => {
        res.status(500).send(err);
        // console.error(err);
    });
})

module.exports = router;
