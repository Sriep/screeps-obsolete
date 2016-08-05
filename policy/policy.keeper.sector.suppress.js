/**
 * Created by Piers on 04/08/2016.
 */
/**
 * Created by Piers on 18/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. policyAttackStructures.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var raceSwordsman = require("race.swordsman");
var PoolRequisition = require("pool.requisition");
var TaskMovePos = require("task.move.pos");
var TaskAttackId = require("task.attack.id");
var TaskAttackTarget = require("task.attack.target");
var TaskMoveFind = require("task.move.find");
var TaskWait = require("task.wait");
var TaskMoveRoom = require("task.move.room");
var Battle = require("combat.quick.estimate");
var raceBase = require("race.base");
var battle = require("combat.quick.estimate");
var TaskHeal = require("task.heal");
var TaskMoveAttackPos = require("task.move.attack.pos");
var policyKeeperSectorMarshal = require("policy.keeper.sector.marshal");
var policyKeeperSectorAttack = require("policy.keeper.sector.attack");
var policyFrameworks = require("policy.frameworks")
/**
 * Abstract Policy
 * @module policyHarvestKeeperSuppress
 */
var policyHarvestKeeperSuppress = {

    initialisePolicy: function (newPolicy) {
        var lairs = Game.rooms[newPolicy.keeperRoom].find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_KEEPER_LAIR }
        });
        lairs.sort(function (a, b) {
            return b.ticksToSpawn - a.ticksToSpawn;
        });
        newPolicy.flag.setPosition(lairs[0].pos);
        policyKeeperSectorMarshal.creepsMoveToFlag(newPolicy);
    },

    switchPolicy: function (oldPolicy, newPolicy) {
    },

    draftNewPolicyId: function(oldPolicy) {
        if(policyKeeperSectorAttack.findKeeper(oldPolicy.flag.pos)) {
            return policyFrameworks.policyKeeperSectorAttack(oldPolicy, true);
        }
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
    }

};

module.exports = policyHarvestKeeperSuppress;


















































