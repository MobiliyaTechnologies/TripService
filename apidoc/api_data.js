define({ "api": [
  {
    "type": "get",
    "url": "/:tenantId/geofence",
    "title": "To Check Geofence",
    "version": "1.0.0",
    "name": "Check_Geofence",
    "group": "Rules",
    "description": "<p>Check if location fall within a given region.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  --data '{\"latitude\": 18.6603,longitude: 73.5232,vehicleId\":\"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude of the test Location</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude of the test Location</p>"
          },
          {
            "group": "Parameter",
            "type": "vehicleId",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "   \t{\n\t    \"latitude\": \"18.6603\",\n        \"longitude\": \"73.5232\",\n        \"vehicleId\": \"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\"\n      }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BadRequest\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "isInside",
            "description": "<p>Result of the Test Location</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"data\": {\n        \"isInside\": true\n    }\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence"
      }
    ],
    "filename": "routes/rule.js",
    "groupTitle": "Rules"
  },
  {
    "type": "get",
    "url": "/:tenantId/rules",
    "title": "Get All Rule  List",
    "version": "1.0.0",
    "name": "GetRuleList",
    "group": "Rules",
    "description": "<p>Trip List.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>[page=0] Page Number (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>[limit=0] List limit(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>[sort=createdAt]  Sorting on which field(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>[order=asc] Sorting field order(asc|desc)(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ruleType",
            "description": "<p>RuleType (Speed|Location)(optional).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"BadRequest\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ruleName",
            "description": "<p>Rule Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ruleType",
            "description": "<p>Rule Type.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "speedLimit",
            "description": "<p>SpeedLimit of the vehicle.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "radius",
            "description": "<p>Radius distance in yards.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"count\": 8,\n    \"data\": [\n        {\n            \"_id\": \"62b5b92c-a92a-4fba-89d7-9f0e20595a43\",\n            \"__v\": 0,\n            \"ruleName\": \"Rule1\",\n            \"ruleType\": \"Speed\",\n            \"speedLimit\": 100,\n            \"vehicleId\": \"da57832a-6381-4139-8477-6de9b76c03301\",\n            \"userId\": \"3f5bc4d7-008a-453c-813d-f27a9cc55194\",\n            \"createdAt\": \"2018-04-10T13:31:55.263Z\",\n            \"isDeleted\": false\n        },\n        {\n            \"_id\": \"0fa20216-7c46-4d14-ba0c-6e34434871aa\",\n            \"__v\": 0,\n            \"ruleName\": \"Rule2\",\n            \"ruleType\": \"Location\",\n            \"latitude\": 19.51672,\n            \"longitude\": 76.856255,\n            \"radius\": 150,\n            \"vehicleId\": \"da57832a-6381-4139-8477-6de9b76c0331\",\n            \"userId\": \"3f5bc4d7-008a-453c-813d-f27a9cc55194\",\n            \"createdAt\": \"2018-04-10T13:30:56.398Z\",\n            \"isDeleted\": false\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules"
      }
    ],
    "filename": "routes/rule.js",
    "groupTitle": "Rules"
  },
  {
    "type": "get",
    "url": "/:tenantId/rules/:id",
    "title": "Get Rule's Details",
    "version": "1.0.0",
    "name": "Get_Rule_s_Details",
    "group": "Rules",
    "description": "<p>Get Rule's Details.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules/5cbd29f9-8db8-45d1-b4ed-d69b7185dafd -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request data.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (400 example):",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Bad Request\"\n    \"error\": {\n          \"id\": {\n              \"location\": \"params\",\n              \"param\": \"id\",\n              \"msg\": \"Invalid\"\n          }\n      }\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ruleName",
            "description": "<p>Rule Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ruleType",
            "description": "<p>Rule Type.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "speedLimit",
            "description": "<p>SpeedLimit of the vehicle.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "radius",
            "description": "<p>Radius distance in yards.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n {\n    \"message\": \"Success\",\n    \"data\": {\n        \"_id\": \"9bf80eec-e1b2-46c8-b874-7256d82d970a\",\n        \"__v\": 0,\n        \"ruleName\": \"Rule1\",\n        \"ruleType\": \"Location\",\n        \"latitude\": 19.51672,\n        \"longitude\": 76.856255,\n        \"radius\": 150,\n        \"vehicleId\": \"da57832a-6381-4139-8477-6de9b76c0331\",\n        \"userId\": \"3f5bc4d7-008a-453c-813d-f27a9cc55194\",\n        \"createdAt\": \"2018-04-17T06:21:31.045Z\",\n        \"isDeleted\": false\n    }\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/rules/1840f0d0-b505-435a-97d4-a00dfe2c1932"
      }
    ],
    "filename": "routes/rule.js",
    "groupTitle": "Rules"
  },
  {
    "type": "post",
    "url": "/:tenantId/speedings",
    "title": "Set Speedings",
    "version": "1.0.0",
    "group": "Rules",
    "description": "<p><br/><b>Speedings Push Notification.</b> <br/> <br/>1.Set up speedings API. <br/>2.Connect socket-client to http://trip-service.azurewebsites.net/ and use userId as topic to listen on socket.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST  --data '{userId\":\"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\",\"speedingList\":[{\"speedLimit\":80.15,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0330\"}]}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "SpeedingList",
            "description": "<p>List the Speeding information(speedLimt and vehcileId).</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>userId is the unique id of user in application, use that userId to receive push notification.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": " {\n\n\t\"speedingList\":[{\"speedLimit\":80.15,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0330\"}],\n    \"userId\":\"b8d0df44-0bf8-4019-91e8-bd192c121bb8\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BadRequest\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "speedLimit",
            "description": "<p>SpeedLimit of the vehicle.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"data\": [\n        {\n            \"__v\": 0,\n            \"ruleName\": \"Rule1\",\n            \"ruleType\": \"Speed\",\n            \"speedLimit\": 80.15,\n            \"vehicleId\": \"da57832a-6381-4139-8477-6de9b76c0330\",\n            \"userId\": \"3f5bc4d7-008a-453c-813d-f27a9cc55194\",\n            \"createdAt\": \"2018-04-02T10:04:27.444Z\",\n            \"isDeleted\": false,\n            \"_id\": \"0bbaae71-4380-42a4-ba27-fb5f2c9f0350\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/speedings"
      }
    ],
    "filename": "routes/rule.js",
    "groupTitle": "Rules",
    "name": "PostTenantidSpeedings"
  },
  {
    "type": "post",
    "url": "/:tenantId/geofence",
    "title": "Set Geofence",
    "version": "1.0.0",
    "name": "Set_Geofence",
    "group": "Rules",
    "description": "<p><br/><b>Geofencing Push Notification.</b> <br/> <br/>1.Set up geofence API. <br/>2.Connect socket-client to http://trip-service.azurewebsites.net/ and use userId as topic to listen on socket.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST  --data '{\"geofenceList\":[{\"latitude\":18.51672,\"longitude\":73.856255,\"radius\":100,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0330\"},{\"lat\":19.51672,\"long\":76.856255,\"radius\":150,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0331\"}],\"userId\":\"80201e76-3360-48d3-9804-e5e6a6a4edcb\"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "geofenceList",
            "description": "<p>List the geofencing information(Latitude,Longitude,Radius and VehicleId).</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>userId is the unique id of user in application, use that userId to receive push notification.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": " {\n\n\t\"geofenceList\":[{\"latitude\":18.51672,\"longitude\":73.856255,\"radius\":100,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0330\"},{\"latitude\":19.51672,\"longitude\":76.856255,\"radius\":150,\"vehicleId\":\"da57832a-6381-4139-8477-6de9b76c0331\"}]\n    \"userId\":\"b8d0df44-0bf8-4019-91e8-bd192c121bb8\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BadRequest\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude of the center Location</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "radius",
            "description": "<p>Radius distance in yards.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"data\": [\n        {\n            \"__v\": 0,\n            \"ruleName\": \"Rule1\",\n            \"ruleType\": \"Location\",\n            \"latitude\": 18.51672,\n            \"longitude\": 73.856255,\n            \"radius\": 100,\n            \"vehicleId\": \"351b5b70-2941-4eb7-8294-01b4d6a70a0f1\",\n            \"userId\": \"b8d0df44-0bf8-4019-91e8-bd192c121bb8\",\n            \"createdAt\": \"2018-04-02T09:48:18.555Z\",\n            \"isDeleted\": false,\n            \"_id\": \"252768fb-d1ed-4169-bb48-05fbc264997c\"\n        },\n        {\n            \"__v\": 0,\n            \"ruleName\": \"Rule1\",\n            \"ruleType\": \"Location\",\n            \"latitude\": 19.51672,\n            \"longitude\": 76.856255,\n            \"radius\": 150,\n            \"vehicleId\": \"351b5b70-2941-4eb7-8294-01b4d6a70a0f2\",\n            \"userId\": \"b8d0df44-0bf8-4019-91e8-bd192c121bb8\",\n            \"createdAt\": \"2018-04-02T09:48:18.555Z\",\n            \"isDeleted\": false,\n            \"_id\": \"fac2b4e6-0b1d-4aef-9bb1-7dfffd2825cd\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/geofence"
      }
    ],
    "filename": "routes/rule.js",
    "groupTitle": "Rules"
  },
  {
    "type": "post",
    "url": "/:tenantId/trips",
    "title": "Create Trip",
    "version": "1.0.0",
    "name": "CreateTrip",
    "group": "Trips",
    "description": "<p>Create Trip.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST  --data '{\"tripName\": \"trip1\",\"description\": \"Trip Monday, January 8, 11:06:35 AM\",\"startTime\":\"2018-01-08T05:36:35.000Z\",\"endTime\":\"2018-01-08T05:43:29.000Z\",\"startLocation\":\"18.5566425, 73.7930577\",\"endLocation\":\"18.5566425, 73.7930577\",\"vehicleId\":\"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tripName",
            "description": "<p>Name of Trip</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": "<p>Description of trip(optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>Start time of trip</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startLocation",
            "description": "<p>Start location of trip</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endLocation",
            "description": "<p>End location of trip</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of the trip.</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>common Id of the trip.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "stops",
            "description": "<p>stop count  of the trip.(optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "milesDriven",
            "description": "<p>miles driven of the trip.(optional)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "   \t{\n\t    \"tripName\": \"trip1\",\n        \"startTime\": \"2018-01-08T05:36:35.000Z\",\n        \"endTime\": \"2018-01-08T05:43:29.000Z\",\n        \"startLocation\": \"18.5566425, 73.7930577\",\n        \"endLocation\": \"18.5566425, 73.7930577\",\n        \"vehicleId\": \"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\",\n        \"description\": \"Trip Monday, January 8, 11:06:35 AM\",\n        \"commonId\": \"da57832a-6381-4139-8477-6de9b76c0330\",        \n        \"status\":  1\n      }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BadRequest\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tripName",
            "description": "<p>Name of Trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": "<p>Description of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>Start time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "startLocation",
            "description": "<p>Start location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "endLocation",
            "description": "<p>End location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of the trip.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>common Id of the trip.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "stops",
            "description": "<p>stop count of the trip.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "milesDriven",
            "description": "<p>miles driven of the trip.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n   {\n    \"message\": \"Success\",\n    \"data\": {\n        \"__v\": 0,\n        \"tripName\": \"trip1\",\n        \"startTime\": \"2018-01-08T05:36:35.000Z\",\n        \"endTime\": \"2018-01-08T05:43:29.000Z\",\n        \"startLocation\": \"18.5566425, 73.7930577\",\n        \"endLocation\": \"18.5566425, 73.7930577\",\n        \"vehicleId\": \"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\",\n        \"description\": \"Trip Monday, January 8, 11:06:35 AM\",\n        \"status\": 1,\n        \"createdAt\": \"2018-03-06T05:57:06.079Z\",\n        \"isDeleted\": false,\n        \"commonId\": \"da57832a-6381-4139-8477-6de9b76c0330\",      \n        \"_id\": \"6d3a5cd4-6a0b-4828-b71d-f43100d68bb3\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "delete",
    "url": "/:tenantId/trips/:commonId",
    "title": "Delete Trip",
    "version": "1.0.0",
    "name": "DeleteTrip",
    "group": "Trips",
    "description": "<p>Delete Trip.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X DELETE  --data '{}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "get",
    "url": "/:tenantId/trips",
    "title": "Get All Trip List",
    "version": "1.0.0",
    "name": "GetTripList",
    "group": "Trips",
    "description": "<p>Trip List.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>[page=0] Page Number (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>[limit=0] List limit(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>[sort=createdAt]  Sorting on which field(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>[order=asc] Sorting field order(asc|desc)(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>fleet Start location of trip(optional).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"BadRequest\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tripName",
            "description": "<p>Name of Trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": "<p>Description of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>Start time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "startLocation",
            "description": "<p>Start location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "endLocation",
            "description": "<p>End location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of the trip</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>common Id of the trip.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"count\": 1,\n    \"data\": [\n        {\n            \"_id\": \"5cbd29f9-8db8-45d1-b4ed-d69b7185dafd\",\n            \"tripName\": \"trip1\",\n            \"startTime\": \"2018-01-08T05:36:35.000Z\",\n            \"endTime\": \"2018-01-08T05:43:29.000Z\",\n            \"startLocation\": \"18.5566425, 73.7930577\",\n            \"endLocation\": \"18.5566425, 73.7930577\",\n            \"vehicleId\": \"2d0f2f7f-8dbe-4d47-840a-7c15eb4d60e7\",\n            \"commonId\": \"da57832a-6381-4139-8477-6de9b76c0330\",     \n            \"__v\": 0,\n            \"description\": \"Trip Monday, January 8, 11:06:35 AM\",\n            \"status\": 1,\n            \"createdAt\": \"2018-03-06T08:13:32.764Z\",\n            \"isDeleted\": false\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "get",
    "url": "/:tenantId/driver",
    "title": "Get Driver Behaviour Details List",
    "version": "1.0.0",
    "name": "Get_DriverList",
    "group": "Trips",
    "description": "<p>Driver List.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>[page=0] Page Number (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>[limit=0] List limit(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>[sort=createdAt]  Sorting on which field(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>[order=asc] Sorting field order(asc|desc)(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>Driver's Id.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"BadRequest\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "tripId",
            "description": "<p>Trip's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "userId",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "overSpeeding",
            "description": "<p>Speed Exceed Count</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "hardBraking",
            "description": "<p>Hard Braking Count.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "aggresiveAccelerator",
            "description": "<p>Aggressive Accelerator Count.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "vehicleStops",
            "description": "<p>Vehicle stops.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "driverScore",
            "description": "<p>Driver Score.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n {\n    \"message\": \"Success\",\n    \"count\": 5,\n    \"data\": [\n        {\n            \"_id\": \"92854a88-ca0d-4626-ba4d-ec41515da1d7\",\n            \"tripId\": \"da57832a-6381-4139-8477-6de9b76c0338\",\n            \"userId\": \"47e76a6c-6efe-4569-b525-1c4dc0508c2f\",\n            \"driverBehaviour\": {\n                \"overSpeeding\": 1,\n                \"hardBraking\": 0,\n                \"aggressiveAccelerator\": 1,\n                \"vehicleStops\": 0,\n                \"driverScore\": 66\n            }\n        },\n        {\n            \"_id\": \"a1ac5bf1-5ebf-47c8-9bdb-7cde57ee34a1\",\n            \"tripId\": \"da57832a-6381-4139-8477-6de9b76c0337\",\n            \"userId\": \"47e76a6c-6efe-4569-b525-1c4dc0508c2f\",\n            \"driverBehaviour\": {\n                \"overSpeeding\": 2,\n                \"hardBraking\": 0,\n                \"aggressiveAccelerator\": 2,\n                \"vehicleStops\": 1,\n                \"driverScore\": 66\n            }\n        },\n        {\n            \"_id\": \"c4af7686-f35d-49dd-a0f8-62ebb4ec49fa\",\n            \"tripId\": \"da57832a-6381-4139-8477-6de9b76c0336\",\n            \"userId\": \"47e76a6c-6efe-4569-b525-1c4dc0508c2f\",\n            \"driverBehaviour\": {\n                \"overSpeeding\": 2,\n                \"hardBraking\": 0,\n                \"aggressiveAccelerator\": 2,\n                \"vehicleStops\": 3,\n                \"driverScore\": 66\n            }\n        },\n        {\n            \"_id\": \"c1f5c588-675b-47d7-b359-0cf1236a6c39\",\n            \"tripId\": \"da57832a-6381-4139-8477-6de9b76c0334\",\n            \"userId\": \"47e76a6c-6efe-4569-b525-1c4dc0508c2f\",\n            \"driverBehaviour\": {\n                \"overSpeeding\": 2,\n                \"hardBraking\": 0,\n                \"aggressiveAccelerator\": 2,\n                \"vehicleStops\": 0,\n                \"driverScore\": 66\n            }\n        },\n        {\n            \"_id\": \"7d25cfb1-4222-4f88-9986-f05df24700d3\",\n            \"tripId\": \"da57832a-6381-4139-8477-6de9b76c0333\",\n            \"userId\": \"47e76a6c-6efe-4569-b525-1c4dc0508c2f\",\n            \"driverBehaviour\": {\n                \"overSpeeding\": 0,\n                \"hardBraking\": 0,\n                \"aggressiveAccelerator\": 9,\n                \"vehicleStops\": 0,\n                \"driverScore\": 79\n            }\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/driver"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "get",
    "url": "/:tenantId/trips/:commonId",
    "title": "Get Trip's Details",
    "version": "1.0.0",
    "name": "Get_Trip_s_Details",
    "group": "Trips",
    "description": "<p>Get Trip's Details.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/5cbd29f9-8db8-45d1-b4ed-d69b7185dafd -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request data.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (400 example):",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Bad Request\"\n    \"error\": {\n          \"id\": {\n              \"location\": \"params\",\n              \"param\": \"id\",\n              \"msg\": \"Invalid\"\n          }\n      }\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tripName",
            "description": "<p>Name of Trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": "<p>Description of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>Start time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "startLocation",
            "description": "<p>Start location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "endLocation",
            "description": "<p>End location of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of the trip</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>common Id of the trip.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"data\": {\n        \"_id\": \"1840f0d0-b505-435a-97d4-a00dfe2c1932\",\n        \"tripName\": \"trip1\",\n        \"startTime\": \"2018-01-08T05:36:35.000Z\",\n        \"endTime\": \"2018-01-08T05:43:29.000Z\",\n        \"startLocation\": \"18.5566425,18.5566425\",\n        \"endLocation\": \"73.666666, 73.7930577\",\n        \"vehicleId\": \"2c756802-d282-48fa-8c29-0b75f82fe673\",\n        \"commonId\": \"da57832a-6381-4139-8477-6de9b76c0330\",            \n        \"__v\": 0,\n        \"stops\": 0,\n        \"description\": \"Trip Monday, January 8, 11:06:35 AM\",\n        \"status\": 1,\n        \"createdAt\": \"2018-03-13T12:41:54.334Z\",\n        \"isDeleted\": false,\n        \"locationDetails\": [\n            {\n                \"latitude\": \"18.556671\",\n                \"longitude\": \"73.7931409\",\n                \"time\": \"2018-03-13T12:32:17.000Z\"\n            }\n        ],\n            \"milesDriven\": \"-1\",\n            \"fuelUsed\": \"-1\",\n            \"avgSpeed\": \"-1\",\n            \"topSpeed\": \"-1\",\n            \"mileage\": \"-1\",\n            \"speedings\": \"00\",\n            \"hardBraking\": \"00\",\n            \"engineFaults\": \"NA\",\n            \"accelerator\": \"NA\",\n            \"phoneUsage\": \"NA\",\n            \"tripTime\": \"0:06:54\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/1840f0d0-b505-435a-97d4-a00dfe2c1932"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "get",
    "url": "/:tenantId/vehicleHistory",
    "title": "Get All vehicle history",
    "version": "1.0.0",
    "name": "Get_vehicle_history",
    "group": "Trips",
    "description": "<p>Vehicle history  List.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  -d \"\" http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/vehicleHistory -H \"Autherization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>[page=0] Page Number (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>[limit=0] List limit(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>[sort=createdAt]  Sorting on which field(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>[order=asc] Sorting field order(asc|desc)(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>coomonId of the trip,which is a TripId in vehicle history data(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip(Mandatory)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"BadRequest\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle involved in trip.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Vehicle history data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"count\": 280,\n    \"data\": [\n        {\n            \"_id\": \"d0e35c09-1aac-43d2-a33f-fe4a4c907a8d\",\n            \"vehicleId\": \"da57832a-6381-4139-8477-6de9b76c0330\",\n            \"data\": {\n                \"ID\": 202,\n                \"rawPGNData\": \"\",\n                \"isConnected\": false,\n                \"VehicleSpeed\": \"NA\",\n                \"VehicleIdentificationNumber\": \"NA\",\n                \"VehicleId\": \"da57832a-6381-4139-8477-6de9b76c0330\",\n                \"VIN\": \"NA\",\n                \"UserId\": \"aecac19f-24d3-4b5d-bbbf-2d590b8d29a7\",\n                \"UnitNo\": \"NA\",\n                \"TripId\": \"a8ec83cc-6bad-404d-bdc0-be97c777e57a\",\n                \"TransTemp\": 118.4,\n                \"TotalNoOfPassiveRegenerationsRaw\": -1,\n                \"TotalNoOfPassiveRegenerationsHex\": \"NA\",\n                \"TotalNoOfPassiveRegenerations\": -1,\n                \"TotalNoOfActiveRegenerationsRaw\": -1,\n                \"TotalNoOfActiveRegenerationsHex\": \"NA\",\n                \"TotalNoOfActiveRegenerations\": -1,\n                \"TotalHours\": -1,\n                \"TorqueMode\": \"NA\",\n                \"TimingAdvance\": \"NA\",\n                \"ThrottlePosition\": \"NA\",\n                \"ThrottlePos\": -1,\n                \"TenantId\": \"b8d0df44-0bf8-4019-91e8-bd192c121bb8\",\n                \"TempPGNData\": \"\",\n                \"Speed\": 65.5037,\n                \"SleepMode\": \"NoSleep\",\n                \"ShortTermFuelTrimBank2\": \"NA\",\n                \"ShortTermFuelTrimBank1\": \"NA\",\n                \"SerialNo\": \"NA\",\n                \"SelectedGear\": -1,\n                \"SecondaryFuelLevel\": -1,\n                \"SCROutletNoxRaw\": -1,\n                \"SCROutletNoxHex\": \"NA\",\n                \"SCROutletNox\": \"NA\",\n                \"SCRInletNoxRaw\": -1,\n                \"SCRInletNoxHex\": \"NA\",\n                \"SCRInletNox\": \"NA\",\n                \"ResetOBD\": \"NA\",\n                \"RPM\": 3373,\n                \"PrimaryFuelLevel\": 42,\n                \"PctTorque\": -1,\n                \"PctLoad\": 52,\n                \"ParkBrakeSwitch\": \"Off\",\n                \"ParameterDateTime\": \"2018-03-23T18:05:42\",\n                \"PGNRawValue\": \"NA\",\n                \"PGNParameterName\": \"NA\",\n                \"PGNHexValue\": \"NA\",\n                \"PGNActualValue\": \"NA\",\n                \"PGN\": -1,\n                \"OilTemp\": -1,\n                \"OilPressure\": 60.9158,\n                \"Odometer\": -1,\n                \"Model\": \"NA\",\n                \"MaxSpeed\": -1,\n                \"Make\": \"NA\",\n                \"Longitude\": \"73.7931653\",\n                \"LongTermFuelTrimBank2\": \"NA\",\n                \"LongTermFuelTrimBank1\": \"NA\",\n                \"LoResOdometer\": -1,\n                \"LoResDistance\": 1304.88,\n                \"LineFeedOff\": \"NA\",\n                \"LedBrightness\": 0,\n                \"Latitude\": \"18.5566276\",\n                \"IsKeyOn\": false,\n                \"IntakeTemp\": 111.2,\n                \"IntakePressure\": 30.4579,\n                \"IntakeMainfoldPressure\": \"NA\",\n                \"InstFuelEcon\": 47.2451,\n                \"IdleHours\": -1,\n                \"IdleFuelUsed\": -1,\n                \"HiResOdometer\": -1,\n                \"HiResMaxSpeed\": -1,\n                \"HiResFuelUsed\": -1,\n                \"HiResDistance\": -1,\n                \"HardwareVersion\": \"3.1\",\n                \"HardwareType\": \"HW_9_Pin\",\n                \"FuelUsed\": -1,\n                \"FuelType\": \"NA\",\n                \"FuelTempRaw\": -1,\n                \"FuelTempHex\": \"NA\",\n                \"FuelTemp\": -1,\n                \"FuelRation\": \"NA\",\n                \"FuelRate\": 31.4893,\n                \"FuelLevel\": \"NA\",\n                \"FuelConsumptionRate\": \"NA\",\n                \"FirmwareVersion\": \"3.16\",\n                \"FaultSource\": \"0\",\n                \"FaultSPN\": \"110\",\n                \"FaultOccurrence\": \"1\",\n                \"FaultFMI\": \"0\",\n                \"FaultConversion\": \"true\",\n                \"FanStateRaw\": -1,\n                \"FanStateHex\": \"NA\",\n                \"FanState\": \"NA\",\n                \"EngineVIN\": \"\",\n                \"EngineUnitNo\": \"NA\",\n                \"EngineTurbochargerSpeedRaw\": -1,\n                \"EngineTurbochargerSpeedHex\": \"NA\",\n                \"EngineTurbochargerSpeed\": -1,\n                \"EngineSerialNo\": \"NA\",\n                \"EngineModel\": \"NA\",\n                \"EngineMake\": \"NA\",\n                \"EngineLoad\": \"NA\",\n                \"EngineIntakeManifoldTempRaw\": -1,\n                \"EngineIntakeManifoldTempHex\": \"NA\",\n                \"EngineIntakeManifoldTemp\": -1,\n                \"EngineIntakeManifoldPressureRaw\": -1,\n                \"EngineIntakeManifoldPressureHex\": \"NA\",\n                \"EngineIntakeManifoldPressure\": -1,\n                \"EngineCrankcasePressureRaw\": -1,\n                \"EngineCrankcasePressureHex\": \"NA\",\n                \"EngineCrankcasePressure\": -1,\n                \"EngineCoolantTemperature\": \"NA\",\n                \"EchoOff\": \"NA\",\n                \"DrvPctTorque\": -1,\n                \"DistanceTraveledWithMILOn\": \"NA\",\n                \"Distance\": 1304.88,\n                \"DiagonosticTroubleCodes\": \"NA\",\n                \"DPFSootLoadRaw\": -1,\n                \"DPFSootLoadHex\": \"NA\",\n                \"DPFSootLoad\": \"NA\",\n                \"DPFPressureDifferentialRaw\": -1,\n                \"DPFPressureDifferentialHex\": \"NA\",\n                \"DPFPressureDifferential\": -1,\n                \"DPFOutletTempRaw\": -1,\n                \"DPFOutletTempHex\": \"NA\",\n                \"DPFOutletTemp\": -1,\n                \"DPFInletTempRaw\": -1,\n                \"DPFInletTempHex\": \"NA\",\n                \"DPFInletTemp\": -1,\n                \"DPFAshLoadRaw\": -1,\n                \"DPFAshLoadHex\": \"NA\",\n                \"DPFAshLoad\": \"NA\",\n                \"CurrentGear\": -1,\n                \"CruiseState\": \"NA\",\n                \"CruiseSetSpeed\": -1,\n                \"CruiseSet\": \"NA\",\n                \"CruiseResume\": \"NA\",\n                \"CruiseOnOff\": \"NA\",\n                \"CruiseCoast\": \"NA\",\n                \"CruiseActive\": \"On\",\n                \"CruiseAccel\": \"NA\",\n                \"CoolantTemp\": 149,\n                \"CoolantPressure\": -1,\n                \"CoolantLevel\": -1,\n                \"CommandEquivalanceRatio\": \"NA\",\n                \"ClutchSwitch\": \"NA\",\n                \"BrakeSwitch\": \"NA\",\n                \"BrakeAppPressure\": -1,\n                \"Brake2AirPressure\": -1,\n                \"Brake1AirPressure\": -1,\n                \"BatteryPotential\": 15.75,\n                \"BarometricPressureRaw\": -1,\n                \"BarometricPressureHex\": \"NA\",\n                \"BarometricPressure\": -1,\n                \"AvgFuelEcon\": -1,\n                \"AmbientTempRaw\": -1,\n                \"AmbientTempHex\": \"NA\",\n                \"AmbientTemp\": -1,\n                \"AirIntakeTemperature\": \"NA\",\n                \"AdapterSerialNo\": \"97717407\",\n                \"AdapterId\": \"00:A0:50:03:10:06\",\n                \"AccelPedal\": 42\n            },\n            \"__v\": 0\n            \"createdAt\": \"2018-03-23T12:35:43.396Z\",\n            \"isDeleted\": false\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/vehicleHistory"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "get",
    "url": "/:tenantId/reports",
    "title": "Get Report Details",
    "version": "1.0.0",
    "name": "Report_detials",
    "group": "Trips",
    "description": "<p>Get Report Details</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X GET  --data '{\"latitude\": 18.6603,longitude: 73.5232,vehicleId\":\"bc313a62-fdf9-4e66-8c22-a84c91f60aa4\"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/reports\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>startDate</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "no_of_days",
            "description": "<p>No of days</p>"
          },
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "vehicleId",
            "description": "<p>Vehicle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "   \t{\n\t    \"startDate\": 2018-04-24T00:00:00.00Z,\n        \"no_of_days\": 2,\n        \"vehicleId\": \"69fbbb09-6418-4a09-bb4e-bc032c3be65f\"\n      }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BadRequest\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "isInside",
            "description": "<p>Result of the Test Location</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n    \"message\": \"Success\",\n    \"data\": [\n     {\n            \"speedAvg\": \"37441.67\",\n            \"rpmAvg\": \"337.50\",\n            \"maxDistance\": 150000,\n            \"airIntakePressureAvg\": \"1230.00\",\n            \"airIntakeTempratureAvg\": \"11000.00\",\n            \"vehicleId\": \"69fbbb09-6418-4a09-bb4e-bc032c3be65f\",\n            \"createdAt\": \"2018-04-24T00:00:00.000Z\"\n        },\n     \n        {\n            \"speedAvg\": 0,\n            \"rpmAvg\": 0,\n            \"maxDistance\": 0,\n            \"airIntakePressureAvg\": 0,\n            \"airIntakeTempratureAvg\": 0,\n            \"vehicleId\": \"69fbbb09-6418-4a09-bb4e-bc032c3be65f\",\n            \"createdAt\": \"2018-04-25T00:00:00.000Z\"\n        },\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/5441f8ef-3255-477b-8b74-49d271a27fea/reports"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  },
  {
    "type": "put",
    "url": "/:tenantId/trips/:commonId",
    "title": "Update Trip",
    "version": "1.0.0",
    "name": "UpdateTrip",
    "group": "Trips",
    "description": "<p>Update Trip.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>authorization token.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X PUT  --data '{\"tripName\": \"Updated trip\",\"description\":\"Trip Monday, January 8, 11:06:35 AM\",\"status\":\"stopped\"}' http://<ip>:<port>/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/5a2a8b63a4894865d03600a7\n-H \"Authorization:<access-token>\" -H \"Content-Type: application/json\"",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tripName",
            "defaultValue": "null",
            "description": "<p>tripName Name of Trip(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "description",
            "defaultValue": "null",
            "description": "<p>Description of trip(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "defaultValue": "null",
            "description": "<p>status Status of trip(0,1,2)(optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "milesDriven",
            "description": "<p>miles driven of the trip.(optional)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "    \t{\n\t        \"tripName\": \"Updated trip\"\n \t        \"status\": 2\n      }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The  token was invalid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The Internal Server Error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalide request parameters.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   \"message\": \"Unauthorized.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   \"message\": \"InternalServerError\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"message\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tripNaame",
            "description": "<p>tripName.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": "<p>Description.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>status.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>End time of trip</p>"
          },
          {
            "group": "Success 200",
            "type": "UUID",
            "optional": false,
            "field": "commonId",
            "description": "<p>common Id of the trip.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "milesDriven",
            "description": "<p>miles driven of the trip.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n  {\n    \"message\": \"Success\",\n    \"data\": {\n        \"tripName\": \" Updated trip\",\n        \"status\": 2,    \n        \"updatedAt\": \"2018-02-27T11:03:40.144Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3303/80201e76-3360-48d3-9804-e5e6a6a4edcb/trips/4aedcab5-9413-4219-b09f-e652df7be3b6"
      }
    ],
    "filename": "routes/trip.js",
    "groupTitle": "Trips"
  }
] });
