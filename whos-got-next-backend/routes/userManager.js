/*
 *                            User Manager Module
 *
 * This module is responsible for creating, updating, and deleting user profiles.
 * Retrieval requests for a specific user profile are also handled here.
 */

var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    console.log("You are in the userManager module");
    next();
});

router.get('/self', (req, res) => {
    res.status(200).send("Here is your profile!")
});

module.exports = router;