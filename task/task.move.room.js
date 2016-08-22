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

function TaskMoveRoom (roomName, pathOps, customMoveToFunction, functionModule, finsihCondition, finishModule) {
    this.taskType = gc.TASK_MOVE_ROOM;
    this.conflicts = gc.MOVE;
    this.roomName = roomName;
    this.pathOps = pathOps;
    this.loop = true;
    this.pickup = true;
    //this.movesTowardsCenter = movesTowardsCenter;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.finsihCondition = finsihCondition;
    this.finishModule = finishModule;
}

TaskMoveRoom.prototype.doTask = function(creep, task) {
    //console.log(creep,"taks.roomAme",task.roomName);
    if (!task.roomName) return gc.RESULT_FINISHED;
    if (task.finsihCondition) {
        var module = require(task.finishModule);
        var rtv = module[task.finsihCondition](creep);
        if (rtv) return rtv;
    }
    ///console.log(creep,"TaskMoveRoom start");
    //if ( creep.name == "Claire")
       // console.log(creep,creep.room,JSON.stringify(creep.pos), "start",JSON.stringify(task));
    if (task.startRoom === undefined || task.roomsToVisit == ERR_NO_PATH) { //First call to function. Initialise data.
       // if ( creep.name == "Claire") console.log(creep,creep.room,"at startroom or no path");
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
    }
    if (creep.room.name == task.roomName && !this.atBorder(creep.pos.x,creep.pos.y)) {
      //  console.log(creep,"TaskMoveRoom at right room");
        return gc.RESULT_FINISHED;
    }

    if ( task.roomsToVisit === undefined
                || task.pathIndex >= task.roomsToVisit.length ) { // We are lost. Recalculate route.
     //  console.log(creep,creep.room,"lost");
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
        return gc.RESULT_UNFINISHED;
    }

    if (task.roomsToVisit == ERR_NO_PATH){
       // if ( creep.name == "Claire") console.log(creep,creep.room," no path");
       // console.log(creep,"moveroom no path", creep.room, "rooms to visit", JSON.stringify(task.roomsToVisit));
        //console.log(creep,"task",JSON.stringify(task));
        return gc.RESULT_UNFINISHED;
    }

    if ( this.atBorder(creep.pos.x,creep.pos.y ) ) {
        var currentRoom = creep.room;
        var targetRoom = task.roomsToVisit[task.pathIndex].room;
        var nextStepD = this.nextStepIntoRoom(creep.pos, targetRoom);
        //if ( creep.name == "Claire")
         //   console.log(creep,creep.room,"atBorder nextstep",nextStepD);
        var result = creep.move(nextStepD);
        if (OK == result) {
            task.pathIndex++;
            if (targetRoom = creep.room) {
                creep.memory.tasks.newRoom = targetRoom;
            }
        }
        return gc.RESULT_UNFINISHED;
    }

    if ( task.roomsToVisit[task.pathIndex] !== undefined) {
        var exit = creep.pos.findClosestByPath(task.roomsToVisit[task.pathIndex].exit);
        //if ( creep.name == "Claire")
        // console.log(creep,creep.room,"exit", exit, "roomstovisit",JSON.stringify(task.roomsToVisit),"indiex", task.pathIndex)
        if (task.customMoveToFunction) {
            if(task.functionModule) {
                var fModule = require(task.functionModule);
                result = fModule[task.customMoveToFunction](creep, exit);
            } else {
                result = task.customMoveToFunction(creep, exit);
            }
        } else {
            result = creep.moveTo(exit);
        }
         //console.log(creep,"result",result);
    } else {
       // console.log(creep,"duh! about to return finish");
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

TaskMoveRoom.prototype.moveTowardsCenter = function (pos) {
    var room = Game.rooms[pos.roomName];
    var xNextPos, xNextMove,yNextPos,yNextMove;
    if ( pos.x < 25) {
        xNextMove = RIGHT;
        xNextPos = 1;
    }
    else {
        xNextMove = LEFT;
        xNextPos = -1
    }
    if ( pos.y < 25)
    {
        yNextMove = BOTTOM;
        yNextPos = 1
    }  else {
        yNextMove = TOP;
        yNextPos = -1;
    }
    var diaganal = new RoomPosition(pos+xNextMove,pos+yNextMove);
    //if (isdiagonal.look())






}







module.exports = TaskMoveRoom;




























