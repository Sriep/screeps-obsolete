/**
 * Created by Piers on 17/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
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
 * Abstract role object for creeps building in a neutral room
 * @module policy
 */
var rolePatrolRoom = {

    getTaskList: function(creep, patrolRoom, roomPos) {
        var taskList = [];

        var moveToLocation;
        if (undefined === roomPos || roomPos.roomName != patrolRoom)
        {
            moveToLocation = new TaskMoveRoom(patrolRoom);
        } else {
            moveToLocation = new TaskMovePos(roomPos);
        }
        var moveToTarget = new TaskMoveFind(gc.FIND_FUNCTION, gc.RANGE_ATTACK,
            "findEnemyTarget","policy.patrol.room");
        var attackTarget = new  TaskAttackId({roomName : policy.room, })

        taskList.push(moveToLocation);
        taskList.push(moveToTarget);
        taskList.push(attackTarget);
        return taskList;
    },


    findEnemyTarget: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // console.log(creep, "in find enemy targets",target);
        return target;
    },
};


module.exports = rolePatrolRoom;























