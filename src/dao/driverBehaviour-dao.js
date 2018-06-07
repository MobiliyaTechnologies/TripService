
'use strict';
/**
 *  This module is use to define DAO for driver behaviour model
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
var constants = require("../constant/constants");


/**
 * export module
 */
module.exports = {
    /**
     * DAO for calculate Driver Behaviour Rating Algorithm :Percentage of Time and Distance driven in efficient RPM band algorithm
     */

    calculateFuleEcoRating_TimeandDistance: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("time and distance calculation dao started");
            var veh_speed = reqObj.VehicleSpeed;
            var eng_speed = reqObj.RPM;

            var total_time = 0;
            var total_dist = 0;
            var eff_rpm_time_amber = 0;
            var eff_rpm_dist_amber = 0;
            var eff_rpm_time_green = 0;
            var eff_rpm_dist_green = 0;
            var eff_rpm_time_red = 0;
            var eff_rpm_dist_red = 0;


            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].percentageofTimeAndDistanceAlgo.total_time !== undefined) {
                            eff_rpm_time_amber = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_time_amber);
                            eff_rpm_dist_amber = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_dist_amber);

                            eff_rpm_time_green = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_time_green);
                            eff_rpm_dist_green = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_dist_green);

                            eff_rpm_time_red = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_time_red);
                            eff_rpm_dist_red = parseFloat(result[0].percentageofTimeAndDistanceAlgo.eff_rpm_dist_red);

                            total_time = parseFloat(result[0].percentageofTimeAndDistanceAlgo.total_time);
                            total_dist = parseFloat(result[0].percentageofTimeAndDistanceAlgo.total_dist);

                            var updateObj = {};
                            var Obj = module.exports.calculateTimeandDistance(veh_speed, eng_speed, eff_rpm_time_amber, eff_rpm_dist_amber, eff_rpm_time_green, eff_rpm_dist_green, eff_rpm_time_red, eff_rpm_dist_red, total_time, total_dist)
                            updateObj.percentageofTimeAndDistanceAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.calculateTimeandDistance(veh_speed, eng_speed, eff_rpm_time_amber, eff_rpm_dist_amber, eff_rpm_time_green, eff_rpm_dist_green, eff_rpm_time_red, eff_rpm_dist_red, total_time, total_dist)
                            updateObj.percentageofTimeAndDistanceAlgo = Obj;
                        }
                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });
                    }
                    else {
                        var insertObj = module.exports.calculateTimeandDistance(veh_speed, eng_speed, eff_rpm_time_amber, eff_rpm_dist_amber, eff_rpm_time_green, eff_rpm_dist_green, eff_rpm_time_red, eff_rpm_dist_red, total_time, total_dist)
                        var TimeandDistanceInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            percentageofTimeAndDistanceAlgo: insertObj
                        });
                        TimeandDistanceInfo.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }

                        });
                    }
                }

            });
            logger.debug("time and distance calculation dao dao finished");
        });
    },

    calculateTimeandDistance: function (veh_speed, eng_speed, eff_rpm_time_amber, eff_rpm_dist_amber, eff_rpm_time_green, eff_rpm_dist_green, eff_rpm_time_red, eff_rpm_dist_red, total_time, total_dist) {

        if (veh_speed > 0 && ((eng_speed >= constants.eff_rpm_1 && eng_speed <= constants.eff_rpm_2) || (eng_speed >= constants.eff_rpm_3 && eng_speed <= constants.eff_rpm_4))) {
            eff_rpm_time_amber = eff_rpm_time_amber + (constants.algo_periodicity / 1000);
            eff_rpm_dist_amber = eff_rpm_dist_amber + ((veh_speed * constants.algo_periodicity) / (1000 * 1000));

        }
        if (veh_speed > 0 && eng_speed >= constants.eff_rpm_2 && eng_speed <= constants.eff_rpm_3) {
            eff_rpm_time_green = eff_rpm_time_green + (constants.algo_periodicity / 1000);
            eff_rpm_dist_green = eff_rpm_dist_green + ((veh_speed * constants.algo_periodicity) / (1000 * 1000));
        }

        if (veh_speed > 0 && eng_speed >= constants.eff_rpm_4) {
            eff_rpm_time_red = eff_rpm_time_red + (constants.algo_periodicity / 1000);
            eff_rpm_dist_red = eff_rpm_dist_red + ((veh_speed * constants.algo_periodicity) / (1000 * 1000));
        }

        total_time = total_time + (constants.algo_periodicity / 1000);
        total_dist = total_dist + ((veh_speed * (constants.algo_periodicity) / (1000 * 1000)));


        var eff_rpm_time_amber_percentage = (eff_rpm_time_amber / total_time) * 100;
        var eff_rpm_dist_amber_percentage = (eff_rpm_dist_amber / total_dist) * 100;

        var eff_rpm_time_green_percentage = (eff_rpm_time_green / total_time) * 100;
        var eff_rpm_dist_green_percentage = (eff_rpm_dist_green / total_dist) * 100;


        var eff_rpm_time_red_percentage = (eff_rpm_time_red / total_time) * 100;
        var eff_rpm_dist_red_percentage = (eff_rpm_dist_red / total_dist) * 100;


        var insertObj = {};

        //amber time and distance
        insertObj.eff_rpm_time_amber = eff_rpm_time_amber;
        insertObj.eff_rpm_dist_amber = eff_rpm_dist_amber;
        insertObj.eff_rpm_time_amber_percentage = eff_rpm_time_amber_percentage;
        insertObj.eff_rpm_dist_amber_percentage = eff_rpm_dist_amber_percentage;

        //green time and distance
        insertObj.eff_rpm_time_green = eff_rpm_time_green;
        insertObj.eff_rpm_dist_green = eff_rpm_dist_green;
        insertObj.eff_rpm_time_green_percentage = eff_rpm_time_green_percentage;
        insertObj.eff_rpm_dist_green_percentage = eff_rpm_dist_green_percentage;

        //red time and distance
        insertObj.eff_rpm_time_red = eff_rpm_time_red;
        insertObj.eff_rpm_dist_red = eff_rpm_dist_red;
        insertObj.eff_rpm_time_red_percentage = eff_rpm_time_red_percentage;
        insertObj.eff_rpm_dist_red_percentage = eff_rpm_dist_red_percentage;

        //total time and total distance

        insertObj.total_time = total_time;
        insertObj.total_dist = total_dist;

        return insertObj;
    },

    //caluculate Avergae Engine RPM Algorithm
    calculateFuelEcoRating_AverageEngineRPM: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("average engine RPM calculation dao started");

            var counter = 0;
            var avg_eng_rpm = 0;
            var eng_speed = reqObj.RPM;
            var veh_speed = reqObj.VehicleSpeed;

            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].averageEngineRPMAlgo.counter !== undefined) {
                            avg_eng_rpm = parseFloat(result[0].averageEngineRPMAlgo.avg_eng_rpm);
                            counter = parseFloat(result[0].averageEngineRPMAlgo.counter);

                            var updateObj = {};
                            var Obj = module.exports.calculateEngineRPM(veh_speed, eng_speed, avg_eng_rpm, counter)
                            updateObj.averageEngineRPMAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.calculateEngineRPM(veh_speed, eng_speed, avg_eng_rpm, counter)
                            updateObj.averageEngineRPMAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });
                    } else {

                        var insertObj = module.exports.calculateEngineRPM(veh_speed, eng_speed, avg_eng_rpm, counter)
                        var engineRPMInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            averageEngineRPMAlgo: insertObj
                        });
                        engineRPMInfo.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }

                        });
                    }
                }

            });


            logger.debug("average engine RPM calculation dao dao finished");
        });
    },

    calculateEngineRPM: function (veh_speed, eng_speed, avg_eng_rpm, counter) {
        if (veh_speed > 0) {
            avg_eng_rpm = ((counter * avg_eng_rpm) + eng_speed) / (counter + 1);
            counter = counter + 1;
        }
        var insertObj = {};
        insertObj.avg_eng_rpm = avg_eng_rpm;
        insertObj.counter = counter;
        return insertObj;
    },



    //calculate Acceleration: Average Acceleration Pedal Position Algorithm
    calculateAccelerationRating_PedalPosition: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("acceleration calculation dao started");

            var counter = 0;
            var avg_acc_pedal_pos = 0;
            var acc_ped_pos = reqObj.AccelPedal;
            var veh_speed = reqObj.VehicleSpeed;


            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].averageAccelerationPedalPositionAlgo.counter !== undefined) {
                            avg_acc_pedal_pos = parseFloat(result[0].averageAccelerationPedalPositionAlgo.avg_acc_pedal_pos);
                            counter = parseFloat(result[0].averageAccelerationPedalPositionAlgo.counter);

                            var updateObj = {};
                            var Obj = module.exports.calculatePedalPosition(veh_speed, acc_ped_pos, avg_acc_pedal_pos, counter)
                            updateObj.averageAccelerationPedalPositionAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.calculatePedalPosition(veh_speed, acc_ped_pos, avg_acc_pedal_pos, counter)
                            updateObj.averageAccelerationPedalPositionAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });


                    } else {

                        var insertObj = module.exports.calculatePedalPosition(veh_speed, acc_ped_pos, avg_acc_pedal_pos, counter)
                        var pedalPositionInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            averageAccelerationPedalPositionAlgo: insertObj
                        });
                        pedalPositionInfo.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }

                        });


                    }

                }

            });

            logger.debug("acceleration calculation dao dao finished");
        });

    },

    calculatePedalPosition: function (veh_speed, acc_ped_pos, avg_acc_pedal_pos, counter) {
        if (veh_speed > 0 && acc_ped_pos > 0) {
            avg_acc_pedal_pos = ((counter * avg_acc_pedal_pos) + acc_ped_pos) / (counter + 1);
            counter = counter + 1;
        }
        var insertObj = {};
        insertObj.avg_acc_pedal_pos = avg_acc_pedal_pos;
        insertObj.counter = counter;

        return insertObj;
    },


    //calculate speedCount Algorithm
    calculateSpeedings: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("speeding calculation dao started");

            var speedCount = 0;
            var speed = reqObj.Speed;
            var isExceed = false;

            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].speedingsAlgo.speedCount !== undefined) {
                            speedCount = parseFloat(result[0].speedingsAlgo.speedCount);
                            isExceed = result[0].speedingsAlgo.isExceed;

                            var updateObj = {};
                            var Obj = module.exports.calculateSpeedCount(speed, speedCount, isExceed)
                            updateObj.speedingsAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.calculateSpeedCount(speed, speedCount, isExceed);
                            updateObj.speedingsAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });

                    } else {

                        var insertObj = module.exports.calculateSpeedCount(speed, speedCount, isExceed);
                        var speedingInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            speedingsAlgo: insertObj
                        });
                        speedingInfo.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }
                        });
                    }
                }

            });

            logger.debug("speeding calculation dao dao finished");
        });

    },

    calculateSpeedCount: function (speed, speedCount, isExceed) {

        if (speed > constants.speedLimit && isExceed === false) {
            speedCount = speedCount + 1;
            isExceed = true;
        }
        if (speed < constants.speedLimit) {
            isExceed = false;
        }
        var insertObj = {};
        insertObj.speedCount = speedCount;
        insertObj.isExceed = isExceed;
        return insertObj;
    },


    //calculate Braking Instantaneous Rating Algorithm
    calculateBrakeRating: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("braking instantaneous rating calculation dao started");
            var veh_spd = reqObj.VehicleSpeed;
            var brake_pedal_status = parseInt(reqObj.BrakeSwitch);
            var clutch_pedal_status = parseInt(reqObj.ClutchSwitch);


            var brk_cycle_start_spd = 0;
            var brk_cycle_end_spd = 0;
            var brk_cycle_time = 0;
            var flag_brk = 0;
            var brk_cycle_complete = 0;
            var no_of_brk_cycle = 0;
            var brk_inst_rating = 0;
            var acceleration = 0;

            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].brakingInstaneousRatingAlgo.brk_inst_rating !== undefined) {
                            brk_cycle_start_spd = parseFloat(result[0].brakingInstaneousRatingAlgo.brk_cycle_start_spd);
                            brk_cycle_end_spd = parseFloat(result[0].brakingInstaneousRatingAlgo.brk_cycle_end_spd);
                            brk_cycle_time = parseFloat(result[0].brakingInstaneousRatingAlgo.brk_cycle_time);
                            flag_brk = parseFloat(result[0].brakingInstaneousRatingAlgo.flag_brk);
                            brk_cycle_complete = parseFloat(result[0].brakingInstaneousRatingAlgo.brk_cycle_complete);
                            no_of_brk_cycle = parseFloat(result[0].brakingInstaneousRatingAlgo.no_of_brk_cycle);
                            brk_inst_rating = parseFloat(result[0].brakingInstaneousRatingAlgo.brk_inst_rating);
                            acceleration = parseFloat(result[0].brakingInstaneousRatingAlgo.acceleration);

                            var updateObj = {};
                            var Obj = module.exports.calculateBrakingInstantaneousRating(veh_spd, brake_pedal_status, clutch_pedal_status, brk_cycle_start_spd, brk_cycle_end_spd, brk_cycle_time, flag_brk, brk_cycle_complete, no_of_brk_cycle, brk_inst_rating, acceleration);
                            updateObj.brakingInstaneousRatingAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.calculateBrakingInstantaneousRating(veh_spd, brake_pedal_status, clutch_pedal_status, brk_cycle_start_spd, brk_cycle_end_spd, brk_cycle_time, flag_brk, brk_cycle_complete, no_of_brk_cycle, brk_inst_rating, acceleration);
                            updateObj.brakingInstaneousRatingAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });

                    } else {

                        var insertObj = module.exports.calculateBrakingInstantaneousRating(veh_spd, brake_pedal_status, clutch_pedal_status, brk_cycle_start_spd, brk_cycle_end_spd, brk_cycle_time, flag_brk, brk_cycle_complete, no_of_brk_cycle, brk_inst_rating, acceleration);
                        var brakeRatingInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            brakingInstaneousRatingAlgo: insertObj
                        });
                        brakeRatingInfo.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }
                        });
                    }
                }

            });

            logger.debug("braking instantaneous rating calculation dao dao finished");
        });

    },

    calculateBrakingInstantaneousRating: function (veh_spd, brake_pedal_status, clutch_pedal_status, brk_cycle_start_spd, brk_cycle_end_spd, brk_cycle_time, flag_brk, brk_cycle_complete, no_of_brk_cycle, brk_inst_rating, acceleration) {
        if (brake_pedal_status === constants.Released && flag_brk === 0) {
            brk_cycle_start_spd = veh_spd;
        }
        if (brake_pedal_status === constants.Pressed) {
            brk_cycle_end_spd = veh_spd;
            brk_cycle_time = brk_cycle_time + (constants.algo_periodicity / 1000);
            flag_brk = 1;
        }

        if (brake_pedal_status === constants.Pressed && flag_brk === 1) {
            brk_cycle_complete = 1;
            no_of_brk_cycle = no_of_brk_cycle + 1;
        }


        if (brake_pedal_status === constants.Pressed && veh_spd !== 0 && brk_cycle_end_spd === 0) {
            brk_cycle_complete = 1;
            no_of_brk_cycle = no_of_brk_cycle + 1;
        }

        if (brk_cycle_complete === 1) {
            acceleration = (brk_cycle_end_spd - brk_cycle_start_spd) / (10 * brk_cycle_time);
            if (acceleration < 0) {
                acceleration = -1 * acceleration;
            }
            brk_inst_rating = 0;
            for (var i = 0; i <= constants.exponent; i++) {
                brk_inst_rating = brk_inst_rating + (constants.accln_coeff[i] * Math.pow(acceleration, i));
            }
            brk_cycle_complete = 0;
            brk_cycle_time = 0;
            flag_brk = 0;
        }

        var insertObj = {};
        insertObj.brk_inst_rating = brk_inst_rating;
        insertObj.acceleration = acceleration;
        insertObj.no_of_brk_cycle = no_of_brk_cycle;
        insertObj.brk_cycle_start_spd = brk_cycle_start_spd;
        insertObj.brk_cycle_end_spd = brk_cycle_end_spd;
        insertObj.brk_cycle_time = brk_cycle_time;
        insertObj.flag_brk = flag_brk;
        insertObj.brk_cycle_complete = brk_cycle_complete;
        return insertObj;
    },

    //calculate Acceleration Pedal Position Analytics Algorithm
    calculateAccelerationPedalPosition: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("accleration pedal position analytics calculation dao started");
            var veh_spd = reqObj.VehicleSpeed;
            var acc_ped_pos = reqObj.AccelPedal;


            var acc_ped_normal_press = 0;
            var acc_ped_moderate_press = 0;
            var acc_ped_heavy_press = 0;
            var acc_ped_harsh_press = 0;
            var acc_ped_no_press = 0;
            var total_acc_ped_press_time = 0;
            var total_acc_ped_press = 0;
            var total_travel_time = 0;



            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].accelerationPedalPositionAnalyticsAlgo.total_acc_ped_press !== undefined) {
                            acc_ped_normal_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.acc_ped_normal_press);
                            acc_ped_moderate_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.acc_ped_moderate_press);
                            acc_ped_heavy_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.acc_ped_heavy_press);
                            acc_ped_harsh_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.acc_ped_harsh_press);
                            acc_ped_no_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.acc_ped_no_press);
                            total_acc_ped_press_time = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.total_acc_ped_press_time);
                            total_travel_time = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.total_travel_time);
                            total_acc_ped_press = parseFloat(result[0].accelerationPedalPositionAnalyticsAlgo.total_acc_ped_press);

                            var updateObj = {};
                            var Obj = module.exports.accelerationPedalPositionAnalytics(veh_spd, acc_ped_pos, acc_ped_normal_press, acc_ped_moderate_press, acc_ped_heavy_press, acc_ped_harsh_press, acc_ped_no_press, total_acc_ped_press_time, total_travel_time, total_acc_ped_press);
                            updateObj.accelerationPedalPositionAnalyticsAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.accelerationPedalPositionAnalytics(veh_spd, acc_ped_pos, acc_ped_normal_press, acc_ped_moderate_press, acc_ped_heavy_press, acc_ped_harsh_press, acc_ped_no_press, total_acc_ped_press_time, total_travel_time, total_acc_ped_press);
                            updateObj.accelerationPedalPositionAnalyticsAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });

                    } else {


                        var insertObj = module.exports.accelerationPedalPositionAnalytics(veh_spd, acc_ped_pos, acc_ped_normal_press, acc_ped_moderate_press, acc_ped_heavy_press, acc_ped_harsh_press, acc_ped_no_press, total_acc_ped_press_time, total_travel_time, total_acc_ped_press);
                        var accelerationPedalPositionAnalytics = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            accelerationPedalPositionAnalyticsAlgo: insertObj
                        });
                        accelerationPedalPositionAnalytics.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }
                        });
                    }
                }

            });

            logger.debug("accleration pedal position analytics  dao finished");
        });

    },

    accelerationPedalPositionAnalytics: function (veh_spd, acc_ped_pos, acc_ped_normal_press, acc_ped_moderate_press, acc_ped_heavy_press, acc_ped_harsh_press, acc_ped_no_press, total_acc_ped_press_time, total_travel_time, total_acc_ped_press) {

        var acc_ped_normal_press_percentage = 0;
        var acc_ped_moderate_press_percentage = 0;
        var acc_ped_heavy_press_percentage = 0;
        var acc_ped_harsh_press_percentage = 0;
        var acc_ped_no_press_percentage = 0;

        if (veh_spd > 0) {
            if (0 < acc_ped_pos && acc_ped_pos <= constants.acc_ped_normal_tresh) {
                acc_ped_normal_press = acc_ped_normal_press + 1;
            }
            else if (constants.acc_ped_normal_tresh < acc_ped_pos && acc_ped_pos <= constants.acc_ped_moderate_tresh) {
                acc_ped_moderate_press = acc_ped_moderate_press + 1;
            }
            else if (constants.acc_ped_moderate_tresh < acc_ped_pos && acc_ped_pos <= constants.acc_ped_heavy_tresh) {
                acc_ped_heavy_press = acc_ped_heavy_press + 1;
            }
            else if (acc_ped_pos > constants.acc_ped_heavy_tresh) {
                acc_ped_harsh_press = acc_ped_harsh_press + 1;
            } else {
                acc_ped_no_press = acc_ped_no_press + 1;
            }

            total_acc_ped_press = acc_ped_normal_press + acc_ped_moderate_press + acc_ped_heavy_press + acc_ped_harsh_press + acc_ped_no_press;
            total_travel_time = total_acc_ped_press * (constants.algo_periodicity / 1000);
            total_acc_ped_press_time = (total_acc_ped_press - acc_ped_no_press) * (constants.algo_periodicity / 1000);
            acc_ped_normal_press_percentage = acc_ped_normal_press / ((total_acc_ped_press - acc_ped_no_press) * 100);
            acc_ped_moderate_press_percentage = acc_ped_moderate_press / ((total_acc_ped_press - acc_ped_no_press) * 100);
            acc_ped_heavy_press_percentage = acc_ped_heavy_press / ((total_acc_ped_press - acc_ped_no_press) * 100);
            acc_ped_harsh_press_percentage = acc_ped_harsh_press / ((total_acc_ped_press - acc_ped_no_press) * 100);
            acc_ped_no_press_percentage = acc_ped_no_press / (total_acc_ped_press * 100);

        }

        var insertObj = {};
        insertObj.acc_ped_normal_press = acc_ped_normal_press;
        insertObj.acc_ped_moderate_press = acc_ped_moderate_press;
        insertObj.acc_ped_heavy_press = acc_ped_heavy_press;
        insertObj.acc_ped_harsh_press = acc_ped_harsh_press;
        insertObj.acc_ped_no_press = acc_ped_no_press;


        insertObj.total_acc_ped_press = total_acc_ped_press;
        insertObj.total_travel_time = total_travel_time;
        insertObj.total_acc_ped_press_time = total_acc_ped_press_time;

        insertObj.acc_ped_normal_press_percentage = acc_ped_normal_press_percentage;
        insertObj.acc_ped_moderate_press_percentage = acc_ped_moderate_press_percentage;
        insertObj.acc_ped_heavy_press_percentage = acc_ped_heavy_press_percentage;
        insertObj.acc_ped_harsh_press_percentage = acc_ped_harsh_press_percentage;
        insertObj.acc_ped_no_press_percentage = acc_ped_no_press_percentage;

        return insertObj;
    },

    //calculate Hard Braking Algorithm
    calculateHardBraking: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("hard braking calculation dao started");
            var veh_spd = reqObj.VehicleSpeed;
            var brake_pedal_status = parseInt(reqObj.BrakeSwitch);
            var clutch_pedal_status = parseInt(reqObj.ClutchSwitch);

            var total_time = 0;
            var high_spd_brk_clt_time = 0;
            var hardBrakingCount = 0;

            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        if (result[0].hardBrakibgAlgo.total_time !== undefined) {
                            total_time = parseFloat(result[0].hardBrakibgAlgo.total_time);
                            high_spd_brk_clt_time = parseFloat(result[0].hardBrakibgAlgo.total_time);
                            hardBrakingCount = parseFloat(result[0].hardBrakibgAlgo.hardBrakingCount);


                            var updateObj = {};
                            var Obj = module.exports.brakingWithClutchAtHighSpeed(veh_spd, brake_pedal_status, total_time, clutch_pedal_status, high_spd_brk_clt_time, hardBrakingCount);
                            updateObj.hardBrakibgAlgo = Obj;
                        }
                        else {
                            var updateObj = {};
                            var Obj = module.exports.brakingWithClutchAtHighSpeed(veh_spd, brake_pedal_status, total_time, clutch_pedal_status, high_spd_brk_clt_time, hardBrakingCount);
                            updateObj.hardBrakibgAlgo = Obj;
                        }

                        module.exports.updateDriverBehaviourDetails({ tripId: reqObj.TripId }, updateObj).then(function (updateResult) {
                            return resolve(updateResult);
                        }, function (err) {
                            return reject(err);
                        });

                    } else {


                        var insertObj = module.exports.brakingWithClutchAtHighSpeed(veh_spd, brake_pedal_status, total_time, clutch_pedal_status, high_spd_brk_clt_time, hardBrakingCount);
                        var accelerationPedalPositionAnalytics = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId,
                            hardBrakibgAlgo: insertObj
                        });
                        accelerationPedalPositionAnalytics.save(function (err, result) {
                            if (result) {
                                return resolve(insertObj);
                            }
                            if (err) {
                                logger.error(err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));

                            }
                        });
                    }
                }

            });

            logger.debug("hard braking dao finished");
        });

    },

    brakingWithClutchAtHighSpeed: function (veh_spd, brake_pedal_status, total_time, clutch_pedal_status, high_spd_brk_clt_time, hardBrakingCount) {

        var high_spd_brk_clt_percentage = 0;

        if (veh_spd > constants.high_spd_brk) {
            if (brake_pedal_status === constants.Pressed && clutch_pedal_status === constants.Pressed) {
                high_spd_brk_clt_time = high_spd_brk_clt_time + (constants.algo_periodicity / 1000);
                hardBrakingCount = hardBrakingCount + 1;
            }
            total_time = total_time + (constants.algo_periodicity / 1000);
            high_spd_brk_clt_percentage = (high_spd_brk_clt_time / total_time) * 100;
        }

        var insertObj = {};
        insertObj.total_time = total_time;
        insertObj.high_spd_brk_clt_time = high_spd_brk_clt_time;
        insertObj.high_spd_brk_clt_percentage = high_spd_brk_clt_percentage;
        insertObj.hardBrakingCount = hardBrakingCount;

        return insertObj;
    },

    /**
  * DAO for get driver behaviour details by id
  */
    getDriverBehaviourDetails: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("get driver behaviour  dao started");
            db.driverBehaviour.findOne(reqObj).
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

            logger.debug("get driver behaviour dao finished");
        });
    },


    /**
  * DAO for get create driver behaviour info
  */
    insertDriverBehaviourDetails: function (reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("cretae driver behaviour  dao strated");
            db.driverBehaviour.find({ tripId: reqObj.TripId }).exec(function (err, result) {
                if (err) {
                    return reject(util.responseUtil(null, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result && result.length) {
                        return resolve(util.responseUtil(null, null, responseConstant.TRIP_EXIST));
                    } else {
                        var driverInfo = new db.driverBehaviour({
                            tripId: reqObj.TripId,
                            userId: reqObj.UserId
                        });
                        driverInfo.save(function (err, result) {
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
            logger.debug("create driver behaviour dao finished");
        });
    },

    /**
  * DAO for get update driver behaviour info
  */
    updateDriverBehaviourDetails: function (reqCondition, reqObj) {
        return new Promise(function (resolve, reject) {
            logger.debug("update driver behaviour  dao strated");
            db.driverBehaviour.update(reqCondition, reqObj, function (err, result) {
                if (err) {
                    logger.error(err);
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                } else {
                    if (result.nModified) {
                        return resolve(reqObj);
                    }
                }

            });
            logger.debug("update driver behaviour dao finished");
        });
    },

    /**
  * DAO for get driver score
  */
    getAllDriverScore: function (reqObj, skip, limit, sort, order) {
        return new Promise(function (resolve, reject) {
            logger.debug("Get all driver score dao started");
            db.driverBehaviour.find(reqObj, { driverBehaviour: 1, tripId: 1, userId: 1 }).
                skip(skip).
                limit(limit).
                sort({ [sort]: order }).exec(function (err, result) {
                    if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                    db.driverBehaviour.count(reqObj).exec(function (err, count) {
                        if (err) return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        result.rows = result;
                        result.count = count;
                        return resolve(result);
                    });
                });
            logger.debug("Get all driver score dao finished");
        });
    },
}
