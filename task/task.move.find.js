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

/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMoveFind (findMethod, range, method , module, moveToOpts) {
    this.taskType = gc.TASK_MOVE_FIND;
    this.conflicts = gc.MOVE;
    this.method = findMethod;
    this.findId = method;
    this.findObject = method;
    this.findStructure = method;
    this.findFilter = method;
    this.findFunction = method;
    this.findModule = module;
    if (undefined === range)
        range =1;
    else
        this.range = range;
    this.moveToOpts = moveToOpts;
    this.loop = true;
    this.pickup = true;
}

TaskMoveFind.prototype.FindMethod = {
    FindId: gc.FIND_ID,
    FindRoomObject: gc.FIND_ROOM_OBJECT ,
    FindStructure: gc.FIND_STRUCTURE,
    FindFilter: gc.FIND_FILTER,
    FindFunction: gc.FIND_FUNCTION
};

TaskMoveFind.prototype.doTask = function(creep, task, actions) {
   // console.log(creep,"In TaskMoveFind method", task.method, "task.findid"
   //     , task.findId,"target id",tasks.getTargetId(creep) );
   // console.log(creep,"fove find",task.findFunction,"module",task.findModule);
    //tasks.setTargetId(creep, undefined);
    var target = undefined;
    if (task.method != this.FindMethod.FindId)  {
        if (tasks.getTargetId(creep)) {
            target = Game.getObjectById(tasks.getTargetId(creep));
        } else {
       //     console.log("In move find removing cashed id",tasks.getTargetId(creep))
            tasks.setTargetId(creep, undefined);
        }
    }

    if (!target) {
     //   console.log(creep,"no target look for one method",task.method);
        switch (task.method) {
            case this.FindMethod.FindId:
                target = Game.getObjectById(task.findId);
          //      console.log(creep,"case this.FindMethod.FindId",task.findId,"target",target);
                break;
            case this.FindMethod.FindRoomObject:
                //target = creep.pos.findClosestByPath(task.findObject);
                target = creep.pos.findClosestByRange(task.findObject);
             //   console.log(creep,"movefind find room objet", target);
                break;
            case this.FindMethod.FindStructure:
               // target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES
               //     , {filter: {structureType: task.findStructure}});
                target = creep.pos.findClosestByRange(FIND_STRUCTURES
                    , {filter: {structureType: task.findStructure}});
                break;
            case this.FindMethod.FindFilter:
               // target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES
               //     , {filter: task.findFilter});
                target = creep.pos.findClosestByRange(FIND_STRUCTURES
                    , {filter: task.findFilter});
                break;
            case this.FindMethod.FindFunction:
                var module = require(task.findModule);
                target = module[task.findFunction](creep);
            //    console.log(creep,"find function returned",target);
                break;
            default:
                console.log(creep,"Invalid find method");
            //Unreachable
        }
       // console.log(creep,"TaskMoveFind do target is", target, "method is", task.method);
        if (target)
            tasks.setTargetId(creep, target.id);
    }
    if (!target) {
       // console.log(creep,"find RESULT_FINISHED and cound not find any target")
      //  creep.say("No target");
        return gc.RESULT_FINISHED;
    }
  //  console.log(creep,"movefind target", target);

    var distanceToGo = creep.pos.getRangeTo(target);
    if (distanceToGo <= task.range) {
      //  console.log(creep,"find RESULT_FINISHED before move");
     //   console.log(creep,"distanceToGo",distanceToGo,"<= range",task.range)
      //  creep.say("there");
        return gc.RESULT_FINISHED;
    }

    var result = creep.moveTo(target);
    distanceToGo = creep.pos.getRangeTo(target);
    if (distanceToGo <= task.range) {
     //  console.log(creep,"find RESULT_FINISHED; after move range <= abut ");
       // creep.say("There");
        return gc.RESULT_FINISHED;
    }  else {
      // console.log(creep,"find RESULT_UNFINISHED after move range <= abut to");
      //  creep.say("Moving");
        switch (result) {
            case OK:    //	0	The operation has been scheduled successfully.
            case ERR_TIRED: //	-11	The fatigue indicator of the creep is non-zero.
                return gc.RESULT_UNFINISHED;
            case ERR_INVALID_TARGET:    //	-7	The target provided is invalid.
            case ERR_NO_PATH:   //	-2	No path to the target could be found.
                return gc.RESULT_ROLLBACK;
            case ERR_NOT_OWNER: //	-1	You are not the owner of this creep.
            case ERR_BUSY:  //	-4	The creep is still being spawned.
            case ERR_NO_BODYPART: //	-12	There are no MOVE body parts in this creep’s body.
            default:
                return gc.RESULT_FINISHED;
        }


        return gc.RESULT_UNFINISHED;
    }
};

module.exports = TaskMoveFind;




























