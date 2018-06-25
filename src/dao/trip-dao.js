
'use strict';
/**
 *  This module is use to define DAO for trip model
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
var moment = require('moment');
var empty = require('is-empty');
var driverBehaviourDao = require("../dao/driverBehaviour-dao");
var constants = require("../constant/constants");



/**
 * export module
 */
module.exports = {
    /**
    * DAO for get all trip  data
    */
    getAllTripData: function (reqObj, skip, limit, sort, order) {

        return new Promise(function (resolve, reject) {
            logger.debug("get all trips dao started");
            db.trips.find(reqObj).
                skip(skip).
                limit(limit).
                sort({ [sort]: order }).exec(function (err, result) {
                    if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    db.trips.count(reqObj).exec(function (err, count) {
                        if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        result.rows = result;
                        result.count = count;
                        return resolve(result);
                    });
                });
            logger.debug("get all trips dao finished");
        });
    },


    /**
    * DAO for get trip details by id
    */
    getTripDetails: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("get trip dao started");
            db.trips.findOne(reqObj).
                exec(function (err, result) {
                    if (err) {
                        logger.error(err);
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                    }
                    if (result) {
                        return resolve(result);
                    }
                    else
                        return reject(util.responseUtil(null, null, responseConstant.TRIP_NOT_FOUND));
                });

            logger.debug("get trip dao finished");
        });
    },

    /**
    * DAO for create trip 
    */
    insertData: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("create trip dao started");
            db.trips.find({ commonId: reqObj.commonId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        var updateObj = {};
                        if (!empty(reqObj.tripName)) {
                            updateObj.tripName = reqObj.tripName;
                        }
                        if (!empty(reqObj.description)) {
                            updateObj.description = reqObj.description;
                        }
                        if (!empty(reqObj.endTime)) {
                            updateObj.endTime = reqObj.endTime;
                        }
                        if (!empty(reqObj.startLocation)) {
                            updateObj.startLocation = reqObj.startLocation;
                        }
                        if (!empty(reqObj.endLocation)) {
                            updateObj.endLocation = reqObj.endLocation;
                        }
                        if (!empty(reqObj.status)) {
                            updateObj.status = reqObj.status;
                        }
                        if (!empty(reqObj.stops)) {
                            updateObj.stops = reqObj.stops;
                        }
                        if (updateObj.status === '2') {
                            updateObj.stops = result[0].stops + 1;
                        }
                        if (updateObj.status === '0') {
                            updateObj.tripCompletedAt = new Date();
                        }
                        if (!empty(reqObj.milesDriven)) {
                            updateObj.milesDriven = reqObj.milesDriven;
                        }
                        updateObj.updatedAt = Date.now();
                        module.exports.updateData(updateObj, { commonId: reqObj.commonId }).then(function (result) {
                            return resolve(result);
                        }, function (err) {
                            return reject(err);
                        })
                    } else {
                        var tripObj = new db.trips(reqObj);
                        tripObj.save(function (err, result) {
                            if (result) {
                                return resolve(result);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }

                        });
                    }
                }
            });
            logger.debug("create trip dao finished");
        });
    },

    /**
    * DAO for update trip data
    */
    updateData: function (reqObj, reqCondition) {
        return new Promise(function (resolve, reject) {
            logger.debug("update trip dao strated");

            db.trips.update(reqCondition, reqObj, function (err, result) {
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result.nModified) {//if nModified is 1 i.e. record is updated
                        module.exports.getTripDetails(reqCondition).then(function (result) {

                            //calculate and update trip information
                            module.exports.calculateTripdataToUpdate(result).then(function (updateTripObj) {

                                if (Object.keys(updateTripObj).length === 0) {
                                    return resolve(result);
                                }
                                db.trips.update(reqCondition, updateTripObj, function (err, result) {
                                    if (err) {
                                        logger.error(err);
                                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                                    } else {
                                        if (result.nModified) {
                                            module.exports.getTripDetails(reqCondition).then(function (result) {
                                                return resolve(result);
                                            }, function (err) {
                                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                                            });
                                        }
                                    }

                                });
                            }, function (err) {
                                return reject(err);
                            });

                        }, function (err) {
                            return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        });


                    } else {//not modified
                        return reject(util.responseUtil(null, null, responseConstant.TRIP_NOT_FOUND));
                    }
                }
            });
            logger.debug("update trip dao finished");
        });
    },

    /**
    * DAO for update data
    */
    deleteData: function (reqObj, reqCondition) {
        return new Promise(function (resolve, reject) {
            logger.debug("delete trip dao strated");

            db.trips.update(reqCondition, reqObj, function (err, result) {
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result.nModified) {
                        return resolve(reqObj);
                    } else {
                        return reject(util.responseUtil(null, null, responseConstant.TRIP_NOT_FOUND));
                    }
                }
            });
            logger.debug("delete trip dao finished");
        });
    },

    /**
      * DAO for insert trip insformation 
      */
    insertTripData: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("IoT Hub:insert trip details dao started");
            var fuelUsed;
            var time;
            var milesDriven;
            var avgSpeed;
            var mileage;
            if (reqObj.hasOwnProperty('FuelUsed')) {
                fuelUsed = reqObj.FuelUsed;
            } else {
                fuelUsed = "0";
            }
            if (reqObj.hasOwnProperty('ParameterDateTime')) {
                time = reqObj.ParameterDateTime;
            } else {
                time = "NA";
            }
            if (reqObj.hasOwnProperty('Distance')) {
                milesDriven = reqObj.Distance;
            } else {
                milesDriven = "0";
            }
            if (reqObj.hasOwnProperty('Speed')) {
                avgSpeed = reqObj.Speed;
            } else {
                avgSpeed = "0";
            }
            if (reqObj.hasOwnProperty('AvgFuelEcon')) {
                mileage = reqObj.AvgFuelEcon;
            } else {
                mileage = "0";
            }

            var tripInfo = new db.tripDetails({
                fuelUsed: fuelUsed,
                latitude: reqObj.Latitude,
                longitude: reqObj.Longitude,
                time: time,
                milesDriven: milesDriven,
                avgSpeed: avgSpeed,
                mileage: mileage,
                speedings: "0",
                hardBraking: "00",
                engineFaults: "NA",
                accelerator: "NA",
                phoneUsage: "NA",
                vehicleId: reqObj.VehicleId,
                tripId: reqObj.TripId
            });

            tripInfo.save(function (err, result) {
                if (result) {
                    return resolve(result);
                }
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                }

            });
            logger.debug("IoT Hub:insert trip details dao finished");
        });
    },


    getTripDataFromIOT: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("IoT Hub:get trip details dao started");
            db.tripDetails.find(reqObj).sort({ createdAt: 'asc' }).
                exec(function (err, result) {
                    if (err) {
                        logger.error(err);
                        return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    }
                    if (result) {
                        return resolve(result);
                    }
                    else
                        return reject(util.responseUtil(null, null, responseConstant.TRIPDETAILS_NOT_FOUND));
                });

            logger.debug("IoT Hub:get trip details dao finished");
        });
    },

    calculateTripdataToUpdate: function (result) {
        return new Promise(function (resolve, reject) {
            logger.debug(" calculate trip data dao started");
            var UpdateTripObj = {};
            var duration = '00:00:00';
            var endTime = Date.now();
            var currentTime = new Date();
            var locationDetails = [];
            if (result.endTime) {

                var ms = moment(result.endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(result.startTime, "DD/MM/YYYY HH:mm:ss"));
                var d = moment.duration(ms);
                duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                endTime = result.endTime;

            } else {

                var ms = moment(currentTime, "DD/MM/YYYY HH:mm:ss").diff(moment(result.createdAt, "DD/MM/YYYY HH:mm:ss"));
                var d = moment.duration(ms);
                duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
            }
            UpdateTripObj.tripDuration = duration;
            module.exports.getTripDataFromIOT({ tripId: result.commonId, isDeleted: 0 }).then(function (tripResult) {
                if (tripResult && tripResult.length === 0) {
                    return resolve(UpdateTripObj);
                }
                var size = tripResult.length;
                var totalSpeed = 0;
                var maxSpeed = 0;

                for (var i = 0; i < size; i++) {
                    locationDetails.push({ "latitude": tripResult[i].latitude, "longitude": tripResult[i].longitude, "time": tripResult[i].time });
                }
                for (var i = 0; i < size; i++) {
                    if (tripResult[i].avgSpeed === 'NA') {
                        maxSpeed = tripResult[i].avgSpeed;
                        totalSpeed = tripResult[i].avgSpeed;

                    } else {
                        if (+maxSpeed < +tripResult[i].avgSpeed) {
                            maxSpeed = tripResult[i].avgSpeed;
                        }
                        totalSpeed = +totalSpeed + +tripResult[i].avgSpeed;

                    }
                }
                if (totalSpeed === 'NA' || totalSpeed === '0') {
                    UpdateTripObj.avgSpeed = totalSpeed;
                } else {
                    UpdateTripObj.avgSpeed = (totalSpeed / size).toFixed(2);
                }

                UpdateTripObj.locationDetails = locationDetails;
                UpdateTripObj.fuelUsed = (tripResult[0].fuelUsed - tripResult[size - 1].fuelUsed).toFixed(2);
                UpdateTripObj.topSpeed = maxSpeed;
                UpdateTripObj.mileage = tripResult[size - 1].mileage;


                module.exports.calculateDriverBehaviour({ tripId: result.commonId }, UpdateTripObj.tripDuration, result.stops).then(function (driverResult) {
                    UpdateTripObj.speedings = driverResult.driverBehaviour.overSpeeding;
                    return resolve(UpdateTripObj);
                }, function (err) {
                    logger.error("Error in updating driver behaviour score:", err);
                    return resolve(UpdateTripObj);
                });

                logger.debug("calculate trip data dao finished");
            }, function (err) {
                logger.error("Error in updating trip details:", err);
                return resolve(UpdateTripObj);
            });
        });
    },


    calculateDriverBehaviour: function (reqObj, tripTime, stops) {
        return new Promise(function (resolve, reject) {
            logger.debug("calculate driver behaviour  dao started");

            driverBehaviourDao.getDriverBehaviourDetails(reqObj).then(function (result) {

                module.exports.getDriverBehaviourScore(result, tripTime, stops).then(function (driverBehaviourresult) {
                    var updateObj = {};
                    var Obj = {};
                    var overSpeeding = 0;
                    var hardBraking = 0;
                    var aggressiveAccelerator = 0;

                    if (result.speedingsAlgo.speedCount != undefined) {
                        overSpeeding = parseInt(result.speedingsAlgo.speedCount);
                    }
                    if (result.hardBrakingAlgo.hardBrakingCount != undefined) {
                        hardBraking = parseInt(result.hardBrakingAlgo.hardBrakingCount);
                    }

                    if (result.accelerationPedalPositionAnalyticsAlgo.acc_ped_harsh_press != undefined) {
                        aggressiveAccelerator = parseInt(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_harsh_press);
                    }

                    Obj.overSpeeding = overSpeeding;
                    Obj.hardBraking = hardBraking;
                    Obj.aggressiveAccelerator = aggressiveAccelerator;

                    Obj.vehicleStops = parseInt(driverBehaviourresult.vehicleStops);
                    Obj.driverScore = parseInt(driverBehaviourresult.driverScore);
                    updateObj.driverBehaviour = Obj;
                    driverBehaviourDao.updateDriverBehaviourDetails(reqObj, updateObj).then(function (updateResult) {
                        return resolve(updateResult);
                    }, function (err) {
                        return reject(err);
                    });
                }, function (err) {
                    return reject(err);
                });
            }, function (err) {
                return reject(err);
            })

            logger.debug("calculate driver behaviour dao finished");
        });
    },

    getDriverBehaviourScore: function (result, tripTime, stops) {
        var resp = {};
        var driverScore = 0;

        return new Promise(function (resolve, reject) {

            //Braking Algorithm :
            // Braking Instantaneous Rating Algorithm
            if (result.brakingInstaneousRatingAlgo.brk_inst_rating !== undefined) {

                var brakeRating = parseFloat(result.brakingInstaneousRatingAlgo.brk_inst_rating);
                if (brakeRating === constants.brakingInstantaneouRating_normal_threshold) {
                    driverScore = driverScore + constants.braking_rating;
                }
                else if (brakeRating < constants.brakingInstantaneouRating_normal_threshold && brakeRating >= constants.brakingInstantaneouRating_moderate_threshold) {
                    driverScore = driverScore + constants.braking_normal_rating;
                }
                else if (brakeRating < constants.brakingInstantaneouRating_moderate_threshold && brakeRating >= constants.brakingInstantaneouRating_heavy_threshold) {
                    driverScore = driverScore + constants.braking_moderate_rating;
                }
                else if (brakeRating < constants.brakingInstantaneouRating_heavy_threshold) {
                    driverScore = driverScore + constants.braking_heavy_rating;
                }
            } else {
                driverScore = driverScore + constants.braking_rating;
            }
            ;

            //Fuel Eco Rating algorithm 
            //Average Engine RPM Algorithm 
            if (result.averageEngineRPMAlgo.avg_eng_rpm !== undefined) {
                var avg_eng_rpm = parseFloat(result.averageEngineRPMAlgo.avg_eng_rpm);

                if (avg_eng_rpm <= constants.avg_eng_rpm_normal_threshold) {
                    driverScore = driverScore + constants.RPM_rating;
                }
                else if (avg_eng_rpm > constants.avg_eng_rpm_normal_threshold && avg_eng_rpm <= constants.avg_eng_rpm_moderate_threshold) {
                    driverScore = driverScore + constants.RPM_normal_rating;
                }
                else if (avg_eng_rpm > constants.avg_eng_rpm_moderate_threshold && avg_eng_rpm <= constants.avg_eng_rpm_heavy_threshold) {
                    driverScore = driverScore + constants.RPM_moderate_rating;
                }
                else if (avg_eng_rpm > constants.avg_eng_rpm_heavy_threshold) {
                    driverScore = driverScore + constants.RPM_heavy_rating;
                }
            } else {
                driverScore = driverScore + constants.RPM_rating;
            }

            //3.2 Percentage of Time and Distance driven in efficeint RPM Band Algorithm :: credit 12.5
            if (result.percentageofTimeAndDistanceAlgo.total_dist !== undefined) {
                //Red signal
                var redEfficiencyofTime = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_time_red_percentage);
                var redEfficiencyofDistance = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_dist_red_percentage);

                //Green signal
                var greenEfficiencyofTime = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_time_green_percentage);
                var greenEfficiencyofDistance = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_dist_green_percentage);

                //Amber  signal
                var amberEfficiencyofTime = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_time_amber_percentage);
                var amberEfficiencyofDistance = parseFloat(result.percentageofTimeAndDistanceAlgo.eff_rpm_dist_amber_percentage);

                if ((redEfficiencyofTime > greenEfficiencyofTime) && (redEfficiencyofTime > amberEfficiencyofTime) && (redEfficiencyofDistance > greenEfficiencyofDistance) && (redEfficiencyofDistance > amberEfficiencyofDistance)) {
                    driverScore = driverScore + constants.TimeandDistance_heavy_rating;
                }
                else if ((greenEfficiencyofTime > redEfficiencyofTime) && (greenEfficiencyofTime > amberEfficiencyofTime) && (greenEfficiencyofDistance > redEfficiencyofDistance) && (greenEfficiencyofDistance > amberEfficiencyofDistance)) {

                    driverScore = driverScore + constants.TimeandDistance_rating;
                }
                else if ((amberEfficiencyofTime > redEfficiencyofTime) && (amberEfficiencyofTime > greenEfficiencyofTime) && (amberEfficiencyofDistance > greenEfficiencyofDistance) && (amberEfficiencyofDistance > redEfficiencyofDistance)) {
                    driverScore = driverScore + constants.TimeandDistance_normal_rating;
                } else {
                    driverScore = driverScore + constants.TimeandDistance_moderate_rating;
                }
            } else {
                driverScore = driverScore + constants.TimeandDistance_rating;
            }


            //Accleration Rating algorithm :: credit-25-
            //3.1 Accleration Pedal Position Analytics Algorithm :: credit 12.5
            if (result.accelerationPedalPositionAnalyticsAlgo.total_acc_ped_press !== undefined) {
                var accNormalPer = parseFloat(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_normal_press);
                var accModeratePer = parseFloat(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_moderate_press);
                var accHeavyPer = parseFloat(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_heavy_press);
                var accHarshPer = parseFloat(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_harsh_press);
                var accNoPer = parseFloat(result.accelerationPedalPositionAnalyticsAlgo.acc_ped_no_press);


                if ((accNormalPer > accModeratePer) && (accNormalPer > accHeavyPer) && (accNormalPer > accHarshPer) && (accNormalPer > accNoPer)) {
                    driverScore = driverScore + constants.acceleration_normal_rating;
                }
                else if ((accModeratePer > accNormalPer) && (accModeratePer > accHeavyPer) && (accModeratePer > accHarshPer) && (accModeratePer > accNoPer)) {
                    driverScore = driverScore + constants.acceleration_moderate_rating;
                }
                else if ((accHeavyPer > accNormalPer) && (accHeavyPer > accModeratePer) && (accHeavyPer > accHarshPer) && (accHeavyPer > accNoPer)) {
                    driverScore = driverScore + constants.acceleration_heavy_rating;
                }
                else if ((accHarshPer > accNormalPer) && (accHarshPer > accModeratePer) && (accHarshPer > accHeavyPer) && (accHarshPer > accNoPer)) {
                    driverScore = driverScore + constants.acceleration_harsh_rating;
                }
                else if ((accNoPer > accNormalPer) && (accNoPer > accModeratePer) && (accNoPer > accHeavyPer) && (accNoPer > accHarshPer)) {
                    driverScore = driverScore + constants.acceleration_no_rating;
                }
            } else {
                driverScore = driverScore + constants.acceleration_normal_rating;
            }

            var tripDuration = 0;
            var speedCount = 0;

            tripDuration = tripTime.split(':');

            //  Hours are worth 60 minutes.
            var minutes = (+tripDuration[0]) * 60 + (+tripDuration[1]);
            if (minutes > 0) {
                if (result.speedingsAlgo.speedCount !== undefined) {
                    speedCount = (constants.minutes * result.speedingsAlgo.speedCount) / minutes;

                    if (speedCount === constants.speedcount_normal_threshold) {
                        driverScore = driverScore + constants.speed_rating;
                    }
                    else if (speedCount > constants.speedcount_normal_threshold && speedCount <= constants.speedcount_moderate_threshold) {
                        driverScore = driverScore + constants.speed_normal_rating;
                    }
                    else if (speedCount > constants.speedcount_moderate_threshold && speedCount <= constants.speedcount_heavy_threshold) {
                        driverScore = driverScore + constants.speed_moderate_rating;
                    }
                    else if (speedCount > constants.speedcount_heavy_threshold) {
                        driverScore = driverScore + constants.speed_heavy_rating;
                    }

                } else {
                    driverScore = driverScore + constants.speed_rating;
                }

                if (result.hardBrakingAlgo.hardBrakingCount !== undefined) {
                    var hBCount = parseFloat(result.hardBrakingAlgo.hardBrakingCount);

                    var hardBrakeCount = (constants.minutes * result.hardBrakingAlgo.hardBrakingCount) / minutes;

                    if (hardBrakeCount === constants.hardBrakingcount_normal_threshold) {
                        driverScore = driverScore + constants.braking_rating;
                    }
                    else if (hardBrakeCount > constants.hardBrakingcount_normal_threshold && hardBrakeCount <= constants.hardBrakingcount_moderate_threshold) {
                        driverScore = driverScore + constants.braking_normal_rating;
                    }
                    else if (hardBrakeCount > constants.hardBrakingcount_moderate_threshold && hardBrakeCount <= constants.hardBrakingcount_heavy_threshold) {
                        driverScore = driverScore + constants.braking_moderate_rating;
                    }
                    else if (hardBrakeCount > constants.hardBrakingcount_heavy_threshold) {
                        driverScore = driverScore + constants.braking_heavy_rating;
                    }
                } else {
                    driverScore = driverScore + constants.braking_rating;
                }
            } else {
                driverScore = driverScore + constants.braking_rating + constants.speed_rating;
            }

            resp.driverScore = driverScore;
            resp.vehicleStops = stops;
            return resolve(resp);

        });
    },
}