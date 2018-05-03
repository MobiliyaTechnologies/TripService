'use strict';
/**
 *  This module is use to define vehicle history model
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
var vehicleHistory = commonModel.extendBase();

vehicleHistory.add({
    data: { type: Object, default: null },
    vehicleId: {
        type: String,
        required: true
    }

});


/**
 * Create the model for vehicleHistory
*  and expose it to app
*  @type {object}
*  @property {object}  vehicleHistory.
*/
module.exports = {
    vehicleHistory: vehicleHistory
};
