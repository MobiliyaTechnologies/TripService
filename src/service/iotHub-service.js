'use strict';
/**
 *  This module is use to define service for IOT Hub
 *  @module tripService
 *  @author shweta.ghenand
 *  @version 1.0.0
 */


/**
*  import project module
*/
var config = require('../config/config.json');
config = config[config.activeEnv].iothub;
var EventHubClient = require('azure-event-hubs').Client;
var connectionString = config.CONNECTION_STRING;
var async = require('async');
var client = EventHubClient.fromConnectionString(connectionString);
var tripDao = require('../dao/trip-dao');
var vehicleHistoryDao = require('../dao/vehicleHistory-dao');
var db = require('../config/databaseConnection');
var driverBehaviourDao = require('../dao/driverBehaviour-dao');
var logger = require("../util/logger");
var dbName;

var iothubService_test = {
    storeMessage: function (message) {
        logger.info('Message received:', Object.keys(message.body).length);
        logger.info("Message data:", message.body);

        if (Object.keys(message.body).length === 0) {
            logger.info("Message body Empty", message.body);
        }
        else {
            var data = JSON.parse(message.body.Parameters);
            dbName = "trip_" + data.TenantId + "_db";
            db.getDatabaseConnection(dbName, function (err, dbInstance) {
                if (dbInstance) {
                    vehicleHistoryDao.insertData(data).then(function (vehicleResult) {
                        //insert fault data
                        if (data.hasOwnProperty('FaultSPN') && data.FaultSPN !== '0') {
                            vehicleHistoryDao.insertFaultData(data).then(function (result) {
                            }, function (err) {
                                logger.error(err);
                            });
                        }

                        if (data.hasOwnProperty('TripId') && data.TripId !== 'NA') {
                            tripDao.insertTripData(data).then(function (result) {
                                driverBehaviourDao.insertDriverBehaviourDetails(data).then(function (result) {
                                    var asyncObject = [];

                                    //Driver Behaviour Rating Algorithm
                                    //1.1 Fuel Eco Rating-Percenatge of Time and Distance
                                    if ((data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) && (data.hasOwnProperty('RPM') && data.RPM !== 'NA' && data.RPM !== 0)) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateFuleEcoRating_TimeandDistance(data).then(function (resultTimeandDistance) {
                                                callback(null, resultTimeandDistance);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });

                                        })
                                        //1.2 Fuel Eco Rating-Average Engine RPM
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateFuelEcoRating_AverageEngineRPM(data).then(function (resultAverageEngineRPM) {
                                                callback(null, resultAverageEngineRPM);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    //2.1 Acceleration Rating Algorithm-Average Pedal Position
                                    if ((data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) && (data.hasOwnProperty('AccelPedal') && data.AccelPedal !== 'NA' || data.AccelPedal !== 0.0)) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateAccelerationRatingPedalPositionAverage(data).then(function (resultPedalPosition) {
                                                callback(null, resultPedalPosition);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    //2.2 Acceleration Rating Algorithm-Average Pedal Position Analytics
                                    if ((data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) && (data.hasOwnProperty('AccelPedal') && data.AccelPedal !== 'NA' || data.AccelPedal !== 0.0)) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateAccelerationPedalPositionAnalytics(data).then(function (resultPedalPositionAnalytics) {
                                                callback(null, resultPedalPositionAnalytics);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    //3.1 Speed Rating Algorithm-
                                    if (data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateSpeedings(data).then(function (resultSpeedExceed) {
                                                callback(null, resultSpeedExceed);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    //4.1 Brake Rating Algorithm-Braking Instantaneous Rating 

                                    if ((data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) && (data.hasOwnProperty('BrakeSwitch') && data.BrakeSwitch === '0' || data.BrakeSwitch === '1') && (data.hasOwnProperty('ClutchSwitch') && data.ClutchSwitch === '0' || data.ClutchSwitch === '1')) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateBrakeRating(data).then(function (resultInstantaneousBrakeRating) {
                                                callback(null, resultInstantaneousBrakeRating);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    //4.2 Brake Rating Algorithm-Hard Braking Rating(Braking with Clutch at HighSpeed) 

                                    if ((data.hasOwnProperty('Speed') && data.Speed !== 'NA' && data.Speed !== 0.0) && (data.hasOwnProperty('BrakeSwitch') && data.BrakeSwitch === '0' || data.BrakeSwitch === '1') && (data.hasOwnProperty('ClutchSwitch') && data.ClutchSwitch === '0' || data.ClutchSwitch === '1')) {
                                        asyncObject.push(function (callback) {
                                            driverBehaviourDao.calculateHardBraking(data).then(function (resultHardBrakeRating) {
                                                callback(null, resultHardBrakeRating);
                                            }, function (err) {
                                                logger.error(err);
                                                callback(err);

                                            });
                                        });
                                    }

                                    async.parallel(asyncObject, function (err, result) {
                                        if (err) {
                                            logger.error(err);

                                        } else {
                                            console.log("Driver Behaviour  Result :: ", result);

                                        }

                                    });

                                }, function (err) {
                                    logger.error(err);

                                });

                            }, function (err) {
                                logger.error(err);

                            });
                        }
                    }, function (err) {
                        logger.error(err);

                    });

                } else {
                    return reject(util.responseUtil(null, null, responseConstant.DB_CONNECTION_FAILED));
                }
            })

        }
    },

    printError: function (err) {
        logger.info('iothubService_test::Error while message receive ' + err);
    },

    receiveData: function () {
        client.open()
            .then(client.getPartitionIds.bind(client))
            .then(function (partitionIds) {
                return partitionIds.map(function (partitionId) {
                    return client.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
                        logger.info('Created partition receiver: ' + partitionId)
                        receiver.on('errorReceived', iothubService_test.printError);
                        receiver.on('message', iothubService_test.storeMessage);
                    });
                });
            })

            .catch(this.printError);
    }


};
/**
  * export module
  */

module.exports.iothubService_test = iothubService_test;