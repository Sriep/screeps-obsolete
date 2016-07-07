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
var TaskActions = require("task.actions")
var tasks = require("tasks");
var TaskMoveXY = require("task.move.xy")

/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMovePos (RoomPos) {
    this.taskType = gc.TASK_MOVE_POS;
    this.conflicts = gc.MOVE;
    this.roomPos = roomPos;
    this.loop = true;
    this.pickup = true;
}

TaskMovePos.prototype.doTask = function(creep, task, actions) {
    if (task.startRoom === undefined)
        task.startRoom = creep.room.name;
    if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49  )
    {
        
        var roomsToVisit = Game.map.findRoute(creep.room.name, roomPos.room);
        var pathToExit = creep.pos.findPathTo(roomPos);


        var nextStep = this.nextStepIntoRoom(creep.pos, creep.memory.targetRoom);
        var path = creep.pos.findPathTo(nextStep);
        if (undefined != path[0]){
            creep.move(path[0].direction);
            return this.Task.MOVE;
        }
    } else {
        return TaskMoveXY.doTask(creep, task, actions);
    }
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
};

module.exports = TaskMovePos;




























