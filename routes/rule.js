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
var rule_service = require('../src/service/rule-service');
var responseConstant = require("../src/constant/responseConstant");
var constants = require("../src/constant/constants");
var util = require('../src/util/commonUtil');
var empty = require('is-empty');
var auth = require('../src/config/authentication');




//Set Region
/**
 * @api {post}  /:tenantId/geofence Set Geofence
 * @apiVersion 1.0.0
 * @apiName Set Geofence
 * @apiGroup Rules 
  
 * @apiDescription <br/><b>Geofencing Push Notification.</b> 
 * <br/>
 * <br/>1.Set up geofence API.
 * <br/>2.Connect socket-client to http://trip-service.azurewebsites.net/ and use userId as topic to listen on socket.
 * 
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X POST  --data '{"geofenceList":[{"latitude":18.51672,"longitude":73.856255,"radius":100,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0330"},{"lat":19.51672,"long":76.856255,"radius":150,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0331"}],"userId":"80201e76-3360-48d3-9804-e5e6a6a4edcb"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiParam {Object[]} geofenceList List the geofencing information(Latitude,Longitude,Radius and VehicleId).
 * @apiParam {UUID} userId userId is the unique id of user in application, use that userId to receive push notification.

 * @apiParamExample {json} Request-Example:
 {

	"geofenceList":[{"latitude":18.51672,"longitude":73.856255,"radius":100,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0330"},{"latitude":19.51672,"longitude":76.856255,"radius":150,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0331"}]
    "userId":"b8d0df44-0bf8-4019-91e8-bd192c121bb8",
}
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
 
 * @apiSuccess {Double} latitude Latitude of the center Location
 * @apiSuccess {Double} longitude  Longitude of the center Location
 * @apiSuccess {Double} radius Radius distance in meters.
 * @apiSuccess {UUID} vehicleId Vehicle Id.
 * @apiSuccess {UUID} userId User Id.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
{
    "message": "Success",
    "data": [
        {
            "__v": 0,
            "ruleName": "Rule1",
            "ruleType": "Location",
            "latitude": 18.51672,
            "longitude": 73.856255,
            "radius": 100,
            "vehicleId": "351b5b70-2941-4eb7-8294-01b4d6a70a0f1",
            "userId": "b8d0df44-0bf8-4019-91e8-bd192c121bb8",
            "createdAt": "2018-04-02T09:48:18.555Z",
            "isDeleted": false,
            "_id": "252768fb-d1ed-4169-bb48-05fbc264997c"
        },
        {
            "__v": 0,
            "ruleName": "Rule1",
            "ruleType": "Location",
            "latitude": 19.51672,
            "longitude": 76.856255,
            "radius": 150,
            "vehicleId": "351b5b70-2941-4eb7-8294-01b4d6a70a0f2",
            "userId": "b8d0df44-0bf8-4019-91e8-bd192c121bb8",
            "createdAt": "2018-04-02T09:48:18.555Z",
            "isDeleted": false,
            "_id": "fac2b4e6-0b1d-4aef-9bb1-7dfffd2825cd"
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence
 *
 */
