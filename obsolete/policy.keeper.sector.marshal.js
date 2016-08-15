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
var TaskMovePos = require("task.move.pos");
var battlerQuickEstimate = require("battle.quick.estimate");
var policyFrameworks = require("policy.frameworks");
var roomBase = require("room.base");
/**
 * Abstract Policy
 * @module policyKeeperSectorMarshal
 */
var policyKeeperSectorMarshal = {

    initialisePolicy: function (newPolicy) {
        var flagName = "{ roomName : " + newPolicy.keeperRoom
                            + " , policyId : " + newPolicy.id + " }";
        if (Game.flags[flagName]) {
            Game.flags[flagName].setPosition(newPolicy.marshallingPos);
        } else {
            newPolicy.marshallingPos.createFlag(flagName ,
                gc.FLAG_HARVEST_KEEPER_COLOUR, gc.FLAG_KEEPERS_LAIR_COLOUR);
        }
        newPolicy.flag = Game.flags[flagName];
        return true;
    },

    switchPolicy: function (oldPolicy, newPolicy) {
    },

    draftNewPolicyId: function(oldPolicy) {
        if (this.readyAttackKeeper(oldPolicy)) {
            var insideKeeperRoom = roomBase.justInsideNextRoom(
                oldPolicy.flag.pos.roomName, oldPolicy.keeperRoom, oldPolicy.flag.pos);

            if (insideKeeperRoom) {
                oldPolicy.flag.setPosition(insideKeeperRoom);
                this.creepsMoveToFlag(currentPolicy)
                return policyFrameworks.policyKeeperSectorAttack(oldPolicy, true);
            }
        }
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
        this.creepsMoveToFlag(currentPolicy)
    },

    readyAttackKeeper: function (policy) {
        console.log("In readyAttackKeeper0", policy.id);
        var myAttackCreeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.getActiveBodyparts(ATTACK) > 0
                && creep.pos.inRangeTo(policy.flag, this.MARSHALLING_RANGE);
        });
        if (0 > myAttackCreeps.length) {
            var battleOutcome = battlerQuickEstimate.quickCombat(this.keeper, myAttackCreeps);
            return  battleOutcome.length == myAttackCreeps.length;
        } else {
            return false;
        }
    },

    creepsMoveToFlag: function (policy) {
        var creeps = _.filter(Game.creeps, function(creep) {
            return creep.memory.policyId == policy.id
        });
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            var moveToFlag = TaskMovePos (policy.flag.pos, gc.KEEPER_MARSHALING_RANGE);
            creeps[i].memory.taskList = [];
            creeps[i].memory.taskList.push(moveToFlag);
        }
    }

};

module.exports = policyKeeperSectorMarshal;


















































