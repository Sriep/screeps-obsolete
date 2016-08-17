/**
 * Created by Piers on 21/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var roomBase = require("room.base");
var gc = require("gc");
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagSource
 */
var flagSource = {

    run: function (flag) {
       console.log(flag,"flagSource run start", flag.memory.type, flag.pos.roomName);
        //if (!flag.memory.type)
       //     return;
        //console.log("flagSource before if statment", flag, flag.memory.energyCapacity, JSON.stringify(flag.memory));
        if ( roomBase.isMyRoom(flag.pos.roomName)) {
            // todo Put in code to give real distance. Not sure if would be used usefully.
            console.log("flagSource flag in my room", flag, flag.memory.energyCapacity);
            flag.memory.linkerFrom = { room : flag.pos.roomName, distance : 0 };
            flag.memory.porterFrom = { room : flag.pos.roomName, distance : 0 };
        } else if (roomBase.isNeutralRoom(flag.pos.roomName ) ) {
            console.log("flagSource flag", flag, flag.memory.energyCapacity);
            flag.memory.linkerFrom = this.linkerSupplyRoom(flag);
            flag.memory.porterFrom = this.porterSupplyRoom(flag);
            //console.log("after flagSource flag", flag);
        } else {
            console.log("flag source nothing");
            //if (Memory.rooms[flag.pos.roomName])
           //     Memory.rooms[flag.pos.roomName].flagged = false;
            //flag.memory.linkerFrom = undefined;
            //flag.memory.porterFrom = undefined;
        }
       //console.log("flagSource after if statment", flag, flag.memory.energyCapacity,JSON.stringify(flag.memory));
    },

    closestInfo: function (flag, findOpts) {
        var myRooms = roomBase.findClosestOwnedRooms(flag.pos.roomName, gc.MAX_DEPTH_ROOM_SEARCH);
        var distance, closest;
        for ( var i = 0 ; i < myRooms.length ; i++ ) {
            var structure;
            if (findOpts) {
                structure = Game.rooms[myRooms[i]].find(FIND_STRUCTURES, findOpts);
            } else {
                structure = Game.rooms[myRooms[i]].find(FIND_MY_SPAWNS);
            }
            var d = roomBase.distanceBetween(flag.pos, structure.pos);
            if (!distance || distance > d) {
                distance = d;
                closest = myRooms[i];
            }
        }
        return { room : closest, distance : distance };
        //return { room : roomClosest, distance : distanceClosest };
    },

    linkerSupplyRoom : function (flag) {
        return roomBase.findClosest(flag.pos, FIND_MY_SPAWNS);
    },

    porterSupplyRoom : function (flag) {
        var endergyDump = { filter : function (structure) {
            return structure.structureType == STRUCTURE_SPAWN
                || structure.structureType == STRUCTURE_STORAGE
                || structure.structureType == STRUCTURE_LINK
                || structure.structureType == STRUCTURE_CONTAINER
        }};
        return roomBase.findClosest(flag.pos, FIND_STRUCTURES, endergyDump);
    }



};

module.exports = flagSource;






















