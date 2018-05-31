'use strict';
/**
 *  This module is use to define response constants
 *  @module responseConstants
 *  @author shweta.ghenand
 *  @version 1.0.0
 */

/*
** Sequelize error code series 
** undefined error code series 
** Business logic error code series 
** Internal error code series 
*/

var constants = {};

constants.SUCCESS = 0;

constants.UNDEFINED_DATABASE_ERROR = 1006;
constants.GEOFENCE_NOT_SETUP = 1115;
constants.SOCKET_CONNECTION_FAILED = 1116;
constants.UNAUTHORIZE = 1122;
constants.INVALID_REQUEST_PARAMETERS = 1124;
constants.INVALID_TENANTID = 1129;
constants.DB_CONNECTION_FAILED = 1130;
constants.SPEED_RULE_NOT_SETUP = 1131;
constants.TRIP_NOT_FOUND = 1132;
constants.RULE_NOT_FOUND = 1133;
constants.DRIVER_NOT_FOUND = 1134;
constants.TRIPDETAILS_NOT_FOUND = 1135;


/**
 * export module
 */
module.exports = constants;