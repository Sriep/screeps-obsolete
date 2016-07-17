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
            "W26S21",  // room
            "W25S21",  // source room
            "55db3189efa8e3fe66e04b78", // source id
            "577a8dd4b973e61c594592dc", // offload id
            9,
            true,
            800
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_NEUTRAL_HARVEST,order);

        order = new RouteNeutralHarvest(
            "W26S21",  // room
            "W25S21",  // source room
            "55db3189efa8e3fe66e04b79",
            "577a8dd4b973e61c594592dc",
            9,
            true,
            600
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_NEUTRAL_HARVEST,order);

        order = new RouteNeutralHarvest(
            "W26S21",
            "W27S21",
            "55db3151efa8e3fe66e0493e",
            "577a8dd4b973e61c594592dc",
            9,
            true,
            700
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_NEUTRAL_HARVEST,order);

        //var RouteRemoteActions = require("route.remote.actions");
        //var raceClaimer = require("race.claimer");
        //var routeBase = require("route.base");
        //var gc = require("gc");
        var body = raceClaimer.body(3);
        var actions = {
            room : "W25S21",
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        order = new RouteRemoteActions(
            "W26S21",
            actions,
            body,
            600
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_REMOTE_ACTIONS,order);


        var soldierBody = raceSwordsman.body(5);
        order = new RoutePatrolRoom(
            "W26S21",
            "W25S21",
            {roomName: "W25S21", x: 28, y: 14},
            soldierBody,
            1400
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_PATROL_ROOM,order);
/*
        var body = raceClaimer.body(3);
        var actions = {
            room : "W25S23",
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        order = new RouteRemoteActions(
            "W26S21",
            actions,
            body,
            600
        );
        routeBase.attachRoute("W26S21", gc.ROUTE_REMOTE_ACTIONS,order);*/
    },

    roomW25S22:  function () {
        // routesReset = require("routes.reset"); routesReset.roomW25S22();
        //var routeBase = require("route.base");
        var roomName = "W25S22";
        var room = Game.rooms[roomName];
        routeBase.resetRoutes(roomName);
        var fastWorkerSize = raceWorker.maxSizeRoom(room, true);
        var maxSwordsManSize = raceSwordsman.maxSize(room);

        var order;
        order = new RouteNeutralHarvest(
            "W25S22",  // room
            "W25S23",  // source room
            "55db3189efa8e3fe66e04b80", // source id
            "578b0055a0afe21522a4ddc6", // offload id
            fastWorkerSize,
            true,
            800
        );
        routeBase.attachRoute("W25S22", gc.ROUTE_NEUTRAL_HARVEST,order);

        var order;
        order = new RouteNeutralHarvest(
            "W25S22",  // room
            "W25S23",  // source room
            "55db3189efa8e3fe66e04b81", // source id
            "578b0055a0afe21522a4ddc6", // offload id
            fastWorkerSize,
            true,
            800
        );
        routeBase.attachRoute("W25S22", gc.ROUTE_NEUTRAL_HARVEST,order);

        var order;
        order = new RouteNeutralHarvest(
            "W25S22",  // room
            "W25S23",  // source room
            "55db3176efa8e3fe66e04a58", // source id
            "578b0055a0afe21522a4ddc6", // offload id
            fastWorkerSize,
            true,
            800
        );
        routeBase.attachRoute("W25S22", gc.ROUTE_NEUTRAL_HARVEST,order);

        var soldierBody = raceSwordsman.body(maxSwordsManSize);
        order = new RoutePatrolRoom(
            "W25S22",
            "W25S21",
            {roomName: "W25S21", x: 28, y: 14},
            soldierBody,
            900
        );
        routeBase.attachRoute("W25S22", gc.ROUTE_PATROL_ROOM,order);


    }
}

module.exports = routesReset;

















