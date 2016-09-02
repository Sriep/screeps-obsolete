/**
 * Created by Piers on 15/08/2016.
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
var TaskMoveRoom = require("task.move.room");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module TaskFollow
 */

function TaskFollow (targetId, customMoveToFunction, functionModule) {
    this.taskType = gc.TASK_FOLLOW;
    this.conflicts = gc.MOVE;
    this.targetId = targetId;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule
    this.heal = true;
    this.loop = true;
    this.pickup = true;
}

TaskFollow.prototype.doTask = function(creep, task) {
    var target = Game.getObjectById(task.targetId)
    if (!target) return gc.RESULT_FINISHED
    console.log(creep,"TaskFollow",target);
    if (!target) return gc.RESULT_FINISHED;
    if (target.room == creep.room) {
        var result;
        if (task.customMoveToFunction) {
            if(task.functionModule) {
                var fModule = require(task.functionModule);
                result = fModule[task.customMoveToFunction](creep, target);
            } else {
                result = task.customMoveToFunction(creep, target);
            }
        } else {
            result = creep.moveTo(target);
        }

        //creep.moveTo(target);
    } else {
        task.roomName = target.room;
        //console.log(creep,"follow targt",target,target.room, target.pos.roomName)
        TaskMoveRoom.prototype.doTask(creep, task);
    }
    if (creep.getActiveBodyparts(HEAL) > 0) {
        tasks.heal(creep);
    }
    return  gc.RESULT_UNFINISHED;
};

module.exports = TaskFollow;




























