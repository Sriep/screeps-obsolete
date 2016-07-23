/**
 * Created by Piers on 21/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
"use strict";
var raceWorker = require("race.worker");
var roleBase = require("role.base");
var gc = require("gc");
/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module roomBase
 */
var roomBase = {
    // Always flagged as permanent
    // FIND_SOURCES, FIND_MINERALS, STRUCTURE_CONTROLLER
    // STRUCTURE_KEEPER_LAIR,
    //
    // Also Flagged in neutral rooms but not permeate
    // STRUCTURE_PORTAL, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN


    examineRooms: function () {
        for ( var room in Game.rooms ) {
            this.flagRoom(Game.rooms[room]);
        }
        var nearByRooms = this.nearByRooms();
        nearByRooms.forEach( function (roomName) {
         //  console.log("in foreach room",roomName);
            if (Memory.rooms[roomName] === undefined
                || Memory.rooms[roomName].memory === undefined
                || !Memory.rooms[roomName].memory.flagged) {
                    roomBase.sendScout(roomName);
            }
            if (roomBase.isEnemyRoom(roomName)) {
                roomBase.planInvasion();
            }
        });
    },

    flagRoom: function (room) {
        if (!room.memory.flagged) {
            var flagName;
            var sources = room.find(FIND_SOURCES);
            for ( var i in sources ) {
                flagName = sources[i].id;
                sources[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_SOURCE_COLOUR);
                Game.flags[flagName].memory.type = gc.FLAG_SOURCE;
                Game.flags[flagName].memory.resourceType = RESOURCE_ENERGY;
                Game.flags[flagName].memory.energyCapacity = sources[i].energyCapacity;
                if (room.controller && sources.length >= 2  && !this.isMyRoom(room.name)) {
                    Game.flags[flagName].memory.upgradeController = true;
                }
            }
            if (room.controller) {
                flagName = room.controller.id;
                room.controller.pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_CONTROLLER_COLOUR);
                Game.flags[flagName].memory.type = gc.FLAG_CONTROLLER;
                if (!this.isMyRoom(room.name)) {
                    Game.flags[flagName].memory.upgradeController = (sources.length >= 2);
                }
            }
            var minerals = room.find(FIND_MINERALS);
            for ( i in minerals ) {
                flagName =  minerals[i].id;
                minerals[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_MINERAL_COLOUR);
                Game.flags[flagName].memory.type = gc.FLAG_MINERAL;
                Game.flags[flagName].memory.resourceType = minerals[i].mineralType;
            }
            var keeperLairs = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_KEEPER_LAIR }
            });
            for ( i in keeperLairs ) {
                flagName = keeperLairs[i].id;
                keeperLairs[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_KEEPERS_LAIR_COLOUR);
                Game.flags[flagName].memory.type = gc.FLAG_KEEPERS_LAIR_COLOUR;
            }
            room.memory.flagged = true;
        }
    },

    isEnemyRoom: function (roomName) {
        if (!Game.rooms[roomName]) return undefined;
        if (!Game.rooms[roomName].controller) return false;
        if (!Game.rooms[roomName].controller.owner) return false;
        return !Game.rooms[roomName].controller.my
    },

    isNeutralRoom: function (roomName) {
        if (!Game.rooms[roomName]) return undefined;
        if (!Game.rooms[roomName].controller) return true;
        if (!Game.rooms[roomName].controller.owner) return true;
    },

    isMyRoom: function (roomName) {
        if (!Game.rooms[roomName]) return false;
        if (!Game.rooms[roomName].controller) return false;
        if (!Game.rooms[roomName].controller.owner)  return false;
        return Game.rooms[roomName].controller.my;
    },

    sendScout: function (room) {
    //    TODO send a count creep to room
     //   console.log("send scout to", room);
    },

    planInvasion: function (room) {
        // TODO plan invasion of enemy room
      //  console.log("plan invasion of", room);
    },

    nearByRooms: function (){
        var myrooms = _.filter(Game.rooms, function (room) {
            return room.controller && room.controller.my
        });
        var nearByRooms = new Set(myrooms);
        for ( var i = 0 ; i < myrooms.length ; i++ )
        {
            var exits = Game.map.describeExits(myrooms[i].name);
            for ( var j in exits) {
                nearByRooms.add(exits[j]);
            }
        }
        return nearByRooms;
    },

    distanceBetween: function  (posFrom, posTo) {
      //  console.log(JSON.stringify(posFrom),"to", JSON.stringify(posTo));
        var room = Game.rooms[posFrom.roomName];
        if (undefined === room) return undefined;
        var route = Game.map.findRoute(room.name, posTo.roomName);
       // console.log("route", JSON.stringify(route));
        var distance = 0;
        if (route.length > 0) {
            var exit = posFrom.findClosestByPath(route[0].exit);
            if (!exit) {
                exit = posFrom.findClosestByRange(route[0].exit);
            }
          //  console.log("after findclostedbypath",exit);
            distance = posFrom.findPathTo(exit).length;
            var entrance = this.exitToEntrance(exit, route[0].room);
            for (var i = 1; i < route.length; i++) {
           //     console.log("distanceFrom exit",exit, "entrance",entrance,"distance",distance);
          //      console.log( "JSON.stringify(route[i])",JSON.stringify(route[i]));
                exit = entrance.findClosestByPath(route[i].exit);
             //   console.log("exit",exit);
                distance += entrance.findPathTo(exit).length;
              //  console.log("distance",distance);
                entrance = this.exitToEntrance(exit, route[i].room);
            }
        }
      //  console.log("distance",distance)
        distance += posTo.findPathTo(entrance).length;
     //   console.log("distance",distance,"posTofindpatho",posTo.findPathTo(entrance).length)
        return distance;
    },

    findClosest: function (pos, findType, Opts) {
        var exits = Game.map.describeExits(pos.roomName);
        var roomClosest, distanceClosest;
        for ( var i in exits ) {
            if (roomBase.isMyRoom(exits[i])) {
                var exit = pos.findClosestByPath(parseInt(i));
                if (!exit) {
                    exit = pos.findClosestByRange(parseInt(i));
                }
                if (exit) {
                    var entrance = this.exitToEntrance(exit, exits[i]);
                    var target = entrance.findClosestByRange(findType, Opts);
                    if (undefined !== target) {
                     //   console.log("about to distance betwen pos",JSON.stringify(pos), JSON.stringify(target.pos) );
                        var distance = this.distanceBetween(pos, target.pos);
                      //  console.log("distance",distance );
                        if (!distanceClosest || distance < distanceClosest) {
                            distanceClosest = distance;
                            roomClosest = exits[i];
                        }
                    }
                }
            }
        }
        //console.log("findClosestSpawn retuncs",JSON.stringify({ room : roomClosest, distance : distanceClosest }) );
        return { room : roomClosest, distance : distanceClosest };
    },

    exitToEntrance: function (exitPos, newRoom)
    {
        if (exitPos && newRoom) {
          //  console.log( "exitPos",JSON.stringify(exitPos),"newroom", newRoom );
            var newX = exitPos.x, newY=exitPos.y;
            if (exitPos.x == 0) newX = 49;
            if (exitPos.x == 49) newX = 0;
            if (exitPos.y == 0) newY = 49;
            if (exitPos.y == 49) newY = 0;
            console.log(newX,newY,newRoom);
            var entrance = new RoomPosition(newX, newY, newRoom);
            return entrance;
        }
    }



};

module.exports = roomBase;































