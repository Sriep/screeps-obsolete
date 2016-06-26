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
var raceInfantry = {
    BLOCKSIZE: 80 + 50,

    body: function (cost) {
        var numBlocks = Math.ceil(cost/this.blockSize);
        var body = [];
        for (i = 0; i < numBlocks; i++) {
            body.push(ATTACK);
            body.push(MOVE);
        } // for
        return body;	    
    },
}

module.exports = raceInfantry;