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
/**
 * Abstract Policy
 * @module policyAttackStructures
 */
var policyAttackStructures = {
    MARSHALLING_RANGE: 6,
    ATTACKING: "attacking",
    MARSHALLING: "marshalling",

    initialisePolicy: function (newPolicy) {
        Memory.policies[newPolicy.id].status = this.MARSHALLING;
        if (undefined === newPolicy.structureIds[0])
            newPolicy.structureIds = [newPolicy.structureIds];
        var taskList = this.getTaskList(newPolicy);
        var soldierBody = raceSwordsman.body(newPolicy.creepSize);
        for (var i = 0 ; i < newPolicy.attackGroupSize ; i++) {
            var order = new PoolRequisition(
                newPolicy.id
                , soldierBody
                , taskList
                , undefined //newPolicy.marshallingPoint
                , undefined
            );
           // console.log(JSON.stringify(order));
            PoolRequisition.prototype.placeRequisition(order);
        }
        return true;
    },

    getState: function(creep) {
        console.log(creep,"In getState policyAttackStructures this policy");
        if (undefined !== creep) {
            console.log(creep,"getState (undefined !== creep) ");
            if (undefined !== creep.memory.policyId) {
                console.log(creep,"getState (undefined !== creep.policyId ")
                if (undefined !== Memory.policies[creep.memory.policyId]){
                    console.log(creep,"waiting for in getstae",Memory.policies[creep.memory.policyId].status);
                    return Memory.policies[creep.memory.policyId].status == "attacking";
                }
            }
        }
        return undefined;
    },
    
    getTaskList: function (policy) {
        var taskList = [];
        console.log("polcyattackstrug about to get TaskWAit");
        if (undefined !== policy.marshallingPoint) {
            var moveToMarshillingPoint = new TaskMovePos(policy.marshallingPoint,this.MARSHALLING_RANGE);
            var marshall = new TaskWait("getState", "policy.attack.structures");
         //   moveToMarshillingPoint.loop = false;
         //   marshall.loop = false;
            taskList.push(moveToMarshillingPoint);
            taskList.push(marshall);
        }

        var moveToTarget, attackTarget, moveToRoom
      //  console.log(policy.structureIds.length,"policy.structureIds ", JSON.stringify(policy.structureIds) );
        for ( var i = 0 ; i < policy.structureIds.length ; i++ ){
            moveToRoom = new TaskMoveRoom(policy.roomIds[i]);
            moveToTarget = new TaskMoveFind(gc.FIND_ID, gc.RANGE_ATTACK, policy.structureIds[i]);
            attackTarget = new TaskAttackId(policy.structureIds[i]);
       //     moveToRoom.loop = false;
        //    moveToRoom.loop = false;
        //    attackTarget.loop = false;
            taskList.push(moveToRoom);
            taskList.push(moveToTarget);
            taskList.push(attackTarget);
        }
        
        var moveNearistEnemy = new TaskMoveFind(gc.FIND_ROOM_OBJECT, gc.RANGE_ATTACK, FIND_HOSTILE_CREEPS);
        var attackNearist = new TaskAttackTarget(undefined);
        taskList.push(moveNearistEnemy);
        taskList.push(attackNearist);
        return taskList;
    },

    draftNewPolicyId: function(oldPolicy) {

        if (Memory.policies[currentPolicy.id].status == this.ATTACKING)
        {
            return null;
        }
        return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
    },

    enactPolicy: function(currentPolicy) {
        if (Memory.policies[currentPolicy.id].status == this.ATTACKING)
            return;

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
        });

        for (var i = 0 ; i < creeps.length ; i++ )
        {
            if (!creeps[i].pos.inRangeTo(currentPolicy.marshallingPoint,this.MARSHALLING_RANGE)) {
                return;
            }
        }
        Memory.policies[currentPolicy.id].status = this.ATTACKING;
    }


};

module.exports = policyAttackStructures;





























