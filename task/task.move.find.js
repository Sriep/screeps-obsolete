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

function TaskMoveFind (findMethod, method, range , module, moveToOpts) {
    this.task = gc.TASK_MOVE_FIND;
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
   // console.log(creep,"In TaskMoveFind");
    if (actions.isConflict(gc.MOVE))
        return tasks.Result.Unfinished;
    var target;
    if (task.method != this.FindMethod.FindId && tasks.getTargetId(creep)) {
        target = Game.getObjectById(tasks.getTargetId(creep));
    } else {
        switch (task.method) {
            case this.FindMethod.FindId:
                target = Game.getObjectById(task.findId);
                break;
            case this.FindMethod.FindRoomObject:
                target = creep.pos.findClosestByPath(task.findObject);
                break;
            case this.FindMethod.FindStructure:
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES
                    , {filter: {structureType: task.findStructure}});
                break;
            case this.FindMethod.FindFilter:
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES
                    , {filter: task.findFilter});
                break;
            case this.FindMethod.FindFunction:
                var module = require(task.findModule);
                target = module[task.findFunction](creep);
                break;
            default:
            //Unreachable
        }
        tasks.setTargetId(creep, target.id);
    }

    var range = creep.pos.getRangeTo(target);
    if (range <= task.range)
        return tasks.Result.Finished;
    creep.moveTo(target);
    actions.done(gc.MOVE);
    if (range <= task.range)
        return tasks.Result.Finished;
    else 
        return tasks.Result.Unfinished;

}

module.exports = TaskMoveFind;




























