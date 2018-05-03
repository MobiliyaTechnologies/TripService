'use strict';
/**
 *  This module is use to define tripDetails model
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
var tripDetails = commonModel.extendBase();

tripDetails.add({

    latitude: String,
    longitude: String,
    time: Date,
    milesDriven: String,
    fuelUsed: String,
    avgSpeed: String,
    topSpeed: String,
    mileage: String,
    speedings: String,
    hardBraking: String,
    engineFaults: String,
    accelerator: String,
    phoneUsage: String,
    vehicleId: {
        type: String,
        required: true
    },
    tripId: {
        type: String,
        required: true
    }
});


/**
 * Create the model for tripDetails
*  and expose it to app
*  @type {object}
*  @property {object}  tripDetails.
*/
module.exports = {
    tripDetails: tripDetails
};
