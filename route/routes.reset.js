/**
 * Created by Piers on 17/07/2016.
 */
/**
 * @fileOverview Setup roues one time.
 * @author Piers Shepperson
 */
"use strict";
var routeBase = require("route.base");
var RouteNeutralHarvest  = require("route.neutral.harvest");
var RouteRemoteActions = require("route.remote.actions");
var RoutePatrolRoom = require("route.patrol.room");
var raceSwordsman = require("race.swordsman");
var raceClaimer = require("race.claimer");
var raceWorker = require("race.worker");
var gc = require("gc");


var routesReset = {
    // routesReset = require("routes.reset"); routesReset.roomW26S21();
    roomW26S21: function() {
        //var routeBase = require("route.base");
        var roomName = "W26S21";
        var room = Game.rooms[roomName];
        routeBase.resetRoutes(roomName);
        var order;
        var fastWorkerSize = raceWorker.maxSizeRoom(room, true);

        // RouteNeutralHarvest  (room,sourceRoom,sourceId,offloadId,size,fast,respawnRate)
        order = new RouteNeutralHarvest(
            roomName,  // room
            "W25S21",  // source room
            "55db3189efa8e3fe66e04b78", // source id
            "578fd0a01d5fe373181c40e4", // offload id
            12,
            true,
            750
        );
        routeBase.attachRoute(roomName, gc.ROUTE_NEUTRAL_HARVEST,order);

        order = new RouteNeutralHarvest(
            roomName,  // room
            "W25S21",  // source room
            "55db3189efa8e3fe66e04b79",
            "578fd0a01d5fe373181c40e4",
            12,
            true,
            350
        );
        routeBase.attachRoute(roomName, gc.ROUTE_NEUTRAL_HARVEST,order);

        order = new RouteNeutralHarvest(
            roomName,
            "W26S22",
            "55db3176efa8e3fe66e04a55",
            "577a8dd4b973e61c594592dc",
            12,
            true,
            300
        );
        routeBase.attachRoute(roomName, gc.ROUTE_NEUTRAL_HARVEST,order);

        var body = raceClaimer.body(4);
        var actions = {
            room : "W26S22",
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        order = new RouteRemoteActions(
            roomName,
            actions,
            body,
            600
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_REMOTE_ACTIONS,order);

       // (room, patrolRoom, startPos, body, respawnRate)
        var soldierBody = raceSwordsman.body(6);
        order = new RoutePatrolRoom(
            roomName,
            "W25S21",
            {roomName: "W25S21", x: 28, y: 14},
            soldierBody,
            1100
        );
        routeBase.attachRoute(roomName, gc.ROUTE_PATROL_ROOM,order);
    },

    roomW25S22:  function () {
        // routesReset = require("routes.reset"); routesReset.roomW25S22();
        // routesReset = require("routes.reset"); routesReset.resetRoutes("sim");
        var roomName = "W25S22";
        var room = Game.rooms[roomName];
        routeBase.resetRoutes(roomName);
        var fastWorkerSize = raceWorker.maxSizeRoom(room, true);
        var maxSwordsManSize = raceSwordsman.maxSize(room);

        var body = raceClaimer.body(2);
        var actions = {
            room : "W25S21",
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        var order = new RouteRemoteActions(
            roomName,
            actions,
            body,
            300
        );
        routeBase.attachRoute(roomName, gc.ROUTE_REMOTE_ACTIONS,order);

        order = new RouteNeutralHarvest(
            roomName,
            "W26S22",
            "55db3176efa8e3fe66e04a54",
            "578b0055a0afe21522a4ddc6",
            fastWorkerSize,
            true,
            300
        );
        routeBase.attachRoute(roomName, gc.ROUTE_NEUTRAL_HARVEST,order);
/*
        var soldierBody = raceSwordsman.body(maxSwordsManSize);
        var order = new RoutePatrolRoom(
            roomName,
            "W25S23",
            {roomName: "W25S23", x: 28, y: 14},
            soldierBody,
            1400
        );
        routeBase.attachRoute(roomName, gc.ROUTE_PATROL_ROOM,order);*/
    },

    roomW25S23:  function () {
        // routesReset = require("routes.reset"); routesReset.roomW25S23();
        var roomName = "W25S23";
        var room = Game.rooms[roomName];
        routeBase.resetRoutes(roomName);
        var fastWorkerSize = raceWorker.maxSizeRoom(room, true);
        var maxSwordsManSize = raceSwordsman.maxSize(room);

        var body = raceClaimer.body(2);
        var actions = {
            room : "W26S23",
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        var order = new RouteRemoteActions(
            roomName,
            actions,
            body,
            300
        );
        routeBase.attachRoute(roomName, gc.ROUTE_REMOTE_ACTIONS,order);

        order = new RouteNeutralHarvest(
            roomName,  // room
            "W26S23",  // source room
            "55db3176efa8e3fe66e04a58", // source id
            "578e2b154732415a3bf555d8", // offload id
            fastWorkerSize,
            true,
            200
        );
        routeBase.attachRoute(roomName, gc.ROUTE_NEUTRAL_HARVEST,order);
/*
        var soldierBody = raceSwordsman.body(maxSwordsManSize);
        order = new RoutePatrolRoom(
            roomName,
            roomName,
            {roomName: roomName, x: 28, y: 14},
            soldierBody,
            1500
        );
        routeBase.attachRoute(roomName, gc.ROUTE_PATROL_ROOM,order);*/
    }
};

module.exports = routesReset;

















