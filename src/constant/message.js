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


err_obj[constants.VALID_CREDENTIALS] = "Valid credentials";
err_obj[constants.EMAIL_ALREADY_EXIST] = "Oops! Given email is already in use";
err_obj[constants.ERROR_OCCURED_IN_GETTING_USER_LIST] = "Error occured when getting list of users";
err_obj[constants.UPDATE_DATA_ERROR] = "Could not update data";
err_obj[constants.DELETE_DATA_ERROR] = "Could not delete data";
err_obj[constants.UNPROCESSABLE_ENTITY] = "unprocessable entity.";
err_obj[constants.INVALID_JSON_OBJECT] = "Invalid Json object";
err_obj[constants.UNABLE_TO_SEND_EMAIL] = "Unable to send email";
err_obj[constants.RUN_TIME_ERROR] = "Runtime error";
err_obj[constants.NO_RECORD_DELETED] = "No record deleted";
err_obj[constants.WRONG_PASSWORD] = "Password is wrong";
err_obj[constants.ACCESS_DENIED] = "Access Denied";
err_obj[constants.DUPLICATION_ERROR] = "Record already exist.";
err_obj[constants.RECORD_NOT_FOUND] = "Record not found";
err_obj[constants.REQUEST_SENT_ALREADY] = "You already sent the request.";
err_obj[constants.DEVELOPER_COUNT_EXCEEDS] = "Developer count exceeded.";
err_obj[constants.VERSION_DOES_NOT_CHANGED] = "Version does not changed.";
err_obj[constants.SYSTEM_ERROR] = "System Error";
err_obj[constants.PACKAGENAME_DUPLICATION_ERROR] = "Package name should be unique.";
err_obj[constants.LOGGED_OUT_ERROR] = "You already logged out.";
err_obj[constants.INVALIDE_REQUEST_URL] = "Invalid request.";
err_obj[constants.UNAUTHORIZE] = "Unauthorized.";
err_obj[constants.INVALIDE_CREDENTIAL] = "Invalid credential.";
err_obj[constants.INVALIDE_REQUEST_PARAMETERS] = "Invalid request parameters.";
err_obj[constants.PASSWORD_CHANGE_ERROR] = "Unable to change the password";
err_obj[constants.ROLE_ALREADY_ASSIGN] = "Role already assigned.";
err_obj[constants.INVALIDE_ROLE] = "Invalid role.";
err_obj[constants.INVALIDE_COMPANY] = "Invalid company infomation.";
err_obj[constants.INVALID_TENANTID] = "Invalid tenantId";
err_obj[constants.DB_CONNECTION_FAILED] = "DB connection failed.";
err_obj[constants.GEOFENCE_NOT_SETUP] = "Geofence is not set up for vehicle."
err_obj[constants.SOCKET_CONNECTION_FAILED] = "Push Notification not sent."
err_obj[constants.SPEED_RULE_NOT_SETUP]="Speed Rule not set up"


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
