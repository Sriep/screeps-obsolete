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

function TaskMovePos (roomPos, pathOps) {
    this.taskType = gc.TASK_MOVE_POS;
    this.conflicts = gc.MOVE;
    this.roomPos = roomPos;
    this.pathOps = pathOps;
    this.loop = true;
    this.pickup = true;
}

TaskMovePos.prototype.doTask = function(creep, task) {
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.endRoom = task.roomPos.roomName;
        task.x = task.pos.x;
        task.y = task.pos.y;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
    }
    console.log(creep,"In TaskMovePos");
    if (creep.room.name == task.roomPos.roomName
        && !TaskMoveRoom.prototype.atBorder(creep.pos.x,creep.pos.y)) {
        return TaskMoveXY.prototype.doTask(creep, task);
    }
    TaskMoveRoom.prototype.doTask(creep, task);
    return  gc.RESULT_UNFINISHED;
}

/*
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.endRoom = task.roomPos.roomName;
        task.x = task.pos.x;
        task.y = task.pos.y;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
    }

    if (creep.room.name == task.roomPos.roomName) { //In target room use TaskMoveXY
        return TaskMoveXY.prototype.doTask(creep, task);
    }

    if (task.pathIndex >= task.path.length) { // We are lost. Recalculate route.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
        return gc.RESULT_UNFINISHED;
    }

    var exit;
    if ( atBorder(creep.pos.x,creep.pos.y ) ) {
        creep.say("moving");
        var currentRoom = creep.room;
        var targetRoom = roomsToVisit[pathIndex].room;
        if (targetRoom == currentRoom) {
            var nextStep =  nextStepIntoRoom(creep.pos, targetRoom)
            var nextStepPath = creep.pos.findPathTo(nextStep);
            if (OK == creep.move(nextStepPath[0].direction)) {
                pathIndex++
            }
            return gc.RESULT_UNFINISHED;
        } else {
            //Do nothing. Wait for next tick when the room changes.
            creep.say("waiting");
        }
    } else {
        exit = creep.pos.findClosestByRange(roomsToVisit[pathIndex].exit);
        creep.moveTo(exit);
    }
    return gc.RESULT_UNFINISHED;

};

var atBorder = function(x,y) {
    return ( x == 0 || x == 49 || y == 0 || y == 49 )
};

var nextStepIntoRoom = function(pos, nextRoom) {
    var x  = pos.x;
    var y= pos.y;
    if (pos.x == 0) {
        x =47;
    }
    if (pos.x == 49) {
        x = 2;
    }
    if (pos.y == 0) {
        y =47;
    }
    if (pos.y == 49) {
        y = 2;
    }
    //  console.log("Just before roomposition constoutor: x",x,"y",y,"room",nextRoom);
    if (undefined !== nextRoom ){
        return new RoomPosition(x,y,nextRoom);
    } else {
        return undefined;
    }
};*/

module.exports = TaskMovePos;




























