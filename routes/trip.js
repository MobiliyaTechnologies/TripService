'use strict';
/**
 *  This module is use to define routes 
 *  @module tripRoutes
 *  @author shweta.ghenand
 *  @version 1.0.0
 */
var express = require('express');
var HttpStatus = require('http-status-codes');

var router = express.Router();
var service = require('../src/service/trip-service');
var responseConstant = require("../src/constant/responseConstant");
var constants = require("../src/constant/constants");
var util = require('../src/util/commonUtil');
var empty = require('is-empty');
var auth = require('../src/config/authentication');


//create trip api
/**
 * @api {post}  /:tenantId/trips Create Trip 
 * @apiVersion 1.0.0
 * @apiName CreateTrip
 * @apiGroup Trips
 *
 * @apiDescription Create Trip. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X POST  --data '{"tripName": "trip1","description": "Trip Monday, January 8, 11:06:35 AM","startTime":"2018-01-08T05:36:35.000Z","endTime":"2018-01-08T05:43:29.000Z","startLocation":"18.5566425, 73.7930577","endLocation":"18.5566425, 73.7930577","vehicleId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiParam {String} tripName Name of Trip
 * @apiParam {Object} description Description of trip(optional)
 * @apiParam {Date} startTime Start time of trip
 * @apiParam {Date} endTime End time of trip
 * @apiParam {String} startLocation Start location of trip
 * @apiParam {String} endLocation End location of trip
 * @apiParam {String} vehicleId Vehicle involved in trip
 * @apiParam {Number} status status of the trip.
 * @apiParam {UUID} commonId common Id of the trip.
 * @apiParam {Number} stops stop count  of the trip.(optional)
 * @apiParam {String} milesDriven miles driven of the trip.(optional)
 *
 * @apiParamExample {json} Request-Example:
 *    	{
 *	    "tripName": "trip1",
        "startTime": "2018-01-08T05:36:35.000Z",
        "endTime": "2018-01-08T05:43:29.000Z",
        "startLocation": "18.5566425, 73.7930577",
        "endLocation": "18.5566425, 73.7930577",
        "vehicleId": "bc313a62-fdf9-4e66-8c22-a84c91f60aa4",
        "description": "Trip Monday, January 8, 11:06:35 AM",
        "commonId": "da57832a-6381-4139-8477-6de9b76c0330",        
        "status":  1
 *       }
 *
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalid request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 BadRequest
 *     {
 *        "message": "Bad Request"
 *     }
 * 

 * @apiSuccess {String} tripName Name of Trip
 * @apiSuccess {Object} description Description of trip
 * @apiSuccess {Date} startTime Start time of trip
 * @apiSuccess {Date} endTime End time of trip
 * @apiSuccess {String} startLocation Start location of trip
 * @apiSuccess {String} endLocation End location of trip
 * @apiSuccess {String} vehicleId Vehicle involved in trip
 * @apiSuccess {Number} status status of the trip.
*  @apiSuccess {UUID} commonId common Id of the trip.
 * @apiSuccess {Number} stops stop count of the trip.
 * @apiSuccess {String} milesDriven miles driven of the trip.
 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
    "message": "Success",
    "data": {
        "__v": 0,
        "tripName": "trip1",
        "startTime": "2018-01-08T05:36:35.000Z",
        "endTime": "2018-01-08T05:43:29.000Z",
        "startLocation": "18.5566425, 73.7930577",
        "endLocation": "18.5566425, 73.7930577",
        "vehicleId": "bc313a62-fdf9-4e66-8c22-a84c91f60aa4",
        "description": "Trip Monday, January 8, 11:06:35 AM",
        "status": 1,
        "createdAt": "2018-03-06T05:57:06.079Z",
        "isDeleted": false,
        "commonId": "da57832a-6381-4139-8477-6de9b76c0330",      
        "_id": "6d3a5cd4-6a0b-4828-b71d-f43100d68bb3"
    }
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips
 *
 */
