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

    attachRoute: function (roomName, routeType, order, priority, reference) {
        var room = Game.rooms[roomName];
        if (!this.checkSetup(room)) return false;
        //console.log("attachRoute rooName",roomName);
        order.id = this.getNextRouteId(room);
        if (priority === undefined) {
            order.priority = gc.DEFAULT_ROUTE_PRIORITY;
        } else {
            order.priority = priority;
        }
        if (reference) this.setDueFromActiveRoute(room, order, reference);
        //console.log("attachRoute rooName",JSON.stringify(order));
        room.memory.routes.details[order.id] = order;
        return true;
    },

    setDueFromActiveRoute: function (room, order, reference) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.buildReference == reference
                && creep.memory.buildType == order.type;
        });
        //console.log(room,"setDueFromActiveRoute order", JSON.stringify(order));
        if (creeps == [] || creeps.length == 0) {
            order.due = 0;
            return;
        }
        creeps = creeps.sort(function (a,b) {return (b.ticksToLive - a.ticksToLive)});
        //onsole.log(room,"setDueFromActiveRoute creeeps",creeps, JSON.stringify(creeps));
        var ticksSinceLastBuild = CREEP_LIFE_TIME - creeps[0].ticksToLive;
        //console.log("setDueFromActiveRoute ticksSinceLastBuild",ticksSinceLastBuild);
        order.due = order.respawnRate - ticksSinceLastBuild;
        if (order.due < 0) order.due = 0;
    },

    resetDueIfRouteNotActive: function(room, build, reference) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.buildReference == reference
                && creep.memory.buildType == build.type;
        });
        if (creeps == [] || creeps.length == 0) {
            build.due = 0;
        }
    },

    removeRoute: function(roomName, routeId) {
        if (undefined === routeId) {
            console.log("Trying to remove an undefined route");
            return;
        }
        var room = Game.rooms[roomName];
        this.checkSetup(room);
        room.memory.routes.details[routeId] = undefined;
        //console.log(roomName,roomName,"romoveRoute length after",room.memory.routes.details.length);
    },

    resetRoutes: function (roomName) {
        var room = Game.rooms[roomName];
        room.memory.routes = {};
        room.memory.routes.details = {};
    },

    showRoutes: function(roomName) {
        var room = Game.rooms[roomName];
        if (!room) return;
        this.checkSetup(room);
        for (var i in  room.memory.routes.details) {
            console.log(roomName,JSON.stringify(room.memory.routes.details[i]));
        }
    },

    buildQueueEnergyPerGen: function(room) {
        //console.log("In  buildQueueEnergyPerGen",room);
       // var room = Game.rooms[roomName];
        if (!room) return;
        if (!this.checkSetup(room)) return;
        var energyPerGen = 0;
        var queue = room.memory.routes.details;
       // console.log(room,"buildQueueEnergyPerGen ernergyInBuildQueue", JSON.stringify(queue));
        for ( var i in queue ) {
            if (queue[i]) {
                module = this.moduleFromRoute(queue[i].type);
                var buildEnergy = module.prototype.energyCost(queue[i]);
                var buildRespawn = queue[i].respawnRate ? queue[i].respawnRate : 0;
                if (buildRespawn) {
                    var energyBuildPerGen = buildEnergy *  CREEP_LIFE_TIME / buildRespawn;
                    energyPerGen = energyPerGen + energyBuildPerGen;
                }
            }
        }
        return energyPerGen;
    },

    filterBuilds: function (room, field, value) {
        if (this.checkSetup(room)) {
            var filteredOrders = [];
            for (var i in  room.memory.routes.details) {
               //console.log(room,"filterBuilds", JSON.stringify(room.memory.routes.details[i]));
                if ( room.memory.routes.details[i]
                    && room.memory.routes.details[i][field]
                    && room.memory.routes.details[i][field] == value) {
                    filteredOrders.push(room.memory.routes.details[i]);
                }
            }
           // console.log("filter builds end of",filteredOrders);
            return filteredOrders;
        }
    },

    filterBuildsF: function (room, filterFunction) {
        if (this.checkSetup(room)) {
            var filteredOrders = [];
            for (var i in  room.memory.routes.details) {
                //console.log(room,"filterBuilds", JSON.stringify(room.memory.routes.details[i]));
                if ( room.memory.routes.details[i]
                    && filterFunction(room.memory.routes.details[i])) {
                    filteredOrders.push(room.memory.routes.details[i]);
                }
            }
            return filteredOrders;
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
        var priority;
        for ( var i in details )  {
           // console.log(room,"routeBase  nextBuild i",i,"details", JSON.stringify(details[i]));
            if (details[i] && details[i].due <= 0) {
                if (undefined === priority) {
                    priority = details[i].priority;
                    mostOverdueRoute = details[i];
                } else if (details[i].priority !== undefined) {
                    if (  details[i].priority < priority ) {

                        priority = details[i].priority;
                        mostOverdueRoute = details[i];
                    } else  if ( priority == details[i].priority
                        && ( mostOverdueRoute === undefined
                        || details[i].due < mostOverdueRoute.due) ) {

                        mostOverdueRoute = details[i];
                    }
                } // else if

             //   if (mostOverdueRoute === undefined
             //       || details[i].due < mostOverdueRoute.due) {
             //       mostOverdueRoute = details[i]
             //   }
            } // if (details[i].due <= 0)
        } // for
        return mostOverdueRoute;
    },



    spawn: function (spawn, room, build) {
        module = this.moduleFromRoute(build.type);
        var result = module.prototype.spawn(build, spawn, room);
      //  console.log("spawn result", result);
        if (_.isString(result)) {
           // debugger;
            //console.log("routeBase just before set due");
            if (0 == room.memory.routes.details[build.id].respawnRate) {
                this.removeRoute(room.name, build.id);
            } else {
                room.memory.routes.details[build.id].due
                    = room.memory.routes.details[build.id].respawnRate;
              //  console.log("routeBase set due to respawn", JSON.stringify(room.memory.routes.details[build.id]));
            }
          //  console.log("routeBase just after set due");
            Game.creeps[result].memory.builtBy = room.name;
            Game.creeps[result].memory.buildType = build.type;
        }
        return result;
    },


    addToRegistry: function (creepName, route) {
        if (route.operator == undefined ) {
            route.operator = []
        }
        route.operator.push( {name : creepName , tick : Game.time} );
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
        if (undefined == room)
            return false;
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






























