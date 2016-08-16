/**
 * Created by Piers on 15/08/2016.
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
 * @module raceSapper
 */
var raceSapper = {

    body: function (move, work, heal) {
        if (move+work+heal > 50) return;
        var body = [];
        for (var i = 0 ; i < move ; i++) {
            body.push(MOVE);
        } // for
        for (var j = 0 ; j < work ; j++) {
            body.push(WORK);
        } // for
        for (var k = 0 ; k < heal ; k++) {
            body.push(HEAL);
        } // for
        return body;
    },


};

module.exports = raceSapper;