'use strict';
/**
 *  This module is use to define trip model
 *  @module trip
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
/**
*  import npm modules
*/
var mongoose = require('mongoose');



/**
*  import project modules
*/
var commonModel = require('./common');


// in models/trip.js
var trip = commonModel.extendBase();

trip.add({
    status: {
        type: Number
    },
    tripName: {
        type: String,
        required: true,
        lowercase: true
    },
    description: { type: Object, default: null },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    commonId: {
        type: String,
        unique: true,
        required: true
    },
    tripDuration: {
        type: String,
        default: 0
    },
    milesDriven: {
        type: String,
        default: 0
    },
    fuelUsed: {
        type: String,
        default: 0
    },
    avgSpeed: {
        type: String,
        default: 0
    },
    topSpeed: {
        type: String,
        default: 0
    },
    mileage: {
        type: String,
        default: 0
    },
    speedings: {
        type: String,
        default: 0
    },
    stops: {
        type: Number,
        default: 0
    },
    locationDetails: [{
        latitude: String,
        longitude: String,
        time: String
    }],
    tripCompletedAt: {
        type: Date
    },
    hardBraking: {
        type: Number,
        default: 0
    },
    aggressiveAccelerator: {
        type: Number,
        default: 0
    },
    faultCount: {
        type: Number,
        default: 0
    }

});


/**
 * Create the model for trip
*  and expose it to app
*  @type {object}
*  @property {object}  trip.
// */
module.exports = {
    trip: trip
};