router.post('/:tenantId/geofence', function (req, res) {

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    req.checkBody('geofenceList', 'geofence can not be null').notEmpty();

    req.checkBody('userId', 'UserId can not be null').notEmpty();
    req.checkBody('userId', 'Invalid userId ').isUUID();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            rule_service.insertGeofenceData(req).then(function (result) {
                res.status(HttpStatus.CREATED).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
});

//Check Geofence
/**
 * @api {get}  /:tenantId/geofence To Check Geofence 
 * @apiVersion 1.0.0
 * @apiName Check Geofence
 * @apiGroup Rules 
 
 * @apiDescription Check if location fall within a given region. 
 *
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X GET  --data '{"latitude": 18.6603,longitude: 73.5232,vehicleId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiParam {Double} latitude  Latitude of the test Location
 * @apiParam {Double} longitude   Longitude of the test Location
 * @apiParam {vehicleId} vehicleId Vehicle Id

 * @apiParamExample {json} Request-Example:
 *    	{
 *	    "latitude": "18.6603",
        "longitude": "73.5232",
        "vehicleId": "bc313a62-fdf9-4e66-8c22-a84c91f60aa4"
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
    "data": {
        "isInside": true
    }
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence
 *
 */
router.get('/:tenantId/geofence', function (req, res) {

    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    req.checkQuery('latitude', 'Latitude can not be null').notEmpty();
    req.checkQuery('longitude', 'Longitude can not be null').notEmpty();
    req.checkQuery('vehicleId', 'VehicleId can not be null').notEmpty();
    req.checkQuery('vehicleId', 'Invalid vehicleId ').isUUID();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            rule_service.testLocation(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
});



//Set Speedings
/**
 * @api {post}  /:tenantId/speedings Set Speedings
 * @apiVersion 1.0.0
 * @apiNameSet Speedings
 * @apiGroup Rules 
  
 * @apiDescription <br/><b>Speedings Push Notification.</b> 
 * <br/>
 * <br/>1.Set up speedings API.
 * <br/>2.Connect socket-client to http://trip-service.azurewebsites.net/ and use userId as topic to listen on socket.
 * 
 * @apiHeader {String} Authorization authorization token.
 *
 * @apiExample Example usage:
 * curl -i -X POST  --data '{userId":"bc313a62-fdf9-4e66-8c22-a84c91f60aa4","speedingList":[{"speedLimit":80.15,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0330"}]}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence
 * -H "Authorization:<access-token>" -H "Content-Type: application/json" 
 *
 * @apiParam {Object[]} SpeedingList List the Speeding information(speedLimt and vehcileId).
 * @apiParam {UUID} userId userId is the unique id of user in application, use that userId to receive push notification.

 * @apiParamExample {json} Request-Example:
 {

	"speedingList":[{"speedLimit":80.15,"vehicleId":"da57832a-6381-4139-8477-6de9b76c0330"}],
    "userId":"b8d0df44-0bf8-4019-91e8-bd192c121bb8",
}
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
 
 * @apiSuccess {Double} speedLimit SpeedLimit of the vehicle.
 * @apiSuccess {UUID} vehicleId Vehicle Id.
 * @apiSuccess {UUID} userId User Id.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
{
    "message": "Success",
    "data": [
        {
            "__v": 0,
            "ruleName": "Rule1",
            "ruleType": "Speed",
            "speedLimit": 80.15,
            "vehicleId": "da57832a-6381-4139-8477-6de9b76c0330",
            "userId": "3f5bc4d7-008a-453c-813d-f27a9cc55194",
            "createdAt": "2018-04-02T10:04:27.444Z",
            "isDeleted": false,
            "_id": "0bbaae71-4380-42a4-ba27-fb5f2c9f0350"
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/speedings
 *
 */
router.post('/:tenantId/speedings', function (req, res) {
    req.checkParams('tenantId', 'TenantId can not be null').notEmpty();
    req.checkParams('tenantId', 'Invalid TenantId ').isUUID();

    req.checkBody('speedingList', 'speedingList can not be null').notEmpty();

    req.checkBody('userId', 'UserId can not be null').notEmpty();
    req.checkBody('userId', 'Invalid userId ').isUUID();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            rule_service.insertSpeedingsData(req).then(function (result) {
                res.status(HttpStatus.CREATED).send(result);

            }, function (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);

            });
        }, function (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
});

//Get All Rules Details
/**
 * @api {get} /:tenantId/rules Get All Rule  List
 * @apiVersion 1.0.0
 * @apiName GetRuleList
 * @apiGroup Rules
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
 * @apiParam {String} ruleType RuleType (Speed|Location)(optional).
 * @apiParam {String} vehicleId  Vehicle involved in trip(optional).
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
 * 
 * 
 *  
 * @apiSuccess {String} ruleName Rule Name. 
 * @apiSuccess {String} ruleType Rule Type.
 * @apiSuccess {Double} speedLimit SpeedLimit of the vehicle.
 * @apiSuccess {Double} latitude Latitude of the center Location
 * @apiSuccess {Double} longitude  Longitude of the center Location
 * @apiSuccess {Double} radius Radius distance in meters.
 * @apiSuccess {UUID} vehicleId Vehicle Id.
 * @apiSuccess {UUID} userId User Id.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
{
    "message": "Success",
    "count": 8,
    "data": [
        {
            "_id": "62b5b92c-a92a-4fba-89d7-9f0e20595a43",
            "__v": 0,
            "ruleName": "Rule1",
            "ruleType": "Speed",
            "speedLimit": 100,
            "vehicleId": "da57832a-6381-4139-8477-6de9b76c03301",
            "userId": "3f5bc4d7-008a-453c-813d-f27a9cc55194",
            "createdAt": "2018-04-10T13:31:55.263Z",
            "isDeleted": false
        },
        {
            "_id": "0fa20216-7c46-4d14-ba0c-6e34434871aa",
            "__v": 0,
            "ruleName": "Rule2",
            "ruleType": "Location",
            "latitude": 19.51672,
            "longitude": 76.856255,
            "radius": 150,
            "vehicleId": "da57832a-6381-4139-8477-6de9b76c0331",
            "userId": "3f5bc4d7-008a-453c-813d-f27a9cc55194",
            "createdAt": "2018-04-10T13:30:56.398Z",
            "isDeleted": false
        }
    ]
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules
 *
 */
router.get('/:tenantId/rules', function (req, res) {
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
    if (!empty(req.query.ruleType)) {
        req.checkQuery('ruleType', 'Invalid ruleType').optional().isIn(constants.ruleTypes);
    }

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            rule_service.getAllRuleData(req).then(function (result) {
                res.status(HttpStatus.OK).send(result);

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
 * @api {get} /:tenantId/rules/:id Get Rule's Details
 * @apiVersion 1.0.0
 * @apiName Get Rule's Details
 * @apiGroup Rules
 *
 * @apiDescription Get Rule's Details. 
 *
 * @apiExample Example usage:
 * curl -i -X GET  -d "" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules/5cbd29f9-8db8-45d1-b4ed-d69b7185dafd -H "Autherization:<access-token>" -H "Content-Type: application/json"
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
 * @apiSuccess {String} ruleName Rule Name. 
 * @apiSuccess {String} ruleType Rule Type.
 * @apiSuccess {Double} speedLimit SpeedLimit of the vehicle.
 * @apiSuccess {Double} latitude Latitude of the center Location
 * @apiSuccess {Double} longitude  Longitude of the center Location
 * @apiSuccess {Double} radius Radius distance in meters.
 * @apiSuccess {UUID} vehicleId Vehicle Id.
 * @apiSuccess {UUID} userId User Id.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
    "message": "Success",
    "data": {
        "_id": "9bf80eec-e1b2-46c8-b874-7256d82d970a",
        "__v": 0,
        "ruleName": "Rule1",
        "ruleType": "Location",
        "latitude": 19.51672,
        "longitude": 76.856255,
        "radius": 150,
        "vehicleId": "da57832a-6381-4139-8477-6de9b76c0331",
        "userId": "3f5bc4d7-008a-453c-813d-f27a9cc55194",
        "createdAt": "2018-04-17T06:21:31.045Z",
        "isDeleted": false
    }
}
 *
 * @apiSampleRequest http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules/1840f0d0-b505-435a-97d4-a00dfe2c1932
 *
 */
router.get('/:tenantId/rules/:id', function (req, res) {
    req.checkParams('tenantId', 'tenantId can not be empty').notEmpty();
    req.checkParams('tenantId', 'Invalid tenantId').isUUID();

    req.checkParams('id', 'RuleId can not be empty').notEmpty();
    req.checkParams('id', 'Invalid RuleId').isUUID();
    var errors = req.validationErrors(true);
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).send(util.responseUtil(errors, null, responseConstant.INVALID_REQUEST_PARAMETERS));
    } else {
        auth.isTenantIDValid(req, req.params.tenantId).then(function (result) {
            rule_service.getRuleDetails(req).then(function (result) {
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