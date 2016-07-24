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
 * @module flagMineral
 */
var flagMineral = {

    run: function (flag) {

        if (flag.memory.extractor) {
            if ( roomBase.isMyRoom(flag.room.name)) {
                flag.memory.linkerFrom = { room : flag.room.name, distance : 0 };
                flag.memory.porterFrom = { room : flag.room.name, distance : 0 };
            } else  {
              //  console.log("flagMineral flag", flag);
                var atPos = flag.pos.lookFor(LOOK_STRUCTURES);
                var extractorFound = false;
                for ( var i = 0 ; i < atPos.length ; i++ ){
                    if (atPos.structureType == STRUCTURE_EXTRACTOR)
                        extractorFound = true;
                }
                if ( roomBase.isNeutralRoom(flag.room.name)
                    && extractorFound ) {
                    flag.memory.linkerFrom = this.linkerSupplyRoom(flag);
                    flag.memory.porterFrom = this.porterSupplyRoom(flag);
                }
            }
        }
    },

    linkerSupplyRoom : function (flag) {
        return roomBase.findClosest(flag.pos, FIND_MY_SPAWNS);
    },

    porterSupplyRoom : function (flag) {
        var mineralDump = { filter : function (structure) {
            return structure.structureType == STRUCTURE_STORAGE
                || structure.structureType == STRUCTURE_CONTAINER
        }};
        return roomBase.findClosest(flag.pos, FIND_STRUCTURES, mineralDump);
    }
};

module.exports = flagMineral;