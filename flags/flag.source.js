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
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagSource
 */
var flagSource = {

    run: function (flag) {
      //  console.log(flag,"flagSource run");
        if (!flag.room)
            return;

        if ( roomBase.isMyRoom(flag.pos.roomName)) {
            // todo Put in code to give real distance. Not sure if would be used usefully.
            flag.memory.linkerFrom = { room : flag.pos.roomName, distance : 0 };
            flag.memory.porterFrom = { room : flag.pos.roomName, distance : 0 };
        } else if ( roomBase.isNeutralRoom(flag.pos.roomName)) {
        //    console.log("flagSource flag", flag);
            flag.memory.linkerFrom = this.linkerSupplyRoom(flag);
            flag.memory.porterFrom = this.porterSupplyRoom(flag);
      //      console.log("after flagSource flag", flag);
        }
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






















