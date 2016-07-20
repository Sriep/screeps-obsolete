/**
 * Created by Piers on 19/07/2016.
 */
"use strict";

var gf = {

    isWalkable: function (pos) {
        var obstacles = pos.lookFor(LOOK_STRUCTURES, {
            filter: function (structure) {
                return structure in OBSTACLE_OBJECT_TYPES
            }
        });
        if (obstacles.length > 0)
            return false;
        var creeps = pos.loogFor(LOOK_CREEPS);
        return 0 == creeps.length;
    }
/*
        var atPos = pos.look();
        var SWAMP = "swamp";
        var PLAIN = "plain";
        for ( var i = 0 ; i < atPos.length ; i++ )
        {
            switch (atPos[i].type) {
                case LOOK_CREEPS:
                case LOOK_SOURCES:
                case LOOK_MINERALS:
                case LOOK_NUKES:
                    if (atPos[i][atPos[i].type] !== undefined)
                        return false;
                    break;
                case LOOK_TERRAIN:
                    if (atPos[i].terrain != PLAIN && atPos[i].terrain != SWAMP)
                        return false;
                    break;
                case LOOK_STRUCTURES:
                    if (atPos[i].structure.structureType == STRUCTURE_SPAWN
                        || atPos[i].structure.structureType == STRUCTURE_EXTENSION
                        || atPos[i].structure.structureType == STRUCTURE_WALL
                        || atPos[i].structure.structureType == STRUCTURE_KEEPER_LAIR
                        || atPos[i].structure.structureType == STRUCTURE_CONTROLLER
                        || atPos[i].structure.structureType == STRUCTURE_LINK
                        || atPos[i].structure.structureType == STRUCTURE_STORAGE
                        || atPos[i].structure.structureType == STRUCTURE_TOWER
                        || atPos[i].structure.structureType == STRUCTURE_POWER_BANK
                        || atPos[i].structure.structureType == STRUCTURE_POWER_SPAWN
                        || atPos[i].structure.structureType == STRUCTURE_EXTRACTOR
                        || atPos[i].structure.structureType == STRUCTURE_LAB
                        || atPos[i].structure.structureType == STRUCTURE_TERMINAL
                        || atPos[i].structure.structureType == STRUCTURE_NUKER)
                        return false;
                    break;
                case LOOK_ENERGY:
                case LOOK_RESOURCES:
                case LOOK_FLAGS:
                case LOOK_CONSTRUCTION_SITES:
                default:
            }
        }
        return true;
    }*/

};


module.exports = gf;
