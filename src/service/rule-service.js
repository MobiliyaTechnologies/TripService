'use strict';
/**
 *  This module is use to define service for rule
 *  @module ruleService
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
/**
 *  import project module
 */
var util = require("../util/commonUtil");
var ruleDao = require("../dao/rule-dao");
var responseConstant = require("../constant/responseConstant");
var empty = require('is-empty');
var constants = require("../constant/constants");

/**
  * export module
  */

module.exports = {

    /* Controller function for get list of rules
    */
    getAllRuleData: function (req) {
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
            if (req.query.vehicleId) {
                reqObj.vehicleId = req.query.vehicleId;

            }
            if (req.query.ruleType) {
                reqObj.ruleType = req.query.ruleType;

            }

            reqObj.isDeleted = 0;

            ruleDao.getAllRuleData(reqObj, page, limit, sort, order).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },

    /**
     * Controller function for set geofence rule
     */
    insertGeofenceData: function (req) {
        return new Promise(function (resolve, reject) {

            if (empty(req.body.ruleName)) {
                req.body.ruleName = 'Rule1';
            }
            if (empty(req.body.ruleType)) {
                req.body.ruleType = 'Location';
            }
            ruleDao.insertGeofenceData(req.body).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);

            })

        })
    },

    /**
     * Controller function for  Check if location fall within a given region. 
     */
    testLocation: function (req) {
        return new Promise(function (resolve, reject) {
            ruleDao.testLocation(req).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);

            })

        })
    },

    /**
  * Controller function for set speeding rule
  */
    insertSpeedingsData: function (req) {
        return new Promise(function (resolve, reject) {
            if (empty(req.body.ruleName)) {
                req.body.ruleName = 'Rule1';
            }
            if (empty(req.body.ruleType)) {
                req.body.ruleType = 'Speed';
            }
            ruleDao.insertSpeedingsData(req.body).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);

            })

        })
    },

    /**
* Controller function for get rule details by id
*/
    getRuleDetails: function (req) {
        return new Promise(function (resolve, reject) {
            ruleDao.getRuleDetailsById({ _id: req.params.id, isDeleted: 0 }).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }, function (err) {
                return reject(err);
            });
        });
    },

}
