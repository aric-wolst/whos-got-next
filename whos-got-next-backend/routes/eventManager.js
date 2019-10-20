/*
 *                            Event Manager Module
 *
 * This module is responsible for creating, updating, and deleting events.
 * Retrieval requests for a specific event are also handled here.
 */

var express = require('express');
var router = express.Router();

// MongoDB mDBConnector
const MongoDBConnector = require('../utils/mongoDBConnector');
const mDBConnector = MongoDBConnector.sharedInstance();

// Data Models.
const mongoose = require('mongoose');
const eventSchema = require('../model/event.js');
const Event = mongoose.model('event', eventSchema, 'event');
const userSchema = require('../model/user.js')
const User = mongoose.model('user', userSchema, 'user')

router.use(express.json());

router.use(function(req, res, next) {
    console.log("You are in the eventManager module");
    next();
});

router.post('/', (req, res) => {
	const event = new Event(req.body);
	mDBConnector.create(event).then(savedEvent => {
        res.status(200).send(savedEvent);
	}).catch((err) => {
        res.status(400).send(err);
    });
})

router.get('/:eventId', (req, res) => {
    if (req.params.eventId == 'nearby') {
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

router.put('/:eventId', (req, res) => {
    Event.findByIdAndUpdate(req.params.eventId, req.body, {returnOriginal: false}, (err,event) => {
        if (err) {
            res.status(400).send(err);
            return
        }

        res.status(200).send(event);
    })
});

router.delete('/:eventId', (req, res) => {
    Event.findByIdAndDelete(req.params.eventId, req.body, (err,event) => {
        if (err) {
            res.status(400).send(err);
            return
        }

        res.status(200).send('Event deleted');
    })
})

function getNearbyEvents(req,res) {
    // Todo: Actually find nearby events.
    console.log('Fetching events near: [' + req.query.longitude +', ' + req.query.latitude +']');
    Event.find({}, (err, events) => {
        if (err) {
            res.status(400).send(err);
            return
        }

        res.status(200).send(events);
    });
}

router.put('/:eventId/requests/:userId/request-to-join', (req,res) => {
    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }
        const userId = req.params.userId;

        User.findById(userId, (err,user) => {
            if (err) { res.status(400).send(err); return; }
            if (!user) {
                res.status(401).send('No user matching id: ' + userId);
                return;
            }
            if (!event) {
                res.status(402).send('No event matching id: ' + eventId);
                return;
            }

            if (event.players.includes(userId) || event.organizers.includes(userId) || event.pendingPlayerRequests.includes(userId)) {
                res.status(403).send('Event already has added user.');
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

router.put('/:eventId/requests/:userId/accept', (req,res) => {
    const userId = req.params.userId;

    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }

        if (!event) { res.status(402).send('No event matching id: ' + eventId); return; }

        if (event.players.includes(userId) || event.organizers.includes(userId)) {
            res.status(403).send('Event already has accepted request from user.');
            return;
        }

        const i = event.pendingPlayerRequests.indexOf(userId);
        if (i > -1) {
            event.pendingPlayerRequests.splice(i, 1)
        } else {
            res.status(401).send('No user matching user id ' + userId + 'in the pendingRequests')
            return;
        }

        event.players.push(userId);

        event.save((err,events) => {
            if (err) { res.status(400).send(err); return; }
            res.status(200).send(event);
        });
    });
});

router.put('/:eventId/requests/:userId/decline', (req,res) => {
    const userId = req.params.userId;

    Event.findById(req.params.eventId, (err,event) => {
        if (err) { res.status(400).send(err); return; }

        if (!event) { res.status(402).send('No event matching id: ' + eventId); return; }

        const i = event.pendingPlayerRequests.indexOf(userId);
        if (i > -1) {
            event.pendingPlayerRequests.splice(i, 1)
        } else {
            res.status(401).send('No user matching user id ' + userId + 'in the pendingRequests')
            return;
        }

        event.save((err,events) => {
            if (err) { res.status(400).send(err); return; }
            res.status(200).send(event);
        });
    });
});


module.exports = router;
