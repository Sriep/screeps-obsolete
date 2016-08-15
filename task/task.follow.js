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
var TaskMoveXY = require("task.move.xy");
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
    this.functionModule = functionModule;
    this.loop = true;
    this.pickup = true;
}

TaskFollow.prototype.doTask = function(creep, task) {
    var target = Game.getObjectById(task.targetId);
    if (!target) return gc.RESULT_FINISHED;
    if (target.room == creep.room) {
        creep.moveTo(target);
    } else {
        this.roomName = creep.room;
        TaskMoveRoom.prototype.doTask(creep, task, task.customMoveToFunction, task.functionModule);
    }
    return  gc.RESULT_UNFINISHED;
};

module.exports = TaskFollow;




























