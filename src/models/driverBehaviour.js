'use strict';
/**
 *  This module is use to define driver behaviour  model
 *  @module trip
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
/**
*  import npm modules
*/
var mongoose = require('mongoose');
var connection = require('../config/databaseConnection');

/**
*  import project modules
*/
var commonModel = require('./common');


// in models/trip.js
var driverBehaviour = commonModel.extendBase();

driverBehaviour.add({
    tripId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    percentageofTimeAndDistanceAlgo: {
        eff_rpm_time_amber_percentage: String,
        eff_rpm_time_amber: String,
        eff_rpm_time_green_percentage: String,
        eff_rpm_time_green: String,
        eff_rpm_time_red_percentage: String,
        eff_rpm_time_red: String,
        eff_rpm_dist_amber_percentage: String,
        eff_rpm_dist_amber: String,
        eff_rpm_dist_green_percentage: String,
        eff_rpm_dist_green: String,
        eff_rpm_dist_red_percentage: String,
        eff_rpm_dist_red: String,
        total_time: String,
        total_dist: String
    },
    averageAccelerationPedalPositionAlgo: {
        avg_acc_pedal_pos: String,
        counter: Number
    },

    averageEngineRPMAlgo: {
        avg_eng_rpm: String,
        counter: Number
    },

    speedingsAlgo: {
        speedCount: Number,
        isExceed: Boolean
    },
    brakingInstaneousRatingAlgo: {
        brk_inst_rating: String,
        acceleration: String,
        no_of_brk_cycle: String,
        brk_cycle_start_spd: String,
        brk_cycle_end_spd: String,
        brk_cycle_time: String,
        flag_brk: String,
        brk_cycle_complete: String
    },
    accelerationPedalPositionAnalyticsAlgo: {
        acc_ped_normal_press_percentage: String,
        acc_ped_moderate_press_percentage: String,
        acc_ped_heavy_press_percentage: String,
        acc_ped_harsh_press_percentage: String,
        acc_ped_no_press_percentage: String,
        acc_ped_normal_press: String,
        acc_ped_moderate_press: String,
        acc_ped_heavy_press: String,
        acc_ped_harsh_press: String,
        acc_ped_no_press: String,
        total_acc_ped_press_time: String,
        total_travel_time: String,
        total_acc_ped_press: String

    },
    hardBrakingAlgo: {
        total_time: String,
        high_spd_brk_clt_time: String,
        high_spd_brk_clt_percentage: String,
        hardBrakingCount: String
    },
    driverBehaviour: {
        overSpeeding: Number,
        hardBraking: Number,
        aggressiveAccelerator: Number,
        vehicleStops: Number,
        driverScore: Number
    }
});


/**
 * Create the model for driver behaviour
*  and expose it to app
*  @type {object}
*  @property {object}  driverBehaviour.
*/
module.exports = {
    driverBehaviour: driverBehaviour
};
