/*
 *                            Event Manager Module
 *
 * This module is responsible for creating, updating, and deleting events.
 * Retrieval requests for a specific event are also handled here.
 */

const express = require("express");
const router = express.Router();
const defineRegion = require("../utils/region.js");
const axios = require("axios");

const sendNotifications = require("../utils/pushNotificationManager")

// MongoDB mDBConnector
const MongoDBConnector = require("../utils/mongoDBConnector");
const mDBConnector = MongoDBConnector.sharedInstance();

// Data Models.
const mongoose = require("mongoose");
const eventSchema = require("../model/event.js");
const Event = mongoose.model("event", eventSchema, "event");
const userSchema = require("../model/user.js")
const User = mongoose.model("user", userSchema, "user")

router.use(express.json());

router.use(function(req, res, next) {
    console.log("You are in the eventManager module");
    next();
});

router.post("/", (req, res) => {
    const event = new Event(req.body);

    const latitude = req.body.location.coordinates[1];
    const longitude = req.body.location.coordinates[0];

    //Endpoint to get address from coordinates
    const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + latitude + "&lon=" + longitude;
    getAddress(url).then(response => {
        event.address = response;
        mDBConnector.create(event).then(savedEvent => {
            res.status(200).send(savedEvent);
            const notification = {title: "New Event: " + savedEvent.name, body: "There is a new event near you."};
            sendPushNotificationToUsersNear(notification, savedEvent.location, 5);
        }).catch((err) => {
            res.status(400).send(err);
        });
    }).catch(err => {
        console.error(err);
    });
});

router.get("/:eventId", (req, res) => {
    if (req.params.eventId == "nearby") {
        getNearbyEvents(req,res);
        return;
    }

    Event.findById(req.params.eventId, (err,event) => {
        if (err) {
            res.status(400).send(err);
            return
        }
        res.status(200).send(event);
    })
});

router.put("/:eventId", (req, res) => {
    Event.findByIdAndUpdate(req.params.eventId, req.body, {returnOriginal: false}, (err,event) => {
        if (err) {
            res.status(400).send(err);
            return
        }

        res.status(200).send(event);
    })
});

router.delete("/:eventId", (req, res) => {
    Event.findByIdAndDelete(req.params.eventId, req.body, (err,event) => {
        if (err) {
            res.status(400).send(err);
            return
        }

        res.status(200).send("Event deleted");
    })
})

async function getAddress(url) {
    let res = await axios.get(url).catch(err => {
        console.error("Could not retrieve address");
    });


    return await stitchAddress(res.data.address);
}

async function stitchAddress(address) {
    let addr = "";
    let hood = address.neighbourhood;
    let number = address.house_number;
    let road = address.road;
    let city = address.city;
    let state = address.state;

    if (hood) {
        addr = addr + hood + ",";
    }

    if (number) {
        addr = addr + " " + number;
    }

    if (road) {
        addr = addr + " " + road;
    }

    if (city) {
        addr = addr + ", " + city;
    }

    if (state) {
        addr = addr + ", " + state;
    }
    return addr;
}

function getNearbyEvents(req,res) {
    // Define a region of a given distance in km around the location.
    const distance = 5;
    const {n, e, s, w} = defineRegion(req.query.longitude, req.query.latitude, distance);

    // Fetch events in this region.
    const filter = {"location.coordinates.0" : { $gt : w, $lt : e }, "location.coordinates.1" : { $gt : s, $lt : n }}
    Event.find(filter).limit(30).exec((err, events) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
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
    }

    User.find(filter, (err, users) => {
        if (err) { console.error(err); return; }
        const tokens = users.map(user => user.expoPushToken);
        sendNotifications(tokens,notification.title, notification.body)
    });
}

router.put("/:eventId/requests/:userId/request-to-join", (req,res) => {
    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }
        const userId = req.params.userId;

        User.findById(userId, (err,user) => {
            if (err) { res.status(400).send(err); return; }
            if (!user) {
                res.status(401).send("No user matching id: " + userId);
                return;
            }
            if (!event) {
                res.status(402).send("No event matching id: " + eventId);
                return;
            }

            if (event.players.includes(userId) || event.organizers.includes(userId) || event.pendingPlayerRequests.includes(userId)) {
                res.status(403).send("Event already has added user.");
                return;
            }
            event.pendingPlayerRequests.push(userId);
            event.save((err,events) => {
                if (err) { res.status(400).send(err); return; }
                res.status(200).send(event);
            });
        });

    })
});

router.put("/:eventId/requests/:userId/accept", (req,res) => {
    const userId = req.params.userId;

    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }

        if (!event) { res.status(402).send("No event matching id: " + eventId); return; }

        if (event.players.includes(userId) || event.organizers.includes(userId)) {
            res.status(403).send("Event already has accepted request from user.");
            return;
        }

        const i = event.pendingPlayerRequests.indexOf(userId);
        if (i > -1) {
            event.pendingPlayerRequests.splice(i, 1)
        } else {
            res.status(401).send("No user matching user id " + userId + "in the pendingRequests")
            return;
        }

        event.players.push(userId);

        event.save((err,events) => {
            if (err) { res.status(400).send(err); return; }
            res.status(200).send(event);
        });
    });
});

router.put("/:eventId/requests/:userId/decline", (req,res) => {
    const userId = req.params.userId;

    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }

        if (!event) { res.status(402).send("No event matching id: " + eventId); return; }

        const i = event.pendingPlayerRequests.indexOf(userId);
        if (i > -1) {
            event.pendingPlayerRequests.splice(i, 1)
        } else {
            res.status(401).send("No user matching user id " + userId + "in the pendingRequests")
            return;
        }

        event.save((err,events) => {
            if (err) { res.status(400).send(err); return; }
            res.status(200).send(event);
        });
    });
});


module.exports = router;
