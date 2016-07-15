/**
 * Created by Piers on 13/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Template.
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
 * @module policyPatrolRoom
 */
var policyPatrolRoom = {
    MARSHALLING_RANGE: 6,
    ATTACKING: "attacking",
    MARSHALLING: "marshalling",

    initialisePolicy: function (newPolicy) {
        var taskList = this.getTaskList(newPolicy);
        var soldierBody = raceSwordsman.body(newPolicy.creepSize);
        var order = new PoolRequisition(
            newPolicy.id
            , soldierBody
            , taskList
            , undefined //newPolicy.marshallingPoint
            , undefined
        );
       // console.log(JSON.stringify(order));
        PoolRequisition.prototype.placeRequisition(order);

        return true;
    },
    
    findEnemyTarget: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
       // console.log(creep, "in find enemy targets",target);
        return target;
    },
    

    getTaskList: function (policy) {
        var taskList = [];
        
        var moveToLocation;
        if (undefined === policy.roomPos.roomName)
        {
            moveToLocation = new TaskMoveRoom(policy.roomPos);
        } else {
            moveToLocation = new TaskMovePos(policy.roomPos,2);
        }
        var moveToTarget = new TaskMoveFind(gc.FIND_FUNCTION, gc.RANGE_ATTACK, 
            "findEnemyTarget","policy.patrol.room");
        var attackTarget = new  TaskAttackId({roomName : policy.room, })

        taskList.push(moveToLocation);
        taskList.push(moveToTarget);
        taskList.push(attackTarget);
        return taskList;
    },

    draftNewPolicyId: function(oldPolicy) {
       return null;
      // return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
    },

    enactPolicy: function(currentPolicy) {
    }


};

module.exports = policyPatrolRoom;





























