/**
 * Created by Piers on 10/07/2016.
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
var TaskMoveXY = require("task.move.xy")

/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMoveRoom (roomName, pathOps) {
    this.taskType = gc.TASK_MOVE_ROOM;
    this.conflicts = gc.MOVE;
    this.roomName = roomName;
    this.pathOps = pathOps;
    this.loop = true;
    this.pickup = true;
}

TaskMoveRoom.prototype.doTask = function(creep, task) {
    if (task.startRoom === undefined || task.roomsToVisit == ERR_NO_PATH) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
    }
    if (creep.room.name == task.roomName && !this.atBorder(creep.pos.x,creep.pos.y)) {
        return gc.RESULT_FINISHED;
    }

    if ( task.roomsToVisit === undefined
                || task.pathIndex >= task.roomsToVisit.length ) { // We are lost. Recalculate route.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
        return gc.RESULT_UNFINISHED;
    }

    if ( this.atBorder(creep.pos.x,creep.pos.y ) ) {
        var currentRoom = creep.room;
        var targetRoom = task.roomsToVisit[task.pathIndex].room;
        var nextStepD = this.nextStepIntoRoom(creep.pos, targetRoom)
        var result = creep.move(nextStepD);
        if (OK == result) {
            task.pathIndex++
            if (targetRoom = creep.room) {
                creep.memory.tasks.newRoom = targetRoom;
            }
        }
        return gc.RESULT_UNFINISHED;
    }


    if ( task.roomsToVisit[task.pathIndex] !== undefined) {
        var exit = creep.pos.findClosestByPath(task.roomsToVisit[task.pathIndex].exit);
        var result = creep.moveTo(exit, {
            maxRooms: 1, ignoreDestructibleStructures: true
        });
    } else {
        return gc.RESULT_FINISHED;
    }

    return gc.RESULT_UNFINISHED;

};

TaskMoveRoom.prototype.atBorder = function(x,y) {
    return ( x == 0 || x == 49 || y == 0 || y == 49 )
};

TaskMoveRoom.prototype.nearBorder = function(x,y) {
    var r = 2;
    return ( x <= 0 + r || x >= 49 - r || y <= 0 + r  || y >= 49 - r )
};

TaskMoveRoom.prototype.nextStepIntoRoom = function(pos, nextRoom) {
    var x  = pos.x;
    var y= pos.y;
    var direction;
    if (pos.x == 0) {
        direction = RIGHT;
    }
    if (pos.x == 49) {
        direction = LEFT ;
    }
    if (pos.y == 0) {
        direction = BOTTOM;
    }
    if (pos.y == 49) {
        direction = TOP;
    }
    return direction
};







module.exports = TaskMoveRoom;




























