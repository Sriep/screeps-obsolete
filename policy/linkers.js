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
/**
 * Requisition object for using the pool
 * @module policy
 */

var linkers = {
    LINK_TO_SOURCE_RANGE: 2,
    TWO_MOVES: [{x :2, y:2}, {x:2,y:1},{x :2, y:0}, {x:2,y:-1}, {x :2, y:-2},
                 {x :1, y:2}, {x:0,y:2},{x :-1, y:2}, {x:-2,y:2},
                 {x:-2,y:1},{x :-2, y:0}, {x:-2,y:-1}, {x :-2, y:-2},
                   {x :1, y:-2}, {x:0,y:-2},{x :-1, y:-2} ],







};

module.exports = linkers;

/*
    examinRooms: function () {
        var rooms = this.closeRooms();
        rooms.forEach(function(roomName) {
            if (!Game.rooms[roomName].controller ||
                !Game.rooms[roomName].controller.owner) {
                flagNeutralRooom(Games.rooms[roomName])
            } else if(Game.rooms[roomName].controller.my) {
                flagMyOwnedRoom(Games.rooms[roomName]);
            } else {
                planInvasion(Games.rooms[roomName]);
            }
        })
    },

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


