router.post('/:tenantId/trips', function (req, res) {

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();
    req.checkBody('tripName', 'TripName can not be null.').notEmpty();
    req.checkBody('tripName', 'Invalid tripName.').isLength(3, 2000);
    req.checkBody('startLocation', 'StartLocation can not be null').notEmpty();
    req.checkBody('endLocation', 'EndLocation can not be null').notEmpty();
    req.checkBody('vehicleId', 'VehicleId can not be null').notEmpty();
    req.checkBody('commonId', 'CommonId can not be null').notEmpty();
    req.checkBody('startTime', 'startTime can not be null').notEmpty();
    req.checkBody('commonId', 'Invalid commonId ').isUUID();
    req.checkBody('vehicleId', 'Invalid vehicleId ').isUUID();
    req.checkBody('status', 'status can not be null').notEmpty();
    req.checkBody('status', 'Invalid status ').isIn(constants.tripStatus);

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.insertData(req).then(function (result) {
                res.status(HttpStatus.CREATED).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});

/*
/**
 * @api {get} /:tenantId/trips/:commonId Get Trip's Details
 * @apiVersion 1.0.0
 * @apiName Get Trip's Details
 * @apiGroup Trips
 *
 * @apiDescription Get Trip's Details. 
 *
 * @apiExample Example usage:
 * curl -i -X GET  -d "" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/5cbd29f9-8db8-45d1-b4ed-d69b7185dafd -H "Autherization:<access-token>" -H "Content-Type: application/json"
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiError BadRequest  Invalid request data.
 * @apiErrorExample Response (400 example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "Bad Request"
 *         "error": {
 *               "id": {
 *                   "location": "params",
 *                   "param": "id",
 *                   "msg": "Invalid"
 *               }
 *           }
 *     }
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     } 
 * 
 * 
 * @apiSuccess {String} tripName Name of Trip
 * @apiSuccess {Object} description Description of trip
 * @apiSuccess {Date} startTime Start time of trip
 * @apiSuccess {Date} endTime End time of trip
 * @apiSuccess {String} startLocation Start location of trip
 * @apiSuccess {String} endLocation End location of trip
 * @apiSuccess {String} vehicleId Vehicle involved in trip
 * @apiSuccess {Number} status status of the trip
 * @apiSuccess {UUID} commonId common Id of the trip.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *{
    "message": "Success",
    "data": {
        "_id": "1840f0d0-b505-435a-97d4-a00dfe2c1932",
        "tripName": "trip1",
        "startTime": "2018-01-08T05:36:35.000Z",
        "endTime": "2018-01-08T05:43:29.000Z",
        "startLocation": "18.5566425,18.5566425",
        "endLocation": "73.666666, 73.7930577",
        "vehicleId": "2c756802-d282-48fa-8c29-0b75f82fe673",
        "commonId": "da57832a-6381-4139-8477-6de9b76c0330",            
        "__v": 0,
        "stops": 0,
        "description": "Trip Monday, January 8, 11:06:35 AM",
        "status": 1,
        "createdAt": "2018-03-13T12:41:54.334Z",
        "isDeleted": false,
        "locationDetails": [
            {
                "latitude": "18.556671",
                "longitude": "73.7931409",
                "time": "2018-03-13T12:32:17.000Z"
            }
        ],
            "milesDriven": "-1",
            "fuelUsed": "-1",
            "avgSpeed": "-1",
            "topSpeed": "-1",
            "mileage": "-1",
            "speedings": "00",
            "hardBraking": "00",
            "engineFaults": "NA",
            "accelerator": "NA",
            "phoneUsage": "NA",
            "tripTime": "0:06:54"
    }
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/1840f0d0-b505-435a-97d4-a00dfe2c1932
 *
 */
router.get('/:tenantId/trips/:id', function (req, res) {
    req.checkParams('tenantId', 'TenantId can not be empty').notEmpty();
    req.checkParams('tenantId', 'Invalid tenantId').isUUID();

    req.checkParams('id', 'Id can not be empty').notEmpty();
    req.checkParams('id', 'Invalid id').isUUID();
    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.getTripDetails(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});

//Get All Trip Api
/**
 * @api {get} /:tenantId/trips Get All Trip List
 * @apiVersion 1.0.0
 * @apiName GetTripList
 * @apiGroup Trips
 *
 * @apiDescription Trip List. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X GET  -d "" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips -H "Autherization:<access-token>" -H "Content-Type: application/json"
 *
 * @apiParam {Number} page[page=0] Page Number (optional).
 * @apiParam {Number} limit[limit=0] List limit(optional).
 * @apiParam {String} sort[sort=createdAt]  Sorting on which field(optional).
 * @apiParam {String} order[order=asc] Sorting field order(asc|desc)(optional).
 * @apiParam {String} vehicleId  Vehicle involved in trip(optional).
 * @apiParam {Date} startTime fleet Start location of trip(optional).

 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalide request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "BadRequest"
 *     }
 * @apiSuccess {String} tripName Name of Trip
 * @apiSuccess {Object} description Description of trip
 * @apiSuccess {Date} startTime Start time of trip
 * @apiSuccess {Date} endTime End time of trip
 * @apiSuccess {String} startLocation Start location of trip
 * @apiSuccess {String} endLocation End location of trip
 * @apiSuccess {String} vehicleId Vehicle involved in trip
 * @apiSuccess {Number} status status of the trip
 * @apiSuccess {UUID} commonId common Id of the trip.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *{
    "message": "Success",
    "count": 1,
    "data": [
        {
            "_id": "5cbd29f9-8db8-45d1-b4ed-d69b7185dafd",
            "tripName": "trip1",
            "startTime": "2018-01-08T05:36:35.000Z",
            "endTime": "2018-01-08T05:43:29.000Z",
            "startLocation": "18.5566425, 73.7930577",
            "endLocation": "18.5566425, 73.7930577",
            "vehicleId": "2d0f2f7f-8dbe-4d47-840a-7c15eb4d60e7",
            "commonId": "da57832a-6381-4139-8477-6de9b76c0330",     
            "__v": 0,
            "description": "Trip Monday, January 8, 11:06:35 AM",
            "status": 1,
            "createdAt": "2018-03-06T08:13:32.764Z",
            "isDeleted": false
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips
 *
 */
router.get('/:tenantId/trips', function (req, res) {
    req.sanitizeBody('limit').trim();
    req.sanitizeBody('page').trim();
    req.sanitizeBody('sort').trim();
    req.sanitizeBody('order').trim();

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    if (!empty(req.query.limit)) {
        req.checkQuery('limit', 'Invalid limit parameter').optional().isInt();
    }
    if (!empty(req.query.page)) {
        req.checkQuery('page', 'Invalid page parameter').optional().isInt();
    }
    if (!empty(req.query.sort)) {
        req.checkQuery('sort', 'Invalid sort parameter').optional().isIn(constants.tripSortFields);
    }
    if (!empty(req.query.order)) {
        req.checkQuery('order', 'Invalid order parameter').optional().isIn(constants.order);
    }
    if (!empty(req.query.vehicleId)) {
        req.checkQuery('vehicleId', 'Invalid vehicleId').optional().isUUID();
    }

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.getAllTripData(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});


//Update Trip Api
/**
 * @api {put} /:tenantId/trips/:commonId Update Trip 
 * @apiVersion 1.0.0
 * @apiName UpdateTrip
 * @apiGroup Trips
 *
 * @apiDescription Update Trip. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X PUT  --data '{"tripName": "Updated trip","description":"Trip Monday, January 8, 11:06:35 AM","status":"stopped"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/5a2a8b63a4894865d03600a7
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 * 
 * @apiParam {String} [tripName=null] tripName Name of Trip(optional).
  * @apiParam {Date} endTime End time of trip
 * @apiParam {Object} [description=null] Description of trip(optional).
 * @apiParam {Number} [status=null] status Status of trip(0,1,2)(optional).
 * @apiParam {String} milesDriven miles driven of the trip.(optional)
 *
 * @apiParamExample {json} Request-Example:
 *     	{
 *	        "tripName": "Updated trip"
 	        "status": 2
 *       }
 *
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalide request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "Bad Request"
 *     } 
 * 
 * @apiSuccess {String} tripNaame tripName.
 * @apiSuccess {Object} description Description.
 * @apiSuccess  {String} status status.
 * @apiSuccess {Date} endTime End time of trip
 * @apiSuccess {UUID} commonId common Id of the trip.
 * @apiSuccess {String} milesDriven miles driven of the trip.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
    "message": "Success",
    "data": {
        "tripName": " Updated trip",
        "status": 2,    
        "updatedAt": "2018-02-27T11:03:40.144Z"
    }
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6
 *
 */
router.put('/:tenantId/trips/:id', function (req, res) {
    req.sanitize('tripName').trim();

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    req.checkParams('id', 'Id can not be empty').notEmpty();
    req.checkParams('id', 'Invalid id').isUUID();

    req.checkBody('status', 'Invalid status ').optional().isIn(constants.tripStatus);

    if (!empty(req.body.tripName)) {
        req.checkBody('tripName', 'Invalid tripName.').isLength(3, 2000);
    }

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.updateData(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});


//Delete Trip Api
/**
 * @api {delete} /:tenantId/trips/:commonId Delete Trip 
 * @apiVersion 1.0.0
 * @apiName DeleteTrip
 * @apiGroup Trips
 *
 * @apiDescription Delete Trip. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X DELETE  --data '{}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiError Unauthorized The token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalide request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "Bad Request"
 *     } 
 * 
 * @apiSuccess {String} message Message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6
 *
 */
router.delete('/:tenantId/trips/:id', function (req, res) {
    req.checkParams('id', 'Id can not be empty').notEmpty();
    req.checkParams('id', 'Invalid id').isUUID();

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.deleteData(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
});

//Get All Vehicle History Api
/**
 * @api {get} /:tenantId/vehicleHistory Get All vehicle history
 * @apiVersion 1.0.0
 * @apiName Get vehicle history
 * @apiGroup Trips
 *
 * @apiDescription Vehicle history  List. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X GET  -d "" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/vehicleHistory -H "Autherization:<access-token>" -H "Content-Type: application/json"
 *
 * @apiParam {Number} page[page=0] Page Number (optional).
 * @apiParam {Number} limit[limit=0] List limit(optional).
 * @apiParam {String} sort[sort=createdAt]  Sorting on which field(optional).
 * @apiParam {String} order[order=asc] Sorting field order(asc|desc)(optional).
 * @apiParam {UUID} commonId  coomonId of the trip,which is a TripId in vehicle history data(optional).
 * @apiParam {UUID} vehicleId  Vehicle involved in trip(Mandatory)
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalide request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "BadRequest"
 *     }
 * @apiSuccess {UUID} vehicleId Vehicle involved in trip.
 * @apiSuccess {Object} data Vehicle history data.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
{
    "message": "Success",
    "count": 280,
    "data": [
        {
            "_id": "d0e35c09-1aac-43d2-a33f-fe4a4c907a8d",
            "vehicleId": "da57832a-6381-4139-8477-6de9b76c0330",
            "data": {
                "ID": 202,
                "rawPGNData": "",
                "isConnected": false,
                "VehicleSpeed": "NA",
                "VehicleIdentificationNumber": "NA",
                "VehicleId": "da57832a-6381-4139-8477-6de9b76c0330",
                "VIN": "NA",
                "UserId": "aecac19f-24d3-4b5d-bbbf-2d590b8d29a7",
                "UnitNo": "NA",
                "TripId": "a8ec83cc-6bad-404d-bdc0-be97c777e57a",
                "TransTemp": 118.4,
                "TotalNoOfPassiveRegenerationsRaw": -1,
                "TotalNoOfPassiveRegenerationsHex": "NA",
                "TotalNoOfPassiveRegenerations": -1,
                "TotalNoOfActiveRegenerationsRaw": -1,
                "TotalNoOfActiveRegenerationsHex": "NA",
                "TotalNoOfActiveRegenerations": -1,
                "TotalHours": -1,
                "TorqueMode": "NA",
                "TimingAdvance": "NA",
                "ThrottlePosition": "NA",
                "ThrottlePos": -1,
                "TenantId": "b8d0df44-0bf8-4019-91e8-bd192c121bb8",
                "TempPGNData": "",
                "Speed": 65.5037,
                "SleepMode": "NoSleep",
                "ShortTermFuelTrimBank2": "NA",
                "ShortTermFuelTrimBank1": "NA",
                "SerialNo": "NA",
                "SelectedGear": -1,
                "SecondaryFuelLevel": -1,
                "SCROutletNoxRaw": -1,
                "SCROutletNoxHex": "NA",
                "SCROutletNox": "NA",
                "SCRInletNoxRaw": -1,
                "SCRInletNoxHex": "NA",
                "SCRInletNox": "NA",
                "ResetOBD": "NA",
                "RPM": 3373,
                "PrimaryFuelLevel": 42,
                "PctTorque": -1,
                "PctLoad": 52,
                "ParkBrakeSwitch": "Off",
                "ParameterDateTime": "2018-03-23T18:05:42",
                "PGNRawValue": "NA",
                "PGNParameterName": "NA",
                "PGNHexValue": "NA",
                "PGNActualValue": "NA",
                "PGN": -1,
                "OilTemp": -1,
                "OilPressure": 60.9158,
                "Odometer": -1,
                "Model": "NA",
                "MaxSpeed": -1,
                "Make": "NA",
                "Longitude": "73.7931653",
                "LongTermFuelTrimBank2": "NA",
                "LongTermFuelTrimBank1": "NA",
                "LoResOdometer": -1,
                "LoResDistance": 1304.88,
                "LineFeedOff": "NA",
                "LedBrightness": 0,
                "Latitude": "18.5566276",
                "IsKeyOn": false,
                "IntakeTemp": 111.2,
                "IntakePressure": 30.4579,
                "IntakeMainfoldPressure": "NA",
                "InstFuelEcon": 47.2451,
                "IdleHours": -1,
                "IdleFuelUsed": -1,
                "HiResOdometer": -1,
                "HiResMaxSpeed": -1,
                "HiResFuelUsed": -1,
                "HiResDistance": -1,
                "HardwareVersion": "3.1",
                "HardwareType": "HW_9_Pin",
                "FuelUsed": -1,
                "FuelType": "NA",
                "FuelTempRaw": -1,
                "FuelTempHex": "NA",
                "FuelTemp": -1,
                "FuelRation": "NA",
                "FuelRate": 31.4893,
                "FuelLevel": "NA",
                "FuelConsumptionRate": "NA",
                "FirmwareVersion": "3.16",
                "FaultSource": "0",
                "FaultSPN": "110",
                "FaultOccurrence": "1",
                "FaultFMI": "0",
                "FaultConversion": "true",
                "FanStateRaw": -1,
                "FanStateHex": "NA",
                "FanState": "NA",
                "EngineVIN": "",
                "EngineUnitNo": "NA",
                "EngineTurbochargerSpeedRaw": -1,
                "EngineTurbochargerSpeedHex": "NA",
                "EngineTurbochargerSpeed": -1,
                "EngineSerialNo": "NA",
                "EngineModel": "NA",
                "EngineMake": "NA",
                "EngineLoad": "NA",
                "EngineIntakeManifoldTempRaw": -1,
                "EngineIntakeManifoldTempHex": "NA",
                "EngineIntakeManifoldTemp": -1,
                "EngineIntakeManifoldPressureRaw": -1,
                "EngineIntakeManifoldPressureHex": "NA",
                "EngineIntakeManifoldPressure": -1,
                "EngineCrankcasePressureRaw": -1,
                "EngineCrankcasePressureHex": "NA",
                "EngineCrankcasePressure": -1,
                "EngineCoolantTemperature": "NA",
                "EchoOff": "NA",
                "DrvPctTorque": -1,
                "DistanceTraveledWithMILOn": "NA",
                "Distance": 1304.88,
                "DiagonosticTroubleCodes": "NA",
                "DPFSootLoadRaw": -1,
                "DPFSootLoadHex": "NA",
                "DPFSootLoad": "NA",
                "DPFPressureDifferentialRaw": -1,
                "DPFPressureDifferentialHex": "NA",
                "DPFPressureDifferential": -1,
                "DPFOutletTempRaw": -1,
                "DPFOutletTempHex": "NA",
                "DPFOutletTemp": -1,
                "DPFInletTempRaw": -1,
                "DPFInletTempHex": "NA",
                "DPFInletTemp": -1,
                "DPFAshLoadRaw": -1,
                "DPFAshLoadHex": "NA",
                "DPFAshLoad": "NA",
                "CurrentGear": -1,
                "CruiseState": "NA",
                "CruiseSetSpeed": -1,
                "CruiseSet": "NA",
                "CruiseResume": "NA",
                "CruiseOnOff": "NA",
                "CruiseCoast": "NA",
                "CruiseActive": "On",
                "CruiseAccel": "NA",
                "CoolantTemp": 149,
                "CoolantPressure": -1,
                "CoolantLevel": -1,
                "CommandEquivalanceRatio": "NA",
                "ClutchSwitch": "NA",
                "BrakeSwitch": "NA",
                "BrakeAppPressure": -1,
                "Brake2AirPressure": -1,
                "Brake1AirPressure": -1,
                "BatteryPotential": 15.75,
                "BarometricPressureRaw": -1,
                "BarometricPressureHex": "NA",
                "BarometricPressure": -1,
                "AvgFuelEcon": -1,
                "AmbientTempRaw": -1,
                "AmbientTempHex": "NA",
                "AmbientTemp": -1,
                "AirIntakeTemperature": "NA",
                "AdapterSerialNo": "97717407",
                "AdapterId": "00:A0:50:03:10:06",
                "AccelPedal": 42
            },
            "__v": 0
            "createdAt": "2018-03-23T12:35:43.396Z",
            "isDeleted": false
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/vehicleHistory
 *
 */
router.get('/:tenantId/vehicleHistory', function (req, res) {
    req.sanitizeBody('limit').trim();
    req.sanitizeBody('page').trim();
    req.sanitizeBody('sort').trim();
    req.sanitizeBody('order').trim();

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    if (!empty(req.query.limit)) {
        req.checkQuery('limit', 'Invalid limit parameter').optional().isInt();
    }
    if (!empty(req.query.page)) {
        req.checkQuery('page', 'Invalid page parameter').optional().isInt();
    }
    if (!empty(req.query.sort)) {
        req.checkQuery('sort', 'Invalid sort parameter').optional().isIn(constants.tripSortFields);
    }
    if (!empty(req.query.order)) {
        req.checkQuery('order', 'Invalid order parameter').optional().isIn(constants.order);
    }
    if (!empty(req.query.commonId)) {
        req.checkQuery('commonId', 'Invalid commonId').isUUID();
    }

    req.checkQuery('vehicleId', 'vehicleId can not be empty').notEmpty();
    req.checkQuery('vehicleId', 'Invalid vehicleId').isUUID();


    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.getAllVehicleHistory(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});



//Get All Driver Score Api
/**
 * @api {get} /:tenantId/driver Get Driver Behaviour Details List
 * @apiVersion 1.0.0
 * @apiName Get DriverList
 * @apiGroup Trips
 *
 * @apiDescription Driver List. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X GET  -d "" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips -H "Autherization:<access-token>" -H "Content-Type: application/json"
 *
 * @apiParam {Number} page[page=0] Page Number (optional).
 * @apiParam {Number} limit[limit=0] List limit(optional).
 * @apiParam {String} sort[sort=createdAt]  Sorting on which field(optional).
 * @apiParam {String} order[order=asc] Sorting field order(asc|desc)(optional).
 * @apiParam {UUID} userId  Driver's Id.
 
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalide request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "message": "BadRequest"
 *     }
 * @apiSuccess {UUID} tripId Trip's Id.
 * @apiSuccess {UUID} userId User's Id.
 * @apiSuccess {Number}  overSpeeding Speed Exceed Count
 * @apiSuccess {Number} hardBraking  Hard Braking Count.
 * @apiSuccess {Number} aggresiveAccelerator  Aggressive Accelerator Count.
 * @apiSuccess {Number} vehicleStops  Vehicle stops.
 * @apiSuccess {Number} driverScore  Driver Score.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
    "message": "Success",
    "count": 5,
    "data": [
        {
            "_id": "92854a88-ca0d-4626-ba4d-ec41515da1d7",
            "tripId": "da57832a-6381-4139-8477-6de9b76c0338",
            "userId": "47e76a6c-6efe-4569-b525-1c4dc0508c2f",
            "driverBehaviour": {
                "overSpeeding": 1,
                "hardBraking": 0,
                "aggressiveAccelerator": 1,
                "vehicleStops": 0,
                "driverScore": 66
            }
        },
        {
            "_id": "a1ac5bf1-5ebf-47c8-9bdb-7cde57ee34a1",
            "tripId": "da57832a-6381-4139-8477-6de9b76c0337",
            "userId": "47e76a6c-6efe-4569-b525-1c4dc0508c2f",
            "driverBehaviour": {
                "overSpeeding": 2,
                "hardBraking": 0,
                "aggressiveAccelerator": 2,
                "vehicleStops": 1,
                "driverScore": 66
            }
        },
        {
            "_id": "c4af7686-f35d-49dd-a0f8-62ebb4ec49fa",
            "tripId": "da57832a-6381-4139-8477-6de9b76c0336",
            "userId": "47e76a6c-6efe-4569-b525-1c4dc0508c2f",
            "driverBehaviour": {
                "overSpeeding": 2,
                "hardBraking": 0,
                "aggressiveAccelerator": 2,
                "vehicleStops": 3,
                "driverScore": 66
            }
        },
        {
            "_id": "c1f5c588-675b-47d7-b359-0cf1236a6c39",
            "tripId": "da57832a-6381-4139-8477-6de9b76c0334",
            "userId": "47e76a6c-6efe-4569-b525-1c4dc0508c2f",
            "driverBehaviour": {
                "overSpeeding": 2,
                "hardBraking": 0,
                "aggressiveAccelerator": 2,
                "vehicleStops": 0,
                "driverScore": 66
            }
        },
        {
            "_id": "7d25cfb1-4222-4f88-9986-f05df24700d3",
            "tripId": "da57832a-6381-4139-8477-6de9b76c0333",
            "userId": "47e76a6c-6efe-4569-b525-1c4dc0508c2f",
            "driverBehaviour": {
                "overSpeeding": 0,
                "hardBraking": 0,
                "aggressiveAccelerator": 9,
                "vehicleStops": 0,
                "driverScore": 79
            }
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/driver
 *
 */
router.get('/:tenantId/driver', function (req, res) {
    req.sanitizeBody('limit').trim();
    req.sanitizeBody('page').trim();
    req.sanitizeBody('sort').trim();
    req.sanitizeBody('order').trim();

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    if (!empty(req.query.limit)) {
        req.checkQuery('limit', 'Invalid limit parameter').optional().isInt();
    }
    if (!empty(req.query.page)) {
        req.checkQuery('page', 'Invalid page parameter').optional().isInt();
    }
    if (!empty(req.query.sort)) {
        req.checkQuery('sort', 'Invalid sort parameter').optional().isIn(constants.tripSortFields);
    }
    if (!empty(req.query.order)) {
        req.checkQuery('order', 'Invalid order parameter').optional().isIn(constants.order);
    }
    if (!empty(req.query.userId)) {
        req.checkQuery('userId', 'Invalid userId').optional().isUUID();
    }

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.getAllDriverScore(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

        });
    }
});


/**
 * @api {get}  /:tenantId/reports Get Report Details
 * @apiVersion 1.0.0
 * @apiName Report detials
 * @apiGroup Trips 
 
 * @apiDescription Get Report Details 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X GET  --data '{"latitude": 18.6603,longitude: 73.5232,vehicleId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/reports
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiParam {Date} startDate  startDate
 * @apiParam {Number} no_of_days  No of days
 * @apiParam {UUID} vehicleId Vehicle Id
 

 * @apiParamExample {json} Request-Example:
 *    	{
 *	    "startDate": 2018-04-24T00:00:00.00Z,
        "no_of_days": 2,
        "vehicleId": "69fbbb09-6418-4a09-bb4e-bc032c3be65f"
 *       }
 *
 *
 * @apiError Unauthorized The  token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "message": "Unauthorized."
 *     }
 *
 * @apiError InternalServerError The Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "message": "InternalServerError"
 *     }
 *
 * @apiError BadRequest Invalid request parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 BadRequest
 *     {
 *        "message": "Bad Request"
 *     }
 * 
 
*  @apiSuccess {boolean} isInside Result of the Test Location
 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
{
    "message": "Success",
    "data": [
     {
            "speedAvg": "37441.67",
            "rpmAvg": "337.50",
            "maxDistance": 150000,
            "airIntakePressureAvg": "1230.00",
            "airIntakeTempratureAvg": "11000.00",
            "vehicleId": "69fbbb09-6418-4a09-bb4e-bc032c3be65f",
            "createdAt": "2018-04-24T00:00:00.000Z"
        },
     
        {
            "speedAvg": 0,
            "rpmAvg": 0,
            "maxDistance": 0,
            "airIntakePressureAvg": 0,
            "airIntakeTempratureAvg": 0,
            "vehicleId": "69fbbb09-6418-4a09-bb4e-bc032c3be65f",
            "createdAt": "2018-04-25T00:00:00.000Z"
        },
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/5441f8ef-3255-477b-8b74-49d271a27fea/reports
 *
 */
router.get('/:tenantId/reports', function (req, res) {

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    req.checkQuery('startDate', 'startDate can not be null').notEmpty();
    req.checkQuery('no_of_days', 'no_of_days can not be null').notEmpty();
    req.checkQuery('vehicleId', 'VehicleId can not be null').notEmpty();
    req.checkQuery('vehicleId', 'Invalid vehicleId ').isUUID();


    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            service.getReportData(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
});


module.exports = router;
