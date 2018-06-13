'use strict';
/**
 *  This module is use to define error messages
 *  @module message
 *  @author shweta.ghenand
 *  @version 1.0.0
 */

/**
 * import project modules
 */
var constants = require('./responseConstant');
var err_obj = [];
var store = {};

err_obj[constants.SUCCESS] = "Success";
err_obj[constants.TRIP_NOT_FOUND] = "Trip not found";
err_obj[constants.RULE_NOT_FOUND] = "Rule not found";
err_obj[constants.TRIPDETAILS_NOT_FOUND] = "Trip details not found";
err_obj[constants.UNAUTHORIZE] = "We are sorry but we are not able to authenticate you. Login again"; 1
err_obj[constants.INVALID_REQUEST_PARAMETERS] = "Invalid request ";
err_obj[constants.INVALID_TENANTID] = "Invalid tenantId";
err_obj[constants.DB_CONNECTION_FAILED] = "DB connection failed";
err_obj[constants.GEOFENCE_NOT_SETUP] = "Geofence is not set up for vehicle"
err_obj[constants.SOCKET_CONNECTION_FAILED] = "Push Notification not sent"
err_obj[constants.SPEED_RULE_NOT_SETUP] = "Speed Rule not set up"
err_obj[constants.TRIP_EXIST] = "Trip exist already"

/**
 * function for get message from error code
 */
store.getMessage = function (code) {
    return err_obj[code];
};
/**
 * export module
 */
module.exports = store;
