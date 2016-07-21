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

function TaskMovePos (roomPos, range, pathOps) {
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

TaskMovePos.prototype.doTask = function(creep, task) {
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        if (undefined === task.roomPos) {
            console.log(creep,"position undefined in TaskMovePos");
            return gc.RESULT_FINISHED;
        }
        task.roomName = task.roomPos.roomName; // ToDP error
        task.x = task.roomPos.x;
        task.y = task.roomPos.y;
        //task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
    }
   // console.log(creep,"In TaskMovePos");
    //task.x = task.roomPos.x;
    //task.y = task.roomPos.y;
    if (undefined == task.roomPos)
        return gc.RESULT_FINISHED;
    task.roomName = task.roomPos.roomName;
    if (creep.room.name == task.roomPos.roomName
        && !TaskMoveRoom.prototype.atBorder(creep.pos.x,creep.pos.y)) {
        return TaskMoveXY.prototype.doTask(creep, task);
    }
    //console.log(creep,"In TaskMovePos about to call TaskMoveRoom");
    TaskMoveRoom.prototype.doTask(creep, task);
    return  gc.RESULT_UNFINISHED;
}



module.exports = TaskMovePos;




























