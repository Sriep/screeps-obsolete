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
var policyFrameworks = require("policy.frameworks");
/**
 * Abstract Policy
 * @module policyHarvestKeeperAfterAction
 */
var policyHarvestKeeperAfterAction = {

    initialisePolicy: function (newPolicy) {
    },

    draftNewPolicyId: function(oldPolicy) {
        if (!this.restAndHeal(oldPolicy)) {
            if (policyKeeperSectorMarshal.readyAttackKeeper(oldPolicy)) {
                return policyFrameworks.policyKeeperSectorAttack(oldPolicy, true);
            } else {
                oldPolicy.cleared = false;
                return policyFrameworks.policyKeeperSectorMarshal(undefined, undefined, true, oldPolicy);
            }
        }
        if (this.hurryItUp(oldPolicy) && policyKeeperSectorMarshal.readyAttackKeeper(oldPolicy)) {
            return policyFrameworks.policyKeeperSectorAttack(oldPolicy, true);
        }
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
        this.restAndHeal(currentPolicy);
    },

    hurryItUp: function (policy) {
        return Game.time - policy.tickLastAttackStarted > gc.KEEPER_CYCLE_MAX_WAIT;
    },

    outOfTime: function (policy) {
        return Game.time - policy.tickLastAttackStarted > ENERGY_REGEN_TIME;
    },

    restAndHeal: function(policy) {
        var healers = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.getActiveBodyparts(HEAL) > 0
                && creep.room == this.flag.room;
        });

        if (healers.length > 0) {
            var injured = _.filter(Game.creeps, function (creep) {
                return creep.memory.policyId == policy.id
                    && creep.hits < creep.hitsMax
                    && creep.room == this.flag.room;
            });
            if (injured.length > 0) {
                this.assignTreatment(healers, injured);
                return true;
            }
        }
        return false;
    },

    assignTreatment: function (healers, injured) {
        var healeraskList = [];
        var heal = new TaskHeal();
        var moveToPatient = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findPatient","policy.harvest,keeper.sector");
        healeraskList.push(heal);
        healeraskList.push(moveToPatient);
        healeraskList.push(heal);
        for ( var i = 0 ; i < healers.length ; i++ ) {
            healers[i].memory.tasks.taskList = healeraskList;
        }

        var patientsTaskList = {};
        var moveToHealer = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findHealer","policy.harvest,keeper.sector");
        patientsTaskList.push(moveToHealer);
        for ( var i = 0 ; i < injured.length ; i++ ) {
            injured[i].memory.tasks.taskList = patientsTaskList;
        }
    },

    findHealer: function (creep) {
        return creep.pos.findClosestByRange(FIND_MY_CREEPS, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.getActiveBodyparts(HEAL) > 0
        });
    },

    findPatient: function (creep) {
        return creep.pos.findClosestByRange(FIND_MY_CREEPS, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.hits < creep.hitsMax
        });
    }

};

module.exports = policyHarvestKeeperAfterAction;


















































