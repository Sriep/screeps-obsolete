/**
 * Created by Piers on 16/07/2016.
 */
/**
 * Created by Piers on 16/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module routeBase
 */

var routeBase = {

    Type: {
        NeutralHarvest : gc.ROUTE_NEUTRAL_HARVEST
    },

    attachRoute: function (roomName, routeType, order) {
        var room = Game.rooms[roomName];
        console.log(room,"attachRoute",routeType);
        if (!this.checkSetup(room)) return false;
        module = this.moduleFromRoute(routeType);
        order.id = this.getNextRouteId(room);
        console.log(room,routeType,"attachRoute",JSON.stringify(order));
        room.memory.routes.details[order.id] = order;
        return true;
    },

    removeRoute: function(roomName, routeId) {
        var room = Game.rooms[roomName];
        this.checkSetup(room);
        room.memory.routes.details[routeId] = undefined;
    },

    resetRoutes: function (roomName) {
        var room = Game.rooms[roomName];
        room.memory.routes = {};
        room.memory.routes.details = {};
    },

    showRoutes: function(roomName) {
        var room = Game.rooms[roomName];
        this.checkSetup(room);
        for (var i in  room.memory.routes.details) {
            console.log(roomName,JSON.stringify(room.memory.routes.details[i]));
        }
    },

    update: function(room) {
        this.checkSetup(room);
        for ( var i in room.memory.routes.details )  {
          //  console.log(room,"update route base",i,room.memory.routes.details[i].due);
            room.memory.routes.details[i].due = room.memory.routes.details[i].due - 1;
        }
    },

    nextBuild: function (room) {
        this.checkSetup(room);
        var mostOverdueRoute;
        var details = room.memory.routes.details;
        for ( var i in details )  {
         //   console.log(room,"routeBase  nextBuild i",i,"details", JSON.stringify(details[i]));
            if (details[i].due <= 0) {
                if (mostOverdueRoute === undefined
                    || details[i].due < mostOverdueRoute.due) {
                    mostOverdueRoute = details[i]
                }
            }
        }
        return mostOverdueRoute;
    },

    spawn: function (spawn, room, build) {
        module = this.moduleFromRoute(build.type);
        //console.log(spawn,room,"spawn route base, buld.type",build.type,module)
        var result = module.prototype.spawn(build, spawn, room);
        if (_.isString(result)) {
            room.memory.routes.details[build.id].due
                = room.memory.routes.details[build.id].respawnRate;
            this.addToRegistry(result,room.memory.routes.details[build.id]);
        }
        return result;
    },

    addToRegistry: function (creepName, route) {
        if (route.creeps == undefined ) {
            route.creeps = []
        }
        route.push( {name : creepName , tick : Game.time} );
    },

    getDetails: function (roomName, id) {
        var room = Game.rooms[roomName];
        return  room.memory.routes.details[id];
    },


    moduleFromRoute: function(routeType) {
        if (undefined === routeType)
            return;
        return require("route." + routeType);
    },

    getNextRouteId: function(room) {
        if (room.memory.routes.nextRouteId === undefined) {
            room.memory.routes.nextRouteId = 1;
        }
        var latestId = room.memory.routes.nextRouteId;
        room.memory.routes.nextRouteId = room.memory.routes.nextRouteId +1;
        return latestId;
    },

    checkSetup: function(room) {
        if (undefined === room.memory)
            return false;
        if (room.memory.routes === undefined) {
            room.memory.routes = {};
        }
        if (room.memory.routes.details === undefined) {
            room.memory.routes.details = {};
        }
        return true;
    }

};



module.exports = routeBase;






























