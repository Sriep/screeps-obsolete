/**
 * Created by Piers on 06/07/2016.
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

function TaskMovePos (x, y) {
    this.task = gc.TASK_MOVE_XY;
    this.x = x;
    this.y = y;
    this.loop = true;
    this.pickup = true;
}

TaskMoveFind.prototype.doTask = function(creep, task, actions) {
    if (actions.isConflict(gc.MOVE))
        return tasks.Result.Unfinished;
    switch (creep.moveTo(task.x,task.y)) {
        case OK:    	            //0	The operation has been scheduled successfully.
            actions.done(gc.MOVE);
            if (creep.pos.x == task.x &&  creep.pos.y == task.y)
                task.loop = false;
            return tasks.Result.Finished;
        case ERR_TIRED:             //-11	The fatigue indicator of the creep is non-zero.
            return tasks.Result.Unfinished;
        case ERR_NOT_OWNER:	        //-1	You are not the owner of this creep.
        case ERR_BUSY:	            //-4	The creep is still being spawned.
        case ERR_NO_BODYPART:	    //-12	There are no MOVE body parts in this creep’s body.
        case ERR_INVALID_TARGET:	//-7	The target provided is invalid.
        case ERR_NO_PATH:	        //-2	No path to the target could be found.
        default:
            return tasks.Result.Failed;
    }
};


module.exports = TaskMoveFind;




























