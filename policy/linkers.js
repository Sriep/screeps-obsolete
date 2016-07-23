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
var gc = require("gc");
var policyMany2oneLinker = require("policy.many2one.linker");
var policy = require("policy");
/**
 * Requisition object for using the pool
 * @module policy
 */

var linkers = {
    LINK_TO_SOURCE_RANGE: 2,

    attachFlaggedRoutes: function (room, currentPolicy) {
        var flags = _.filter(Game.flags, function (flag) {
            return ( flag.memory.linkerFrom.room == room.name
                    || flag.memory.porterFrom.room == room.name );
        });
        for ( var i = 0 ; i < flags.length ; i++ ) {
            if ( flags[i].memory.linkerFrom
                 && flags[i].memory.linkerFrom.room == room.name ) {
                var order = new RouteLinker(room, flag.name);
                routeBase.attachRoute(roomName, gc.ROLE_LINKER,order,gc.PRIORITY_LINKER);
            }
            if (flags[i].pos.roomName != room
                && flags[i].memory.porterFrom
                && flags[i].memory.porterFrom.room == room.name) {
                 order = new RouteNeutralPorter(room, flag.name);
                routeBase.attachRoute(roomName, gc.ROLE_NEUTRAL_PORTER,
                                        order, gc.PRIORITY_NEUTRAL_PORTER);
            }
            if ( flags[i].memory.attachFlaggedReverseController
                && flags[i].memory.claimerFrom.room == room.name) {
                this.attachFlaggedReverseController(flag,room);
            }
        }
    },

    attachFlexiStoragePorters: function (room, policy) {
        if ( 0 < policyMany2oneLinker.porterShortfall(room,currentPolicy)) {
            var order = new RouteLinker(room, 0);
            if (policy.creepLifeTicks(policy) < gc.MIDDLE_AGE_CREEP_LIFE_TO_LIVE) {
                var priority = gc.PRIORITY_EMERGENCY_HOME_PORTER;
            } else {
                priority = gc.PRIORITY_HOME_PORTER
            }
            routeBase.attachRoute(roomName, gc.ROLE_LINKER,order,priority);
        }
    },

    attachFlaggedReverseController: function (flag, room)
    {
        var size = raceClaimer.maxSizeRoom(room);
        var body = raceClaimer.body(size);
        var actions = {
            room : room.name,
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
            respawn
        );
        routeBase.attachRoute(roomName, gc.ROUTE_REMOTE_ACTIONS,order,gc.PRIORITY_REVERSE_CONTROLLER);
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


























