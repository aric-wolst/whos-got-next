const mongoose = require('mongoose')
const pointSchema = require('../model/point.js')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event Name is required']
    },
    organizers: {
        type: [String],
        required: [true, 'An event must have at least one organizer userID.']
    },
    players: {
        type: [String],
        required: [true, 'An event must have a (possibly empty) list of userIDs for players attending the event.']
    },
    description: {
        type: String,
        required: [true, 'Event Description is required']
    },
    location: {
        type: pointSchema,
        required: [true, 'A location for the event must be specified.']
    },
    date: {
        type: Date,
        required: [true, 'An event must have a date.']
    },
    pendingPlayerRequests: {
        type: [String],
        required: [true, 'An event must have a (possibly empty) list of userIDs corresponding to players who wish to attend the event.']
    },
    sport: {
        type: String,
        required: [false]
    },
    chat: {
        type: String,
        required: [false]
    },
    imageId: {
        type: String,
        required: [false]
    },
    address : {
        type : String,
        required: [false]
    }
})

module.exports = eventSchema
