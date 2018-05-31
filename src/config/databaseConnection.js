'use strict';
/**
 *  This module is use to define database connection
 *  @module database connection
 *  @author shweta.ghenand
 *  @version 1.0.0
 */

/**
 * npm modules
 */
var mongoose = require('mongoose');

/**
 *  import project module
 */
var config = require('./config.json');
config = config[config.activeEnv];
var logger = require('../util/logger');
var tripModel = require('../models/trip');
var driverBehaviourModel = require('../models/driverBehaviour');
var faultDataModel = require('../models/faultData');
var ruleModel = require('../models/rule');
var tripDetailsModel = require('../models/tripDetails');
var vehicleHistoryModel = require('../models/vehicleHistory');
var connections = {};
var Models = {};
var trips;
var driverBehaviour;
var faultData;
var rule;
var tripDetails;
var vehicleHistory;

/**
 *  Define database connection
 */

module.exports = {

    //Object holding all your connection strings
    getDatabaseConnection: function (dbName, cb) {

        var url = config.mongoDB.url + dbName + "?ssl=true";

        try {
            if (connections[dbName]) {
                //  database connection already exist. Return connection object

                cb(null, connections[dbName]);

            } else {
                connections[dbName] = mongoose.createConnection(url);

                cb(null, connections[dbName]);
            }

            //vehicleHistory data Model
            if (connections[dbName].models['vehicleHistory']) {
                vehicleHistory = connections[dbName].models['vehicleHistory'];
                Models.vehicleHistory = vehicleHistory;
            }
            else {
                vehicleHistory = connections[dbName].model('vehicleHistory', vehicleHistoryModel.vehicleHistory);
                Models.vehicleHistory = vehicleHistory;
            }
            //trip Model
            if (connections[dbName].models['trips']) {
                trips = connections[dbName].models['trips'];
                Models.trips = trips;
            }
            else {
                trips = connections[dbName].model('trips', tripModel.trip);
                Models.trips = trips;

            }
            //driver behaviour Model
            if (connections[dbName].models['driverBehaviour']) {
                driverBehaviour = connections[dbName].models['driverBehaviour'];
                Models.driverBehaviour = driverBehaviour;
            }
            else {
                driverBehaviour = connections[dbName].model('driverBehaviour', driverBehaviourModel.driverBehaviour);
                Models.driverBehaviour = driverBehaviour;

            }
            //fault data Model
            if (connections[dbName].models['faultData']) {
                faultData = connections[dbName].models['faultData'];
                Models.faultData = faultData;
            }
            else {
                faultData = connections[dbName].model('faultData', faultDataModel.faultData);
                Models.faultData = faultData;
            }


            //rule data Model
            if (connections[dbName].models['rule']) {
                rule = connections[dbName].models['rule'];
                Models.rule = rule;
            }
            else {
                rule = connections[dbName].model('rule', ruleModel.rules);
                Models.rule = rule;
            }


            //tripDetails data Model
            if (connections[dbName].models['tripDetails']) {
                tripDetails = connections[dbName].models['tripDetails'];
                Models.tripDetails = tripDetails;
            }
            else {
                tripDetails = connections[dbName].model('tripDetails', tripDetailsModel.tripDetails);
                Models.tripDetails = tripDetails;
            }


        } catch (err) {
            logger.error(err);
            cb(err, null);
        }

    }
}
module.exports.dbModel = Models