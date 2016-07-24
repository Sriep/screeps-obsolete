/**
 * Created by Piers on 19/07/2016.
 */
/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
var policyThePool = require("policy.the.pool");
var raceBase = require("race.base");
var roomOwned = require("room.owned");
var routeBase = require("route.base");
var RouteLinker = require("route.linker");
var RouteNeutralPorter = require("route.neutral.porter");
var RouteRemoteActions = require("route.remote.actions");
var RouteRepairer = require("route.repairer");
var RouteFlexiStoragePorter = require("route.flexi.storage.porter");
var gc = require("gc");
var policyMany2oneLinker = require("policy.many2one.linker");
var policy = require("policy");
/**
 * Requisition object for using the pool
 * @module policy
 */

var linkers = {
    LINK_TO_SOURCE_RANGE: 2,

    attachFlaggedRoutes: function (room, policy) {
     //   console.log(room,"attachFlaggedRoutes");
        var flags = _.filter(Game.flags, function (flag) {
            return ( flag.memory.linkerFrom
                    && (flag.memory.linkerFrom.room == room.name
                    || flag.memory.porterFrom.room == room.name) );
        });
       // console.log(room,"attachFlaggedRoutes flags",flags);
        for ( var i = 0 ; i < flags.length ; i++ ) {
            if ( flags[i].memory.linkerFrom && !this.alreadyInBulidQueue(room, flags[i])
                 && flags[i].memory.linkerFrom.room == room.name ) {
                var order = new RouteLinker(room.name, flags[i].name, policy.id);
                routeBase.attachRoute(room.name, gc.ROLE_LINKER,order,gc.PRIORITY_LINKER);
            }
            if (flags[i].pos.roomName != room
                && flags[i].memory.porterFrom && !this.alreadyInBulidQueue(room, flags[i])
                && flags[i].memory.porterFrom.room == room.name) {
                 order = new RouteNeutralPorter(room.name, flags[i].name, policy.id);
                routeBase.attachRoute(room.name, gc.ROLE_NEUTRAL_PORTER,
                                        order, gc.PRIORITY_NEUTRAL_PORTER);
            }
            if ( flags[i].memory.attachFlaggedReverseController
                && flags[i].memory.claimerFrom.room == room.name
                && !this.alreadyInBulidQueue(room, flags[i])) {
                this.attachFlaggedReverseController(flag,room, policy);
            }
        }
       // console.log(room,"attachFlaggedRoutes end of");
    },

    alreadyInBulidQueue: function(room, flag) {
        return routeBase.filterBuilds(room,"flagName", flag.name).length > 0;
    },

    attachFlexiStoragePorters: function (room, policy) {

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id})
        console.log(room, "attachFlexiStoragePorters, 0 < porterShortfall",
            policyMany2oneLinker.porterShortfall(room,policy));
        console.log(room,"attachFlexiStoragePorters creeps", creeps.length ,
            "< max can fit in room",this.maxCreepsCanFitInRoom(room),"policy.id",policy.id );
        if ( 0 < policyMany2oneLinker.porterShortfall(room,policy)
            && routeBase.filterBuilds(room,"type",gc.ROUTE_FLEXI_STORAGE_PORTER).length == 0) {

             var creeps = _.filter(Game.creeps, function (creep) {
                return creep.memory.policyId == policy.id})
            if (creeps.length < this.maxCreepsCanFitInRoom(room)) {
                var order = new RouteFlexiStoragePorter(room.name, 0, policy.id);
                console.log("attachFlexiStoragePorters creeplife", this.creepLifeTicks(policy),
                    "< middale age", gc.PORTER_PRIORITY_THRESHOLD);
                if (this.creepLifeTicks(policy) < gc.PORTER_PRIORITY_THRESHOLD) {
                    var priority = gc.PRIORITY_EMERGENCY_HOME_PORTER;
                } else {
                    priority = gc.PRIORITY_HOME_PORTER
                }
                routeBase.attachRoute(room.name, gc.ROUTE_FLEXI_STORAGE_PORTER,order,priority);
            }
        }
        //console.log(room,"End of attachFlexiStoragePorters");
    },

    maxCreepsCanFitInRoom: function (room) {
        return roomOwned.accessPointsType(room, FIND_SOURCES)
                         + room.find(FIND_SOURCES).length;
    },

    attachRepairer: function (room) {
        if (routeBase.filterBuilds(room, "type", gc.ROUTE_REPAIRER).length == 0) {
            var order = new RouteRepairer(room.name, policy.id);
            routeBase.attachRoute(room.name, gc.ROUTE_REPAIRER,order,gc.PRIORITY_REPAIRER);
        }
    },

    creepLifeTicks: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id})
        var life = 0;
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            life = life + creeps[i].ticksToLive;
        }
        return life;
    },

    attachFlaggedReverseController: function (flag, room, policy)
    {
        var size = raceClaimer.maxSizeRoom(room);
        var body = raceClaimer.body(size);
        var actions = {
            room : flag.pos.roomName,
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        var timeReversing = CREEP_CLAIM_LIFE_TIME - flag.memory.claimerFrom.distance;
        var ticksReversedLifetime = size * timeReversing;
        var respawn = ticksReversedLifetime - Math.ceil(gc.REVERSE_CLAIM_SAFETYNET / size);
        var order = new RouteRemoteActions(
            room.name,
            actions,
            body,
            respawn,
            policyId
        );
        routeBase.attachRoute(room.name, gc.ROUTE_REMOTE_ACTIONS,order,gc.PRIORITY_REVERSE_CONTROLLER);
    },

    processBuildQueue: function(room) {
        var spawns = room.find(FIND_MY_SPAWNS);
        var nextBuild = routeBase.nextBuild(room);
        console.log(room,"routeBase next build", nextBuild);
        if (undefined !== nextBuild) {
            var result = routeBase.spawn(spawns[0], room, nextBuild);
            console.log(room,"routeBase spawn result",result);
        }
    }
};

