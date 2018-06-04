'use strict';
/**
 *  This module is use to define fault data model
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
var faultData = commonModel.extendBase();

faultData.add({

    faultSPN: String,
    faultDescription: String,
    parameterDateTime: String,
    tripId: {
        type: String
    },
    vehicleId: {
        type: String
    }
});



/**
 * Create the model for fault data
*  and expose it to app
*  @type {object}
*  @property {object}  faultData.
*/
module.exports = {
    faultData: faultData
};
