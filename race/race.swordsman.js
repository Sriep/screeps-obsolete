/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for infantry creeps. 
 * @author Piers Shepperson
 */
 
/**
 * Abstract base object containing data and functions for use by my infantry
 * creeps. Infantry contain mainly "ATTACK" and "MOVE" parts.
 * @module raceInfantry
 */
var raceSwordsman = {
    BLOCKSIZE: 80 + 50,

    body: function (size) {
        var body = [];
        for (var i = 0 ; i < size ; i++) {
            body.push(ATTACK);
            body.push(MOVE);
        } // for
        return body;	    
    },
}

module.exports = raceSwordsman;