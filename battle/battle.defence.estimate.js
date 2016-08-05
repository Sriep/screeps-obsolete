/**
 * Created by Piers on 04/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object for battles.
 * @author Piers Shepperson
 */
"use strict";
var raceBase = require("race.base");
var gc = require("gc");
/**
 * Abstract base object for battles.
 * @module BattleDefenceEstimate
 */
var BattleDefenceEstimate = {

    quickDefence: function ( attackCreeps, defenceCreeps, towers ) {
        var attackers = this.convert(attackCreeps);
        var defenders = this.convert(defenceCreeps);
        var towers = this.convertTowers(towers);
        return this.quickDefenceInternal(attackers, defenders, towers);
    },

    convert: function (creeps) {

    },

    convertTowers: function (towers) {

    },

    quickDefenceInternal: function(attackers, defenders, towers) {

    }

};

module.exports = BattleDefenceEstimate;































