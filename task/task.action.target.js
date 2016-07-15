/**
 * Created by Piers on 14/07/2016.
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

/**
 * Task move object. Used when we need to find the object to move to.
 * @module tasksHarvest
 */

function TaskActionTarget (action) {
    this.taskType = gc.TASK_ACTION_TARGET;
    this.conflicts = action;
    this.loop = true;
    this.pickup = true;
}

TaskActionTarget.prototype.doTask = function(creep, task) {
    var target =  Game.getObjectById(tasks.getTargetId(creep));
    if (!target) {
        return gc.RESULT_FINISHED;
    }
  //  console.log("in TaskActionTarget", task["conflicts"],JSON.stringify(task));
    var rtv = creep[task.conflicts](target);
    console.log
    if (rtv == OK) {
        return gc.RESULT_FINISHED;
    } else {
        return gc.RESULT_ROLLBACK;
    }

};

module.exports = TaskActionTarget;