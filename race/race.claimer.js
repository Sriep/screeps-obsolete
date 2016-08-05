/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module raceClaimer
 */
var raceClaimer = {
    //BLOCKSIZE: 600 + 50 + 50,
    //BODY: [CLAIM, MOVE,MOVE],
    BLOCKSIZE: 600 + 50,
    BODY: [CLAIM, MOVE],


    body: function (size) {
        var body = [];
        for (var i = 0 ; i < size ; i++) {
            body.push(CLAIM);
            body.push(MOVE);
          //  body.push(MOVE);
        } // for
        return body;
    },

    maxSizeRoom: function(room) {
        return Math.min(Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size) {
        return size * this.BLOCKSIZE;
    }

};

module.exports = raceClaimer;