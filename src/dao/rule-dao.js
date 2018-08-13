'use strict';
/**
 *  This module is use to define DAO for rule model
 *  @module trip-dao
 *  @author shweta.ghenand
 *  @version 1.0.0
 */


/**
 * import project modules
 */

var db = require('../config/databaseConnection').dbModel;
var util = require("../util/commonUtil");
var responseConstant = require("../constant/responseConstant");
var logger = require("../util/logger");
var geodist = require('geodist');

/**
 * export module
 */
module.exports = {
    /**
    * DAO for get data
    */
    getAllRuleData: function (reqObj, skip, limit, sort, order) {
        return new Promise(function (resolve, reject) {
            logger.debug("get all rules dao started");
            db.rule.find(reqObj).
                skip(skip).
                limit(limit).
                sort({ [sort]: order }).exec(function (err, result) {
                    if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    db.rule.count(reqObj).exec(function (err, count) {
                        if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        result.rows = result;
                        result.count = count;
                        return resolve(result);
                    });
                });
            logger.debug("get all rules dao finished");
        });
    },
    /**
 
    /**
    * DAO for set region
    */
    insertGeofenceData: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("set geofence dao started");
            var insertObj = [];
            for (var i = 0; i < reqObj.geofenceList.length; i++) {
                insertObj.push({ "ruleName": reqObj.ruleName, "ruleType": reqObj.ruleType, "latitude": reqObj.geofenceList[i].latitude, "longitude": reqObj.geofenceList[i].longitude, "radius": reqObj.geofenceList[i].radius, "vehicleId": reqObj.geofenceList[i].vehicleId, "userId": reqObj.userId });
            }
            db.rule.insertMany(insertObj)
                .then(function (mongooseDocuments) {
                    return resolve(mongooseDocuments);
                })
                .catch(function (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                });
            logger.debug("set geofence dao finished");
        });
    },


    /**
    * DAO for test location
    */
    testLocation: function (req) {
        return new Promise(function (resolve, reject) {
            logger.debug("test location dao started");
            var testLoc = { lat: req.query.latitude, lon: req.query.longitude }
            var isInside = false;
            module.exports.getRuleDetails({ vehicleId: req.query.vehicleId, latitude: { $ne: null }, longitude: { $ne: null }, radius: { $ne: null }, isDeleted: 0 }).then(function (geofenceResult) {
                if (geofenceResult.length === 0) {
                    return reject(util.responseUtil(null, null, responseConstant.GEOFENCE_NOT_SETUP));
                }
                for (var i = 0; i < geofenceResult.length; i++) {
                    var centerLoc = { lat: geofenceResult[i].latitude.value, lon: geofenceResult[i].longitude.value }
                    var distanceInYards = geodist(centerLoc, testLoc, { exact: true, unit: 'yards' });
                    var userId = geofenceResult[i].userId;
                    isInside = distanceInYards < geofenceResult[i].radius.value;
                    if (isInside) {
                        return resolve({ "isInside": isInside });
                    }
                }
                return resolve({ "isInside": isInside });
            }, function (err) {
                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
            });
            logger.debug("test location dao finished");
        });
    },

    /**
   * DAO for get region details
   */
    getRuleDetails: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("get region details dao started");
            db.rule.find(reqObj).
                exec(function (err, result) {
                    if (err) {
                        logger.error(err);
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    }
                    if (result) {
                        return resolve(result);
                    }
                    else
                        return reject(util.responseUtil(null, null, responseConstant.RULE_NOT_FOUND));
                });

            logger.debug("get region details dao finished");
        });
    },


    /**
  * DAO for set region
  */
    insertSpeedingsData: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("set speedings dao started");
            var insertObj = [];
            for (var i = 0; i < reqObj.speedingList.length; i++) {
                insertObj.push({ "ruleName": reqObj.ruleName, "ruleType": reqObj.ruleType, "speedLimit": reqObj.speedingList[i].speedLimit, "vehicleId": reqObj.speedingList[i].vehicleId, "userId": reqObj.userId });
            }
            db.rule.insertMany(insertObj)
                .then(function (mongooseDocuments) {
                    return resolve(mongooseDocuments);
                })
                .catch(function (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                });
            logger.debug("set speedings dao finished");
        });
    },

    /**
 * DAO for get data
 */
    getRuleDetailsById: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("get rule dao started");
            db.rule.findOne(reqObj).
                exec(function (err, result) {
                    if (err) {
                        logger.error(err);
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                    }
                    if (result) {
                        return resolve(result);
                    }
                    else {
                        return reject(util.responseUtil(null, null, responseConstant.RULE_NOT_FOUND));
                    }
                });

            logger.debug("get rule dao finished");
        });
    }
}