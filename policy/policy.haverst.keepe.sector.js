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
var Battle = require("battle");
/**
 * Abstract Policy
 * @module policyAttackStructures
 */
var policyHarvestKeeperSector = {
    MARSHALLING_RANGE: 4,
    MARSHALLING_COLOUR_1: COLOR_RED,
    MARSHALLING_COLOUR_2: COLOR_ORANGE,
    State: {
        MovingOut: "moving.out",
        Marshalling: "marshalling",
    },

    keeper: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
            TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
            ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
            RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,
            ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
            RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK],

    initialisePolicy: function (newPolicy) {
        newPolicy.marshallingPreActionPos.createFlag(newPolicy.id , COLOR_RED, COLOR_GREEN);
        Memory.policies[newPolicy.id].status = this.State.Marshalling;
        return true;
    },

    getState: function(creep) {
        return undefined;
    },

    getTaskList: function (policy) {
        var taskList = [];
        return taskList;
    },

    draftNewPolicyId: function(oldPolicy) {
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
        switch(Memory.policies[newPolicy.id].status){
            case this.State.Marshalling:
                this.marshalling(currentPolicy);
                break;
            case this.State.MovingOut:
                this.movingOut(currentPolicy);
                break;
            default:
        }
    },

    marshalling: function (policy) {
        Memory.policies[newPolicy.id].status = this.State.Marshalling;
        if (this.readyAttackKeeper(policy)) {
            this.marshallingToMovingOut(policy);
        }
    },

    marshallingToMovingOut: function(policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            if (Game.creeps[i].pos.inRangeTo(policy.marshallingPoint,this.MARSHALLING_RANGE)) {
                var flag = Game.flags[policy.id];
                flag.setPosition(newPolicy.marshallingActivePos);
                creeps[i].memory.tasks.taskList = thies.moveKeeperRoomTaskList(policy.marshallingActivePos);
            }
        }
        Memory.policies[newPolicy.id].status = this.State.MovingOut;
    },

    movingOut: function (policy) {


    },

    moveKeeperRoomTaskList: function (pos) {
        var taskList = [];
        var moveToPosition = new TaskMoveAttackPos(pos, MARSHALLING_RANGE);
        taskList.push(moveToPosition);
        return taskList;
    },

    readyAttackKeeper: function (policy) {
        var myAttackCreeps = [];
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            if (raceBase.occurrencesInBody(Game.creeps[i].body, ATTACK) > 0) {
                if (Game.creeps[i].pos.inRangeTo(policy.marshallingPoint,this.MARSHALLING_RANGE)) {
                    myAttackCreeps.push(Game.creeps[i]);
                }
            }
        }
        if (0 > myAttackCreeps.length) {
            var battleOutcome = battle.quickCombat(this.keeper, myAttackCreeps);
            return  battleOutcome.length == myAttackCreeps.length;
        } else {
            return false;
        }
    }

};

module.exports = policyHarvestKeeperSector;





























