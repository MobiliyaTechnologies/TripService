'use strict';
/**
 *  This module is use to define rule model
 *  @module trip
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
/**
*  import npm modules
*/
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
/**
*  import project modules
*/
var commonModel = require('./common');


// in models/trip.js
var rule = commonModel.extendBase();

rule.add({
    ruleName: {
        type: String,
        required: true
    },
    ruleType: {
        type: String,
        required: true
    },
    speedLimit: {
        type: SchemaTypes.Double
    },
    latitude: {
        type: SchemaTypes.Double
    },
    longitude: {
        type: SchemaTypes.Double
    },
    radius: {
        type: SchemaTypes.Double
    },
    userId: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    }
});


/**
 * Create the model for rule
*  and expose it to app
*  @type {object}
*  @property {object}  rule.
*/
module.exports = {
    rules: rule
};
