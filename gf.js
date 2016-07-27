/**
 * Created by Piers on 19/07/2016.
 */
"use strict";
var gc = require("gc");

var gf = {

 isEnterable: function (pos) {
        var atPos = pos.look();
        var SWAMP = "swamp";
        var PLAIN = "plain";
        for ( var i = 0 ; i < atPos.length ; i++ )
        {
            switch (atPos[i].type) {
                case LOOK_TERRAIN:
                    if (atPos[i].terrain != PLAIN && atPos[i].terrain != SWAMP)
                        return false;
                    break;
                case LOOK_STRUCTURES:
                    if (OBSTACLE_OBJECT_TYPES.includes(atPos[i].structure.structureType))
                        return false;
                    break;
                case LOOK_CREEPS:
                case LOOK_SOURCES:
                case LOOK_MINERALS:
                case LOOK_NUKES:
                case LOOK_ENERGY:
                case LOOK_RESOURCES:
                case LOOK_FLAGS:
                case LOOK_CONSTRUCTION_SITES:
                default:
            }
        }
        return true;
    },

    structureTypeInRange: function (pos, structureType, range) {
        if (!range) range = 1;
        //console.log("structureTypeInRange",pos, structureType,range);
        var structures = Game.rooms[pos.roomName].find(FIND_STRUCTURES, {
            filter: { structureType: structureType }
        });
        //console.log(pos,"structureTypeInRange",structureType,"obj",structures);
        var inRange = [];
        for  ( var i = 0 ; i < structures.length ; i++ )  {
            //console.log(pos,"pos",structures[i].pos,"is it in range",pos.inRangeTo(structures[i], range))
            if ( pos.inRangeTo(structures[i], range) )
                inRange.push(structures[i]);
        }
        return inRange;
    },

    isStructureTypeAtPos: function (pos, structureType) {
        if (!pos || !pos.roomName) return undefined;
        if (!Game.rooms[pos.roomName]) return undefined;
        var atPos = pos.look();
        if (!atPos) return false;
        //console.log(pos,"isStructureTypeAtPos",structureType,atPos);
        for ( var i = 0 ; i < atPos.length ; i++ ) {
            if (atPos[i].type ==  LOOK_STRUCTURES
                && atPos[i].structure.structureType == structureType)
                return true;
        }
        return false;
    },

    joinPointsBetween: function (pos1, pos2) {
        var deltaX = pos1.x - pos2.x;
        var deltaY = pos1.y - pos2.y;
        var offsets = gc.ADJACENCIES[deltaX][deltaY];
        var joinPos = [];
      //  console.log("joinPointsBetween", pos1,pos2);
        for (var i = 0 ; i < offsets.length ; i++ ) {
            var pos = new RoomPosition( pos2.x + offsets[i].dx,
                                        pos2.y + offsets[i].dy,
                                        pos2.roomName );
            if (gf.isEnterable(pos)) joinPos.push(pos);
        }
        return joinPos;
    },

    isFull: function (dump) {
        switch (dump.structureType) {
            case  STRUCTURE_CONTAINER:
            case  STRUCTURE_STORAGE:
            case  STRUCTURE_TERMINAL:
                return dump.storeCapacity == _.sum(dump.store);
            case STRUCTURE_EXTENSION:
            case STRUCTURE_SPAWN:
            case  STRUCTURE_LINK:
                return dump.energyCapacity == dump.energy;
            default:
                return undefined;
        }
    },

    getPerimeter: function (N) {
        var perimeter = [];
        for ( var i = -N ; i <= N ; i++ ) {
            if ( i != -N )
                perimeter.push( { x : N, y : i } );
            if ( i != N )
                perimeter.push( { x : i, y : N } );
            if ( i != N )
                perimeter.push( { x : -N, y : i } );
            if ( i != -N )
                perimeter.push( { x : i, y : -N } );
        }
        return perimeter;
    }

};


module.exports = gf;































