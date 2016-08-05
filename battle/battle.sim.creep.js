/**
 * Created by Piers on 04/08/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module BattleSimCreep  Object.keys(obj.Data).length
 */

    function BattleSimCreep (creepOrParts, attackParts, rangedParts, healParts) {
        if (arguments.length  == 1) {
            var creep = creepOrParts;
            this.startParts = Object.keys.length(creep.body);
            this.parts =  _.filter(creep.body, function (part) {
                return part.hits > 0
            }).length;

            this.startAttackParts = _.filter(creep.body, function (part) {
                return part.type == ATTACK
            }).length;
            this.attackParts = creep.getActiveBodyparts(ATTACK);

            this.startRangedParts = _.filter(creep.body, function (part) {
                return part.type == RANGED_ATTACK
            }).length;
            this.rangedParts = creep.getActiveBodyparts(RANGED_ATTACK);

            this.startHealParts = _.filter(creep.body, function (part) {
                return part.type == HEAL
            }).length;
            this.healParts = creep.getActiveBodyparts(HEAL);

        } else {

            if (creepOrParts === undefined)
                creepOrParts = 0;
            this.startParts = healParts;
            this.parts =  creepOrParts;
            if (attackParts === undefined)
                attackParts = 0;
            this.startAttackParts = attackParts;
            this.attackParts = attackParts;
            if (rangedParts === undefined)
                rangedParts = 0;
            this.startRangedParts = rangedParts;
            this.rangedParts = rangedParts;
            if (healParts === undefined)
                healParts = 0;
            this.startHealParts = healParts;
            this.healParts = healParts;
        }
    }

module.exports = BattleSimCreep;

























