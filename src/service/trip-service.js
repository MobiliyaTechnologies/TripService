'use strict';
/**
 *  This module is use to define service for trip  
 *  @module tripService
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
/**
 *  import project module
 */
var util = require("../util/commonUtil");
var tripDao = require("../dao/trip-dao");
var vehicleHistoryDao = require('../dao/vehicleHistory-dao');
var driverBehaviourDao = require('../dao/driverBehaviour-dao');
var responseConstant = require("../constant/responseConstant");
var empty = require('is-empty');
var constants = require("../constant/constants");


/**
  * export module
  */

module.exports = {
    /**
     * Controller function for get list of trips
     */
    getAllTripData: function (req) {
        return new Promise(function (resolve, reject) {

            var page = 0;
            var limit = 10;
            var sort = 'tripCompletedAt';
            var order = 'desc';
            var reqObj = {};


            //remove page,sort,order and limit variable if exist
            if (req.query.order && req.query.order == 'asc') {    //order of list           
                order = 'asc';
                //delete req.query.order;
            }
            if (req.query.sort) { //sort of list
                sort = req.query.sort;
                //delete req.query.sort;
            }
            if (req.query.limit) { //limit 
                limit = parseInt(req.query.limit);
                //delete req.query.limit
            }
            if (req.query.page) { //which page data 
                if (req.query.page >= 2)
                    page = (parseInt(req.query.page) - 1) * limit;
                else
                    page = 0;
            }
            if (req.query.vehicleId) {
                reqObj.vehicleId = req.query.vehicleId;

            }
            if (req.query.startTime) {
                reqObj.startTime = req.query.startTime;

            }
            reqObj.isDeleted = 0;
            reqObj.status = 0;

            tripDao.getAllTripData(reqObj, page, limit, sort, order).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },


    /**
   * Controller function for get trip details by id
   */
    getTripDetails: function (req) {
        return new Promise(function (resolve, reject) {
            tripDao.getTripDetails({ commonId: req.params.id, isDeleted: 0 }).then(function (result) {
                tripDao.getTripFaultData({ tripId: req.params.id, isDeleted: 0 }).then(function (faultDataResult) {
                    result.faultCount = faultDataResult.count;
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                }, function (err) {
                    return reject(err);
                });
            }, function (err) {
                return reject(err);
            });
        });
    },


    /**
     * Controller function for create trip
     */
    insertData: function (req) {
        return new Promise(function (resolve, reject) {
            var insertObj = isEmptyCheck(req.body);
            insertObj.tenantId = req.params.tenantId;
            tripDao.insertData(insertObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);

            })

        })
    },


    /**
     * Controller function for update trip
     */
    updateData: function (req) {
        return new Promise(function (resolve, reject) {
            var updateObj = isEmptyCheck(req.body);
            tripDao.getTripDetails({ commonId: req.params.id, isDeleted: 0 }).then(function (tripResult) {
                if (updateObj.status === '2') {
                    updateObj.stops = tripResult.stops + 1;
                }
                if (updateObj.status === '0') {
                    updateObj.tripCompletedAt = new Date();
                }
                updateObj.updatedAt = new Date();
                tripDao.updateData(updateObj, { commonId: req.params.id, isDeleted: 0 }).then(function (result) {
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                }, function (err) {
                    return reject(err);
                });
            }, function (err) {
                return reject(err);
            });
        });
    },


    /**
      * Controller function for delete trip
      */
    deleteData: function (req) {
        return new Promise(function (resolve, reject) {
            var updateObj = {};
            updateObj.updatedAt = new Date();
            updateObj.isDeleted = 1;
            tripDao.deleteData(updateObj, { commonId: req.params.id, isDeleted: 0 }).then(function (result) {
                return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },


    /**
   * Controller function for get vehicle history
   */
    getAllVehicleHistory: function (req) {
        return new Promise(function (resolve, reject) {
            var page = 0;
            var limit = 10;
            var sort = 'createdAt';
            var order = 'desc';
            var reqObj = {};
            //remove page,sort,order and limit variable if exist
            if (req.query.order && req.query.order == 'asc') {    //order of list           
                order = 'asc';
                //delete req.query.order;
            }
            if (req.query.sort) { //sort of list
                sort = req.query.sort;
                //delete req.query.sort;
            }
            if (req.query.limit) { //limit 
                limit = parseInt(req.query.limit);
                //delete req.query.limit
            }
            if (req.query.page) { //which page data 
                if (req.query.page >= 2)
                    page = (parseInt(req.query.page) - 1) * limit;
                else
                    page = 0;
            }
            if (req.query.vehicleId) {
                reqObj.vehicleId = req.query.vehicleId;

            }
            if (req.query.commonId) {
                reqObj['data.TripId'] = req.query.commonId;
            }


            reqObj.isDeleted = 0;

            vehicleHistoryDao.getAllVehicleHistory(reqObj, page, limit, sort, order).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },

    /**
 * Controller function for get overall driver rating
 */
    getAllDriverScore: function (req) {
        return new Promise(function (resolve, reject) {
            var page = 0;
            var limit = 0;
            var sort = 'createdAt';
            var order = 'desc';
            var reqObj = {};


            //remove page,sort,order and limit variable if exist
            if (req.query.order && req.query.order == 'asc') {    //order of list           
                order = 'asc';
                //delete req.query.order;
            }
            if (req.query.sort) { //sort of list
                sort = req.query.sort;
                //delete req.query.sort;
            }
            if (req.query.limit) { //limit 
                limit = parseInt(req.query.limit);
                //delete req.query.limit
            }
            if (req.query.page) { //which page data 
                if (req.query.page >= 2)
                    page = (parseInt(req.query.page) - 1) * limit;
                else
                    page = 0;
            }
            if (req.query.userId) {
                reqObj.userId = req.query.userId;

            }

            reqObj.isDeleted = 0;

            driverBehaviourDao.getAllDriverScore(reqObj, page, limit, sort, order).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },

    /**
 * Controller function for get vehicle data for report
 */
    getReportData: function (req) {
        return new Promise(function (resolve, reject) {
            var reqCondition = {};
            reqCondition['vehicleId'] = req.query.vehicleId
            reqCondition['data.TripId'] = { $ne: "NA" },
                reqCondition['isDeleted'] = 0
            vehicleHistoryDao.getReportData(reqCondition, req.query.startDate, req.query.no_of_days).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },


    /**
* Controller function for get speed limit value
*/
    getConfigDetails: function (req) {
        var tripConfig = {};
        tripConfig.speedLimit= constants.speedLimit;
        return util.responseUtil(null, tripConfig, responseConstant.SUCCESS)
    }
}

/**
Function for empty check
 */
function isEmptyCheck(body) {
    var insertObj = {};
    if (!empty(body.tripName)) {
        insertObj.tripName = body.tripName;
    }
    if (!empty(body.description)) {
        insertObj.description = body.description;
    }
    if (!empty(body.startTime)) {
        insertObj.startTime = body.startTime;
    }
    if (!empty(body.endTime)) {
        insertObj.endTime = body.endTime;
    }
    if (!empty(body.startLocation)) {
        insertObj.startLocation = body.startLocation;
    }
    if (!empty(body.endLocation)) {
        insertObj.endLocation = body.endLocation;
    }
    if (!empty(body.vehicleId)) {
        insertObj.vehicleId = body.vehicleId;
    }
    if (!empty(body.status)) {
        insertObj.status = body.status;
    }
    if (!empty(body.commonId)) {
        insertObj.commonId = body.commonId;
    }
    if (!empty(body.stops)) {
        insertObj.stops = body.stops;
    }
    if (!empty(body.milesDriven)) {
        insertObj.milesDriven = body.milesDriven;
    }
    if (!empty(body.speedings)) {
        insertObj.speedings = body.speedings;
    }
    return insertObj;
}