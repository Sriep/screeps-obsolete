/**
 * Created by Piers on 09/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for infantry creeps.
 * @author Piers Shepperson
 */
"use strict";
/**
 * Abstract base object containing data and functions for use by my infantry
 * creeps. Infantry contain mainly "ATTACK" and "MOVE" parts.
 * @module raceCleric
 */
var raceCleric = {
    BLOCKSIZE: 250 + 80 + 50 + 50,
    BLOCKSIZE_PARTS: 4,

    body: function (attack, heal, move) {
        if (!move) move = attack + heal;
        var body = [];
        for (var i = 0 ; i < move ; i++) {
            body.push(MOVE);
        }
        for (var j = 0 ; j < attack ; j++) {
            body.push(ATTACK);
        }
        for (var k = 0 ; k < heal ; k++) {
            body.push(HEAL);
        }
        return body;
    },
/*
    maxSize: function (room) {
        return Math.min(25, Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE));
    },

    energyFromSize: function (size) {
        return size * this.BLOCKSIZE;
    },
*/
};

module.exports = raceCleric;