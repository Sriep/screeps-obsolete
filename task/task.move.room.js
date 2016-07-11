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
    this.loop = false;
    this.pickup = true;
}

TaskMoveRoom.prototype.doTask = function(creep, task) {
    console.log(creep,"In TaskMoveRoom");
    if (task.startRoom === undefined) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.endRoom = roomName;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
    }

    if (creep.room.name == task.roomPos.roomName && !atBorder(creep.pos.x,creep.pos.y)) { 
        return gc.RESULT_FINISHED;
    }

    if (task.pathIndex >= task.path.length) { // We are lost. Recalculate route.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomPos.room, task.pathOps);
        task.pathIndex = 0;
        return gc.RESULT_UNFINISHED;
    }

    var exit;
    if ( this.atBorder(creep.pos.x,creep.pos.y ) ) {
        creep.say("moving");
        var currentRoom = creep.room;
        var targetRoom = roomsToVisit[pathIndex].room;
        if (targetRoom == currentRoom) {
            var nextStep =  this.nextStepIntoRoom(creep.pos, targetRoom)
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

TaskMoveRoom.prototype.atBorder = function(x,y) {
    return ( x == 0 || x == 49 || y == 0 || y == 49 )
};

TaskMoveRoom.prototype.nextStepIntoRoom = function(pos, nextRoom) {
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
};

module.exports = TaskMoveRoom;




























