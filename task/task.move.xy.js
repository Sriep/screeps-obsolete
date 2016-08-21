/**
 * Created by Piers on 06/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");

/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskMoveXY (x, y, range, customMoveFunction, functionModule, finsihCondition, finishModule) {
    this.taskType = gc.TASK_MOVE_XY;
    this.conflicts = gc.MOVE;
    this.x = x;
    this.y = y;
    if (range === undefined) {
        this.range = 0;
    } else {
        this.range =range;
    }
    this.customMoveFunction = customMoveFunction;
    this.functionModule = functionModule;
    this.finsihCondition = finsihCondition;
    this.finishModule = finishModule;
    this.loop = true;
    this.pickup = true;
}

TaskMoveXY.prototype.doTask = function(creep, task) {
    if (task.finsihCondition) {
        var module = require(task.finishModule);
        var rtv = module[task.finsihCondition](creep);
        if (rtv) return rtv;
    }
    var result;
    if (task.customMoveToFunction) {
       // console.log(creep,"customMoveToFunction",JSON.stringify(task));
        var xy = new RoomPosition( task.x, task.y, creep.pos.roomName );
        if(task.functionModule) {
            var fModule = require(task.functionModule);
            result = fModule[task.customMoveToFunction](creep, xy);
        } else {
            result = task.customMoveToFunction(creep, xy);
        }
    } else {
        result = creep.moveTo(task.x,task.y);
    }

   // console.log(creep,"TaskMoveXY",result);
    //creep.say(result);
    switch (result) {
        case OK:    	            //0	The operation has been scheduled successfully.
            if (creep.pos.inRangeTo(task.x,task.y,task.range)) {
                return gc.RESULT_FINISHED;
            } else {
                return gc.RESULT_UNFINISHED;
            }
        case ERR_TIRED:             //-11	The fatigue indicator of the creep is non-zero.
            return gc.RESULT_UNFINISHED;
        case ERR_NOT_OWNER:	        //-1	You are not the owner of this creep.
        case ERR_BUSY:	            //-4	The creep is still being spawned.
        case ERR_NO_BODYPART:	    //-12	There are no MOVE body parts in this creep’s body.
        case ERR_INVALID_TARGET:	//-7	The target provided is invalid.
        case ERR_NO_PATH:	        //-2	No path to the target could be found.
        default:
            return gc.RESULT_UNFINISHED;
    }
};

module.exports = TaskMoveXY;

























