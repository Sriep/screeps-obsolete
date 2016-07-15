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
  //  console.log(creep,task.pathIndex,"pathindex In TaskMoveRoom",JSON.stringify(creep.pos));
    if (task.startRoom === undefined || task.roomsToVisit == ERR_NO_PATH) { //First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
    }
    //console.log(creep,"IIn move room roomsToVisit", JSON.stringify(task.roomsToVisit))
    if (creep.room.name == task.roomName && !this.atBorder(creep.pos.x,creep.pos.y)) {
    //    console.log(creep,"finished creep.room.name",creep.room.name,
   //         "ask.roomName",task.roomName,"pos", JSON.stringify(creep.pos))
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
   //     console.log(creep,"iiin move room",targetRoom, "pathindex", task.pathIndex, creep.room.name,JSON.stringify(creep.pos));
      //  if (targetRoom == creep.room.name) {
         //   console.log(creep,"old rommoving",targetRoom, creep.room.name, JSON.stringify(creep.pos));

         //   creep.say("moving");

            var nextStepD = this.nextStepIntoRoomDD(creep.pos, targetRoom)
        //    console.log(creep,"direction to move",nextStepD);
            var result = creep.move(nextStepD);
        //    console.log(creep,"resout of move",result,"steep was",nextStepD,"pos was",JSON.stringify(creep.pos) )
            if (OK == result) {
            //if (OK == creep.move(TOP)) {
                task.pathIndex++
            }
        //    console.log(creep,"result", result,"pathidex",task.pathIndex)
            return gc.RESULT_UNFINISHED;

/*
            var nextStep =  this.nextStepIntoRoom(creep.pos, targetRoom)
            var nextStepPath = creep.pos.findPathTo(nextStep);
            if (OK == creep.move(nextStepPath[0].direction)) {
                task.pathIndex++
            }
            return gc.RESULT_UNFINISHED;
*/
      //  } else {
            console.log(creep,"Do nothing. Wait for next tick when the room changes.");
           // console.log(creep,"Waiting in move to room room", creep.room,"tartegt room",targetRoom,"!=currentroom",currentRoom);
          //  creep.say("waiting");
      //  }
    } else {
    //  console.log(creep,"TaskMoveRoom troomsToVisitt",task.roomsToVisit
    //        ,"this.roomName",this.roomName,"task.startRoom",task.startRoom,"task.startRoom",task.roomName);
      //  console.log(creep,"ttttttttttttttttttask",JSON.stringify(task));

       // task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        if ( task.roomsToVisit[task.pathIndex] !== undefined) {
            var exit = creep.pos.findClosestByPath(task.roomsToVisit[task.pathIndex].exit);
           // console.log(creep,"about to move toweards exit",exit,JSON.stringify(exit));
            creep.moveTo(exit);
        } else {
            return gc.RESULT_FINISHED;
        }

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

TaskMoveRoom.prototype.nextStepIntoRoomD = function(pos, nextRoom) {
    var x  = pos.x;
    var y= pos.y;
    var direction;
    if (pos.x == 0) {
        direction = LEFT;
    }
    if (pos.x == 49) {
        direction = RIGHT ;
    }
    if (pos.y == 0) {
        direction = TOP;
    }
    if (pos.y == 49) {
        direction = BOTTOM;
    }
    return direction
};

TaskMoveRoom.prototype.nextStepIntoRoomDD = function(pos, nextRoom) {
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




























