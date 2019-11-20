/*
 *                            Event Manager Module
 *
 * This module is responsible for creating, updating, and deleting events.
 * Retrieval requests for a specific event are also handled here.
 */

const express = require("express");
const router = new express.Router();
const defineRegion = require("../utils/region.js");
const axios = require("axios");
const {guardErrors, guardDefaultError} = require("../utils/guardErrors.js");
const sendNotifications = require("../utils/pushNotificationManager");
var auth = require("../utils/auth.js");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// Data Models.
const mongoose = require("mongoose");
const eventSchema = require("../model/event.js");
const Event = mongoose.model("event", eventSchema, "event");
const userSchema = require("../model/user.js");
const User = mongoose.model("user", userSchema, "user");

router.use(express.json());

router.use(function(req, res, next) {
    log.info("You are in the eventManager module");

    // Authenticate the request.
    auth.authenticateRequest(req)
        .then(() => { next(); }).catch((error) => {
        res.status(400).send(error);
    });
});

async function stitchAddress(address) {
    const {neighbourhood: hood, house_number: number, road, city, state} = address;
    const roadField = (number ? number + (road ? " " + road : "") : road);
    const fields = [hood, roadField, city, state].filter((item) => item);
    const addr = fields.join(", ");
    return addr;
}

async function getAddress(url) {
    let res = await axios.get(url).catch ( (err) => {
        log.error("Could not retrieve address. Gave error: " + err);
    });

    if (res.data.error) {
        return new Promise((resolve,reject) => { reject(res.data.error);});
    }
    return await stitchAddress(res.data.address);
}

function getNearbyEvents(req,res) {
    // Define a region of a given distance in km around the location.
    const distance = 5;
    const {n, e, s, w} = defineRegion(req.query.longitude, req.query.latitude, distance);

    // Fetch events in this region.
    const filter = {"location.coordinates.0" : { $gt : w, $lt : e }, "location.coordinates.1" : { $gt : s, $lt : n }};
    Event.find(filter).limit(30).exec((err, events) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(events);
    });
}


function sendPushNotificationToUsersNear(notification, location, distance) {
    // Define a region of a given distance in km around the location.
    const {n, e, s, w} = defineRegion(location.coordinates[0], location.coordinates[1], distance);

    // Fetch events in this region.
    const filter = {
        "location.coordinates.0" : { $gt : w, $lt : e },
        "location.coordinates.1" : { $gt : s, $lt : n },
        "expoPushToken": {$exists: true}
    };

    User.find(filter, (err, users) => {
        if (err) { log.error(err); return; }
        const tokens = users.map( (user) => user.expoPushToken);
        sendNotifications(tokens,notification.title, notification.body);
    });
}

router.post("/", (req, res) => {
    const event = new Event(req.body);
    if (guardErrors([
        {condition: (event.validateSync()), status: 400, message: "Event object is not valid"},
        {condition: (!event), status: 402, message: "No event info provided."}
    ], res)) { return; }

    const latitude = req.body.location.coordinates[1];
    const longitude = req.body.location.coordinates[0];

    // Endpoint to get address from coordinates.
    const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + latitude + "&lon=" + longitude;
    getAddress(url).then( (response) => {
        event.address = response;
        event.save().then( (savedEvent) => {
            res.status(200).send(savedEvent);
            const notification = {title: "New Event: " + savedEvent.name, body: "There is a new event near you."};
            sendPushNotificationToUsersNear(notification, savedEvent.location, 5);
        }).catch((err) => {
            guardDefaultError(err);
        });
    }).catch( (err) => {
        guardErrors([{condition: true, status: 401, message: err}]);
    });
});

router.get("/:eventId", (req, res) => {
    if (req.params.eventId === "nearby") {
        getNearbyEvents(req,res);
        return;
    }

    Event.findById(req.params.eventId, (err,event) => {
        if (guardDefaultError(err,res)) {return;}
        res.status(200).send(event);
    });
});

router.put("/:eventId", (req, res) => {
    Event.findByIdAndUpdate(req.params.eventId, req.body, {returnOriginal: false}, (err,event) => {
        if (guardDefaultError(err,res)) {return;}

        res.status(200).send(event);
    });
});

router.delete("/:eventId", (req, res) => {
    const eventId = req.params.eventId;
    Event.findByIdAndDelete(eventId, req.body, (err, deletedEvent) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (!deletedEvent), status: 410, message: "No event found with id: " + eventId},
        ], res)) {return;}
        res.status(200).send("Event deleted");
    });
});

router.put("/:eventId/requests/:userId/request-to-join", (req,res) => {
    const eventId = req.params.eventId;
    Event.findById(eventId, (err,event) => {
        if (guardDefaultError(err,res)) {return;}
        const userId = req.params.userId;

        User.findById(userId, (err,user) => {
            if (guardErrors([
                {condition: (err), status: 400, message: err},
                {condition: (!user), status: 401, message: "No user matching id: " + userId},
                {condition: (!event), status: 402, message: "No event matching id: " + eventId}
            ], res)) { return; }

            if (guardErrors([{
                condition: (event.players.includes(userId) || event.organizers.includes(userId) || event.pendingPlayerRequests.includes(userId)),
                status: 403,
                message: "Event already has added user."
            }], res)) { return; }

            event.pendingPlayerRequests.push(userId);
            event.save((err,event) => {
                if (guardDefaultError(err,res)) {return;}
                res.status(200).send(event);
            });
        });

    });
});

router.put("/:eventId/requests/:userId/accept", (req,res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    Event.findById(eventId, (err,event) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (!event), status: 402, message: "No event matching id: " + eventId},
        ], res)) { return; }

        const pendingPlayerIndex = event.pendingPlayerRequests.indexOf(userId);
        if (guardErrors([
            {condition: (event.players.includes(userId) || event.organizers.includes(userId)), status: 403, message: "Event already has accepted request from user."},
            {condition: (pendingPlayerIndex < 0), status: 401, message: "No user matching user id " + userId + " in the pendingRequests"}
        ], res)) {return;}

        event.pendingPlayerRequests.splice(pendingPlayerIndex, 1);
        event.players.push(userId);

        event.save((err,event) => {
            if (guardDefaultError(err,res)) {return;}
            res.status(200).send(event);
        });
    });
});

router.put("/:eventId/requests/:userId/decline", (req,res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    Event.findById(eventId, (err,event) => {
        if (guardErrors([
            {condition: (err), status: 400, message: err},
            {condition: (!event), status: 402, message: "No event matching id: " + eventId},
        ], res)) { return; }

        const pendingPlayerIndex = event.pendingPlayerRequests.indexOf(userId);
        if (guardErrors([
            {condition: (pendingPlayerIndex < 0), status: 401, message: "No user matching user id " + userId + " in the pendingRequests"}
        ], res)) {return;}

        event.pendingPlayerRequests.splice(pendingPlayerIndex, 1);

        event.save((err,event) => {
            if (guardDefaultError(err,res)) {return;}
            res.status(200).send(event);
        });
    });
});


module.exports = router;
