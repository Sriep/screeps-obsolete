/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module raceInfantry
 */
var claimer = {
    BLOCKSIZE: 600 + 50 + 50,
    BODY: [CLAIM, MOVE,MOVE],

    body: function (cost) {
        if (cost >= this.BLOCKSIZE) {
            return this.BODY;
        } else {
            return null;
        }
    }
}

module.exports = claimer;