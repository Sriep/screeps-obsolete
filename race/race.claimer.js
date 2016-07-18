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
    }
}

module.exports = claimer;