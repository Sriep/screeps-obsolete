/**
 * Created by Piers on 17/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var gc = require("gc");
var TaskAttackId = require("task.attack.id");
var TaskMoveFind = require("task.move.find");
var TaskMoveRoom = require("task.move.room");
var TaskMoveAttackPos = require("task.move.attack.pos");
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
            //moveToLocation = new TaskMovePos(roomPos);
            moveToLocation = new TaskMoveAttackPos(roomPos);
        }
        var moveToTarget = new TaskMoveFind(gc.FIND_FUNCTION, gc.RANGE_ATTACK,
            "findEnemyTarget","role.patrol.room");
        var attackTarget = new  TaskAttackId();

        taskList.push(moveToLocation);
        taskList.push(moveToTarget);
        taskList.push(attackTarget);
        return taskList;
    },


    findEnemyTarget: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      //   console.log(creep, "in find enemy targets",target);
        return target;
    },
};


module.exports = rolePatrolRoom;























