/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module raceScout
 */
var raceScout = {
    BLOCKSIZE: 50,
    BLOCKSIZE_PARTS: 1,
    BODY: [MOVE],


    body: function (size) {
        var body = [];
        for (var i = 0 ; i < size ; i++) {
            body.push(MOVE);
        } // for
        return body;
    },

    maxSizeRoom: function(room) {
        return Math.min(50, Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size) {
        return size * this.BLOCKSIZE;
    }

};

module.exports = raceScout;