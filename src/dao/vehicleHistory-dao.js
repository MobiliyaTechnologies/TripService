
'use strict';
/**
 *  This module is use to define DAO for vehicle history model
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
var mongoose = require('mongoose');
var moment = require('moment');
var empty = require('is-empty');
var ruleDao = require('../dao/rule-dao');
var geodist = require('geodist');
var socketServer = require('../../server');
var async = require('async');
var config = require('../config/config.json');
config = config[config.activeEnv];
/**
 * export module
 */
module.exports = {
    /**
     * DAO for insert vehicle data
     */
    insertData: function (reqObj) {
        return new Promise(function (resolve, reject) {

            logger.debug("insert vehicle data dao started");
            var vehicle_id = reqObj.VehicleId;
            var vehicleObj = new db.vehicleHistory({
                data: reqObj,
                vehicleId: vehicle_id
            });
            vehicleObj.save(function (err, result) {
                if (result) {
                    var isInside = false;
                    var testLoc = { lat: result.data.Latitude, lon: result.data.Longitude };

                    //Geofencing push notification
                    ruleDao.getRuleDetails({ vehicleId: result.vehicleId, latitude: { $ne: null }, longitude: { $ne: null }, radius: { $ne: null }, isDeleted: 0 }).then(function (geofenceResult) {

                        if (geofenceResult.length === 0) {
                            return resolve(util.responseUtil(null, result, responseConstant.GEOFENCE_NOT_SETUP));
                        }
                        for (var i = 0; i < geofenceResult.length; i++) {
                            var centerLoc = { lat: geofenceResult[i].latitude.value, lon: geofenceResult[i].longitude.value }
                            var distanceInMeters = geodist(centerLoc, testLoc, { exact: true, unit: 'meters' });
                            isInside = distanceInMeters < geofenceResult[i].radius.value;


                            //write  result on socket
                            var userId = geofenceResult[i].userId;

                            var message = { "Type": "Geofence", "isInside": isInside, "vehicleId": geofenceResult[i].vehicleId, "VehicleRegNumber": result.data.VehicleRegNumber, "Time": Date.now() };

                            if (isInside) {
                                socketServer.io.sockets.emit(userId, message);

                            }
                        }

                    }, function (err) {
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    });

                    ////Speeding push notification
                    var isSpeedExceeded = false;
                    var testSpeed = result.data.Speed;
                    ruleDao.getRuleDetails({ vehicleId: result.vehicleId, speedLimit: { $ne: null }, isDeleted: 0 }).then(function (speedResult) {
                        if (speedResult.length === 0) {
                            return resolve(util.responseUtil(null, result, responseConstant.SPEED_RULE_NOT_SETUP));
                        }

                        for (var i = 0; i < speedResult.length; i++) {

                            isSpeedExceeded = testSpeed > speedResult[i].speedLimit.value;

                            //write  result on socket
                            var userId = speedResult[i].userId;

                            var message = { "Type": "Speed", "isSpeedExceeded": isSpeedExceeded, "vehicleId": speedResult[i].vehicleId, "VehicleRegNumber": result.data.VehicleRegNumber, "Time": Date.now() };
                            if (isSpeedExceeded) {
                                socketServer.io.sockets.emit(userId, message);

                            }
                        }

                    }, function (err) {
                        logger.error(err);
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    });
                    return resolve(result);
                }
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                }

            });
            logger.debug("insert vehicle data dao finished");
        });
    },



    /**
  * DAO for get vehicle history  data
  */
    getAllVehicleHistory: function (reqObj, skip, limit, sort, order) {
        return new Promise(function (resolve, reject) {
            logger.debug("get all vehicle history  dao started");
            db.vehicleHistory.find(reqObj).
                skip(skip).
                limit(limit).
                sort({ [sort]: order }).exec(function (err, result) {
                    if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    db.vehicleHistory.count(reqObj).exec(function (err, count) {
                        if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        result.rows = result;
                        result.count = count;
                        return resolve(result);
                    });
                });
            logger.debug("get all vehicle history dao finished");
        });
    },


    /**
   * DAO for store fault data
   */
    insertFaultData: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("insert fault data dao started");
            var faultDataObj = new db.faultData({
                faultSPN: reqObj.FaultSPN,
                faultDescription: reqObj.FaultDescription,
                parameterDateTime: reqObj.ParameterDateTime,
                tripId: reqObj.TripId,
                vehicleId: reqObj.VehicleId
            });
            faultDataObj.save(function (err, result) {
                if (result) {
                    return resolve(result);
                }
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                }
            });

            logger.debug("insert fault data dao finished");
        });
    },


    /**
  * DAO for get report data
  */
    getReportData: function (reqObj, startTime, no_of_days) {

        var resp = [];
        var asyncObject = [];
        var i = 0;
        return new Promise(function (resolve, reject) {
            logger.debug("get report  dao started");
            function recurse(i, startTime, no_of_days, callback) {
                var obj = {};
                var totalAirTemp = 0;
                var tempCount = 0;
                var totalAirPressure = 0;
                var pressureCount = 0;
                var totalRPM = 0;
                var rpmCount = 0;
                var totalSpeed = 0;
                var speedCount = 0;
                var size = 0;
                var maxDistance = 0;
                var totalValue = 0;

                var today = moment(startTime);
                var tomorrow = moment(startTime).add(1, 'days');

                reqObj.createdAt = {
                    $gte: today.toDate(),
                    $lt: tomorrow.toDate()
                }
                var speedCriteria = {
                    vehicleId: reqObj.vehicleId,
                    "data.TripId": { $ne: "NA" },
                    "data.Speed": { $gt: 0 },
                    createdAt: reqObj.createdAt
                }

                var rpmCriteria = {
                    vehicleId: reqObj.vehicleId,
                    "data.TripId": { $ne: "NA" },
                    isDeleted: 0,
                    "data.RPM": { $gt: 0 },
                    createdAt: reqObj.createdAt
                }
                var distanceCriteria = {
                    vehicleId: reqObj.vehicleId,
                    "data.TripId": { $ne: "NA" },
                    "data.Distance": { $gt: 0 },
                    createdAt: reqObj.createdAt
                }

                var intakePressureCriteria = {
                    vehicleId: reqObj.vehicleId,
                    "data.TripId": { $ne: "NA" },
                    isDeleted: 0,
                    "data.IntakePressure": { $gt: 0 },
                    createdAt: reqObj.createdAt
                }

                var intakeTempCriteria = {
                    vehicleId: reqObj.vehicleId,
                    "data.TripId": { $ne: "NA" },
                    isDeleted: 0,
                    "data.AirIntakeTemperature": { $ne: "NA" },
                    createdAt: reqObj.createdAt
                }


                db.vehicleHistory.find(speedCriteria).exec(function (err, speedResult) {
                    if (speedResult) {

                        if (speedResult.length > 0) {
                            speedCount = speedResult.length;

                            for (var k = 0; k < speedResult.length; k++) {
                                totalSpeed = +totalSpeed + +speedResult[k].data.Speed;
                            }

                            obj.speedAvg = (totalSpeed / speedCount).toFixed(2);;
                        } else {
                            obj.speedAvg = 0;
                        }

                        db.vehicleHistory.find(rpmCriteria).exec(function (err, rpmResult) {
                            if (rpmResult) {
                                if (rpmResult.length > 0) {
                                    rpmCount = rpmResult.length;
                                    for (var m = 0; m < rpmResult.length; m++) {
                                        totalRPM = +totalRPM + +rpmResult[m].data.RPM;
                                    }
                                    obj.rpmAvg = (totalRPM / rpmCount).toFixed(2);
                                } else

                                    obj.rpmAvg = 0;

                                db.vehicleHistory.find(distanceCriteria).exec(function (err, distanceResult) {
                                    if (distanceResult) {

                                        if (distanceResult.length > 0) {

                                            for (var l = 0; l < distanceResult.length; l++) {
                                                if (+maxDistance < +distanceResult[l].data.Distance) {
                                                    maxDistance = distanceResult[l].data.Distance;
                                                }
                                            }
                                            obj.maxDistance = maxDistance;
                                        } else {
                                            obj.maxDistance = 0;
                                        }

                                        db.vehicleHistory.find(intakePressureCriteria).exec(function (err, intakePressureResult) {
                                            if (intakePressureResult) {
                                                if (intakePressureResult.length > 0) {
                                                    pressureCount = intakePressureResult.length;
                                                    for (var n = 0; n < intakePressureResult.length; n++) {
                                                        totalAirPressure = +totalAirPressure + +intakePressureResult[n].data.IntakePressure;
                                                    }
                                                    obj.airIntakePressureAvg = (totalAirPressure / pressureCount).toFixed(2);
                                                } else
                                                    obj.airIntakePressureAvg = 0;


                                                db.vehicleHistory.find(intakeTempCriteria).exec(function (err, intakeTempResult) {
                                                    if (intakeTempResult) {
                                                        if (intakeTempResult.length > 0) {
                                                            tempCount = intakeTempResult.length;
                                                            for (var p = 0; p < intakeTempResult.length; p++) {
                                                                totalAirTemp = +totalAirTemp + +intakeTempResult[p].data.AirIntakeTemperature;
                                                            }
                                                            obj.airIntakeTempratureAvg = (totalAirTemp / tempCount).toFixed(2);
                                                        } else
                                                            obj.airIntakeTempratureAvg = 0;

                                                        obj.vehicleId = reqObj.vehicleId;
                                                        obj.createdAt = today.toDate();
                                                        resp.push(obj);
                                                        if (resp.length == no_of_days) {

                                                            return callback(resp);
                                                        }
                                                    } else {
                                                        callback(err);
                                                    }
                                                });
                                            } else {
                                                callback(err);
                                            }
                                        });
                                    } else {
                                        callback(err);
                                    }
                                });
                            } else {
                                callback(err);
                            }
                        });
                    } else {
                        callback(err);
                    }
                });
                startTime = tomorrow;
                i++;
                if (i < no_of_days) {
                    return recurse(i, startTime, no_of_days, callback);
                } else {
                    return;
                }
            }

            asyncObject.push(function (callback) {
                recurse(i, startTime, no_of_days, callback);
            });

            async.parallel(asyncObject, function (result, err) {
                if (result) {
                    return resolve(result);
                } else {
                    return reject(err);
                }
            });

            logger.debug("get report dao finished");
        });
    },






}