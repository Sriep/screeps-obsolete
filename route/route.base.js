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
var gf = require("gf");
var labColours = require("lab.colours");
var roleBase = require("role.base");
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
        order.homeYard = roomName;
        if (priority === undefined) {
            order.priority = gc.DEFAULT_ROUTE_PRIORITY;
        } else {
            order.priority = priority;
        }
        order.basePriority = order.priority;
        if (reference) this.setDueFromActiveRoute(room, order, reference);
        //console.log("attachRoute rooName",JSON.stringify(order));
        room.memory.routes.details[order.id] = order;
        //console.log(roomName, routeType,"attachRoute order id", order.id);
        return order.id;
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
        //console.log(roomName,"removeRoute1",routeId);
        if (undefined === routeId) {
            console.log("Trying to remove an undefined route");
            return;
        }
        var room = Game.rooms[roomName];
        if (!room ) return;
        if (!this.checkSetup(room)) return;
        delete room.memory.routes.details[routeId];
        //room.memory.routes.details[routeId] = undefined;
        //console.log(roomName,roomName,"romoveRoute length after",room.memory.routes.details.length);
    },

    resetRoutes: function (roomName) {
        var room = Game.rooms[roomName];
        delete room.memory.routes;
        room.memory.routes = {};
        room.memory.routes.details = {};
    },

    showRoutes: function(roomName) {
        var room = Game.rooms[roomName];
        if (!room) return;
        this.checkSetup(room);
        for (var i in  room.memory.routes.details) {
            console.log(i,roomName,JSON.stringify(room.memory.routes.details[i]));
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
                    energyPerGen += buildEnergy *  CREEP_LIFE_TIME / buildRespawn;
                }
            }
        }
        return energyPerGen;
    },

    buldQueueRespawnTimePerGen: function(room) {
        if (!room) return;
        if (!this.checkSetup(room)) return;
        var partsPerGen = 0;
        var queue = room.memory.routes.details;
        // console.log(room,"buildQueueEnergyPerGen ernergyInBuildQueue", JSON.stringify(queue));
        for ( var i in queue ) {
            if (queue[i]) {
                module = this.moduleFromRoute(queue[i].type);
                var buildParts = module.prototype.parts(queue[i]);
                var buildRespawn = queue[i].respawnRate ? queue[i].respawnRate : 0;
                if (buildRespawn) {
                    partsPerGen += buildParts *  CREEP_LIFE_TIME / buildRespawn;
                }
                //console.log("buildParts",queue[i].type,buildParts, buildRespawn);
            }
        }
        return partsPerGen * CREEP_SPAWN_TIME;
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
        return [];
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

    handleDependancies: function(queue, dependancies) {
        for ( var i = 0 ; i < dependancies.length ; i++ ){
            queue[dependancies[i].id].priority = dependancies[i].priority;
        }
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
    },

    spawn: function (spawn, room, build) {
        module = this.moduleFromRoute(build.type);

        var result;
        //if (gc.ROUTE_WALL_BUILDER  == build.type ) {
        if ( gc.AUTO_BOOST_CREEPS && build.boostActions && build.boostActions.length > 0 ) {
            result = this.boostSpawn(build, module, spawn, room);
            //result = module.prototype.spawn(build, spawn, room);
        }
        else {
            result = module.prototype.spawn(build, spawn, room);
        }
        //console.log("spawn result", result, "build", JSON.stringify(build));
        if (_.isString(result)) {
            // debugger;
            console.log("routeBase just before set due",build.id
                ,room.memory.routes.details[build.id].respawnRate);
            if (0 == room.memory.routes.details[build.id].respawnRate) {
                this.removeRoute(room.name, build.id);
            } else {
                room.memory.routes.details[build.id].due
                    = room.memory.routes.details[build.id].respawnRate;
                room.memory.routes.details[build.id].priority
                    = room.memory.routes.details[build.id].basePriority;
                if (room.memory.routes.details[build.id].dependancies)
                    this.handleDependancies(room.memory.routes.details,
                        room.memory.routes.details[build.id].dependancies);
                //console.log("routeBase set due to respawn", JSON.stringify(room.memory.routes.details[build.id]));
            }
            //  console.log("routeBase just after set due");
            Game.creeps[result].memory.builtBy = room.name;
            Game.creeps[result].memory.buildType = build.type;

            if ( gc.AUTO_BOOST_CREEPS && build.boostActions && build.boostActions.length > 0 ) {
                //result = this.boostSpawn(build, module, spawn, room);
                Game.creeps[result].memory.stuff = "about to set stuff";
                Game.creeps[result].memory.noboostroleParameters = module.prototype.roleParameters(build);
                Game.creeps[result].memory.boostInfo
                    = this.reserveBoosts(room, build.body, build.boostActions,build.replaceWithToughs);
            }

        } else if (ERR_GCL_NOT_ENOUGH == result || ERR_INVALID_ARGS == result) {
            console.log("routeBase spawn result",result, "invalid build details", JSON.stringify(build));
            this.removeRoute(room.name, build.id);
        }
        return result;
    },

    boostSpawn: function(build, module, spawn, room) {
        var name;
        var result = spawn.canCreateCreep(build.body);
        if (OK != result) return result;
        var boostInfo =  this.reserveBoosts(room, build.body, build.boostActions, build.replaceWithToughs);
        var roleParameters = module.prototype.roleParameters(build);

        if ( boostInfo
            && boostInfo.body
            && boostInfo.boostLabs && boostInfo.boostLabs.length > 0) {

            console.log("boostSpawn boostInfo", JSON.stringify(boostInfo));
            //return module.prototype.spawn(build, spawn, room);
            name = spawn.createCreep(boostInfo.body);
            //Game.creeps[name].memory.boostInfoSet = "boostSpawn have set boost info";
            //Game.creeps[name].memory.boostInfo = boostInfo;
            Game.creeps[name].memory.policyId = build.policyId;
            //Game.creeps[name].memory.buildDotRole = build.role;
            //Game.creeps[name].memory.boostroleParameters = roleParameters;
            Game.creeps[name].memory.buildReference = build.owner;
            roleBase.switchRoles(
                Game.creeps[name],
                gc.ROLE_BOOST_AND_SWITCH,
                boostInfo.boostLabs,
                build.role,
                roleParameters
            );
            Game.creeps[name].memory.AFTERsetroleInforstIf = boostInfo;
            Game.creeps[name].memory.AFTERandtheparamters = roleParameters;
            return name;
        } else {
            name = spawn.createCreep(build.body);
            roleBase.switchRolesA(
                Game.creeps[name],
                build.role,
                roleParameters
            );
            //Game.creeps[name].memory.boostInfoSet = "have set boost info boost info included";
            //Game.creeps[name].memory.buildDotRole = build.role;
            Game.creeps[name].memory.noboostroleParameters = roleParameters;
            Game.creeps[name].memory.boostInfo = boostInfo;
            Game.creeps[name].memory.policyId = build.policyId;
            Game.creeps[name].memory.buildReference = build.owner;
            return name;
            //return module.prototype.spawn(build, spawn, room);
        }
    },

    reserveBoosts: function(room, body, boostAction, replaceWithToughs) {
        //console.log("reserveBoosts",boostAction);
        var boostLabs = [];
        var labs = room.find(FIND_STRUCTURES, {
            filter: function(l) {
                var flag = Game.flags[l.id];
                if (!flag) return false;
                return l.structureType == STRUCTURE_LAB
                    && flag.secondaryColor != COLOR_WHITE
                    && l.mineralAmount > LAB_BOOST_MINERAL* gc.BOOST_RESERVE
                    && l.energy  > LAB_BOOST_ENERGY * gc.BOOST_RESERVE;
            }
        });
        if (labs.length > 0 && body) {
            var newBody = body.slice(0);
            var actionsAdded = [];
            //console.log(newBody,"reserveBoosts",labs);
            for ( var i = 0 ; i < labs.length ; i++ ) {
                var flag = Game.flags[labs[i].id];
                var resource = labColours.resource(flag.color, flag.secondaryColor);
                var maxBoosts = Math.floor(Math.min(labs[i].mineralAmount/LAB_BOOST_MINERAL,
                                                     labs[i].energy/LAB_BOOST_ENERGY));
                var boostPart = _.findKey(BOOSTS,resource);
                var action = _.findKey( BOOSTS[boostPart][resource] );
                var multiplyer = BOOSTS[boostPart][resource][action];
                //console.log(flag,"flag maxBoosts",maxBoosts,"resource",resource,"boostPart",
                //    boostPart,"action",action,"multiplyer",multiplyer);
                if (boostAction.indexOf(action)  != -1
                    &&  body.indexOf(boostPart) != -1) {

                    var numParts = gf.countValues(body, boostPart);
                    var partsBoosted = Math.min(maxBoosts,  numParts - Math.ceil(numParts/multiplyer));
                    //console.log("numParts",numParts,"partsBoosted",partsBoosted);
                    if ( actionsAdded.indexOf(action) == -1 ) {
                        for ( var j = 0 ; j < partsBoosted ; j++ ) {
                            var index = newBody.indexOf(boostPart);
                            //console.log(j,"in for index",index,"newBody",newBody)  ;
                            newBody.splice(index,1);
                        }
                    }
                    actionsAdded.push(action);
                    boostLabs.push(labs[i].id);
                } // if
            } // for
            if (boostLabs.length > 0) {
                return { body : newBody, boostLabs : boostLabs };
            }
        }
        if (replaceWithToughs && body && newBody) {
            var toughs = body.length - newBody.length;
            for ( var k = 0 ; k < toughs ; k++ ) {
                newBody.unshift(TOUGH);
            }
        }
    }
};

// var boostPart = _.findKey(BOOSTS,"UO");
// var action = BOOSTS[WORK]["UO"];
// var key = _.findKey(action);
// var multiplyer = BOOSTS[WORK]["UO"][key];
// console.log("boostPart", boostPart,"action",JSON.stringify(action),"key",key,"mult",multiplyer);
// boostPart work action {"harvest":2} key harvest mult 2

module.exports = routeBase;






























