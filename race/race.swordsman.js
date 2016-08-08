/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for infantry creeps. 
 * @author Piers Shepperson
 */
"use strict";
/**
 * Abstract base object containing data and functions for use by my infantry
 * creeps. Infantry contain mainly "ATTACK" and "MOVE" parts.
 * @module raceSwordsman
 */
var raceSwordsman = {
    BLOCKSIZE: 80 + 50,
    BLOCKSIZE_PARTS: 2,

    body: function (size) {
        var body = [];
        for (var i = 0 ; i < size ; i++) {
            body.push(ATTACK);
            body.push(MOVE);
        } // for
        return body;	    
    },

    maxSize: function (room) {
        return Math.min(25, Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size) {
        return size * this.BLOCKSIZE;
    },

};

module.exports = raceSwordsman;