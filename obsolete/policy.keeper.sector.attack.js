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
var policyFrameworks = require("policy.frameworkds");
var Game = require("Game");

/**
 * Abstract Policy
 * @module policyKeeperSectorAttack
 */
var policyKeeperSectorAttack = {

    initialisePolicy: function (newPolicy) {
    },

    switchPolicy: function (oldPolicy, newPolicy) {
    },

    draftNewPolicyId: function(oldPolicy) {
        if (!Game.rooms[currentPolicy.flag.pos.roomName])
            return oldPolicy;

        if (!currentPolicy.keeperId) {
            currentPolicy.keeperId = this.findKeeper(currentPolicy.flag.pos);
            if (!currentPolicy.keeperId) {
                return policyFrameworks.policyKeeperSectorSuppress(oldPolicy, true);
            } else {
                this.orderAttack(oldPolicy);
            }
        } else if (!Game.getObjectById(currentPolicy.keeperId)) {

            return policyFrameworks.policyKeeperSectorAfterAction(oldPolicy, true);
        }
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
    },

    orderAttack: function (policy) {
        var attackTaskList = this.attackKeeperTaskList(currentPolicy);
        var moveToFlag = TaskMovePos (policy.flag.pos, gc.KEEPER_MARSHALING_RANGE);

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            if (creep.getActiveBodyparts(ATTACK) > 0 ||
                creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                if ( creep.room.name == currentPolicy.keeperRoom) {
                    creeps[i].memory.tasks.taskList = attackTaskList;
                } else {
                    creeps[i].memory.tasks.taskList.concat(attackTaskList);
                }
            } else {
                creeps[i].memory.taskList = [];
                creeps[i].memory.taskList.push(moveToFlag);
            }
        }
        policy.tickLastAttackStarted = Game.time;
    },

    findKeeper: function(pos) {
        return pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(creep) {
                return creep.owner == gc.KEEPER_OWNER;
            }
        });
    },

    attackKeeperTaskList: function(policy) {
        var taskList = [];
        var attackKeeper = TaskAttackId(policy.keeperId);
        var moveToKeeper = new TaskMoveFind(gc.FIND_ID,gc.RANGE_ATTACK, policy.keeperId);
        taskList.push(attackKeeper);
        taskList.push(moveToKeeper);
        taskList.push(attackKeeper);
        return taskList;
    },
};

module.exports = policyKeeperSectorAttack;


















