module.exports = linkers;

/*
    buildLinkContainersRoom: function (room) {
        var sources = room.find(FIND_SOURCES);
        var dumps = room.find(FIND_STRUCTURES, function (structure) {
            return structure.structureType == STRUCTURE_CONTAINER
                    || structure.structureType == STRUCTURE_LINK
                    || structure.structureType == STRUCTURE_STORAGE
        });
        for ( var i = 0 ; i < sources.length ; i++ ) {
            var possibles = source[i].pos.findInRange(dumps, LINK_TO_SOURCE_RANGE);
            if (!this.canLink(sources[i], possibles)) {
                this.constructLinkDump(source);
            }
        }
    },

    canLink: function (source, posArray) {
        for ( var i = 0 ; i < posArray.length ; i++ ) {
            if (2 <= source.pos.findPathTo(posArray[i]).length)
                return true;
        }
        return false;
    },

    constructLinkDump: function (source) {
        var bestPos, bestAccess;
        for ( var i = 0 ; i < this.TWO_MOVES ; i++) {
            var possable = new RoomPosition(source.pos.x + this.TWO_MOVES[i].x,
                                            source.pos.y + this.TWO_MOVES[i].y,
                                            source.pos.roomName);
            if (2 == source.pos.findPathTo(possable).length) {
                var obsticals =  pos.lookFor(LOOK_STRUCTURES, {
                    filter: function (structure) {
                        return structure in OBSTACLE_OBJECT_TYPES
                    }
                });
                if ( 0 == obsticals.length) {
                    var access = roomOwned.countAccessPoints(source.room, possable.pos)
                    if (!bestAccess || bestAccess < access ) {
                        bestAccess  = acess;
                        bestPos = possable.pos;
                    }
                } // if ( 0 == obsticals.length)
            } // if (2 == source.pos.findPathTo(possable).length)

        } // for ( var i = 0 ; i < this.TWO_MOVES ; i++)
        room.createConstructionSite(bestPos, dumpType(room, bestPos));
    },

    centroid: function (array) {
        var x = 0,y = 0;
        for ( i = 0 ; i < array.length ; i++ ) {
            x = x + array.pos.x;
            y = y + array.pos.y;
        }
        var centX = Math.round(x/array.length);
        var centY = Math.round(y/array.length);
        return new RoomPosition(centX, centY, array[0].pos.roomName);
    }
*/


























