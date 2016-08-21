/**
 * Created by Piers on 19/07/2016.
 */
/**
 * Created by Piers on 06/07/2016.
 */
/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var TaskMoveXY = require("task.move.xy");
var TaskMoveRoom = require("task.move.room");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMoveAttackPos (roomPos, range, pathOps) {
    this.taskType = gc.TASK_MOVE_POS;
    this.conflicts = gc.MOVE;
    this.roomPos = roomPos;
    if (range === undefined) {
        this.range = 0;
    } else {
        this.range =range;
    }
    this.pathOps = pathOps;
    this.loop = true;
    this.pickup = true;
}

TaskMoveAttackPos.prototype.doTask = function(creep, task) {
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.roomName = task.roomPos.roomName;
        task.x = task.roomPos.x;
        task.y = task.roomPos.y;
        //task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
    }
    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) return gc.RESULT_FINISHED;

    //attackInPassing(creep);
    task.roomName = task.roomPos.roomName;
    if (creep.room.name == task.roomPos.roomName
        && !TaskMoveRoom.prototype.atBorder(creep.pos.x,creep.pos.y)) {
        var result = TaskMoveXY.prototype.doTask(creep, task);
        //attackInPassing(creep);
        return result;
    }
    TaskMoveRoom.prototype.doTask(creep, task);
    //attackInPassing(creep);
    return  gc.RESULT_UNFINISHED;
};

//TaskMoveAttackPos.prototype.attackInPassing = function (creep) {
var attackInPassing = function (creep) {
    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
    if(targets.length > 0) {
        creep.rangedAttack(targets[0]);
    }
    targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
    if(targets.length > 0) {
        creep.attack(targets[0]);
    }
};



module.exports = TaskMoveAttackPos;




























