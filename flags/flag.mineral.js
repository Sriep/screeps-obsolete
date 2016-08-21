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
var gf = require("gf");
var flagSource = require("flag.source");
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagMineral
 */
var flagMineral = {

    run: function (flag) {
        if (!Game.rooms[flag.pos.roomName]) return;

        //console.log("flagMineral run flag",flag);
        if (gf.isStructureTypeAtPos(flag.pos, STRUCTURE_EXTRACTOR)) {
            flag.memory.extractor = true;
        }

        if (flag.memory.extractor) {
            if ( roomBase.isMyRoom(flag.pos.roomName)) {
                flag.memory.linkerFrom = { room : flag.pos.roomName, distance : 0 };
                flag.memory.porterFrom = { room : flag.pos.roomName, distance : 0 };
            } else  {
                console.log(roomBase.isNeutralRoom(flag.pos.roomName),
                    "flagMineral flag", flag, JSON.stringify(flag.memory));
                //var atPos = flag.pos.lookFor(LOOK_STRUCTURES);
                //var extractorFound = false;
                //for ( var i = 0 ; i < atPos.length ; i++ ){
                 //   if (atPos.structureType == STRUCTURE_EXTRACTOR)
                 //       extractorFound = true;
                //}
                if ( roomBase.isNeutralRoom(flag.pos.roomName)
                    && flag.memory.extractor ) {
                    console.log("flagMineral flag extractor found", flag);
                    flag.memory.linkerFrom = this.linkerSupplyRoom(flag);
                  //  flag.memory.porterFrom = this.porterSupplyRoom(flag);
                }
            }
        }
    },

    linkerSupplyRoom : function (flag) {
        return flagSource.closestInfo(flag);
        // roomBase.findClosest(flag.pos, FIND_MY_SPAWNS);
    },

    porterSupplyRoom : function (flag) {
        return flagSource.closestInfo(flag);
        //var mineralDump = { filter : function (structure) {
        ////    return structure.structureType == STRUCTURE_STORAGE
       //         || structure.structureType == STRUCTURE_CONTAINER
       // }};
        //return roomBase.findClosest(flag.pos, FIND_STRUCTURES, mineralDump);
    }
};

module.exports = flagMineral;