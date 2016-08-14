/**
 * Created by Piers on 14/08/2016.
 */
/**
 * Created by Piers on 04/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for infantry creeps.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
/**
 * Abstract base object containing data and functions for use by my infantry
 * creeps. Infantry contain mainly "ATTACK" and "MOVE" parts.
 * @module raceHealer
 */
var racePorter = {
    BLOCKSIZE: 50 + 25,
    BLOCKSIZE_FAST: 50 + 50,
    BLOCKSIZE_PARTS: 2,

    body: function (size, fast) {
        var body = [];
        if (fast) {
            for ( var i = 0 ; i < size ; i++ ) {
                body.push(MOVE);
                body.push(CARRY);
            }
        } else {
            for ( var i = 0 ; i < size ; i++ ) {
                if ( i % 2 == 1) body.push(MOVE);
                body.push(CARRY);
            }
        }
        return body;
    },

    maxSize: function (room, fast) {
        if (fast)
            return Math.min(gc.PORTER_FAST_MAX_SIZE,
                Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE_FAST));
        else
            return Math.min(gc.PORTER_SLOW_MAX_SIZE,
                Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size, fast) {
        return fast ? size * this.BLOCKSIZE_FAST : size * this.BLOCKSIZE;
    },

    maxSizeRoom: function(room, fast) {
        //    console.log("race.worker.maxSizeRoom",room.energyCapacityAvailable,this.BLOCKSIZE);
        var bodyPartLimit;
        if (fast) {
            bodyPartLimit = Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE_FAST);
            return Math.min(bodyPartLimit, gc.PORTER_FAST_MAX_SIZE);
        } else {
            bodyPartLimit =  Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE);
            return Math.min(bodyPartLimit, gc.PORTER_SLOW_MAX_SIZE);
        }
    },

};

module.exports = racePorter;



























