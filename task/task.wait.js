/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module TaskWait
 */

function TaskWait (whatFor, moduleName,turns) {
    this.taskType = gc.TASK_WAIT;
    this.conflicts = gc.MOVE;
    this.whatFor = whatFor;
    if ( undefined === whatFor )
    {
        this.whatFor = function() {return true;};
    }
    this.moduleName = moduleName;
    this.turns = turns;
    this.heal = true;
    this.loop = false;
    this.pickup = true;
}

TaskWait.prototype.doTask = function(creep, task) {

    if (task.turns !== undefined) {
        if ( 0 == task.turns)
            return gc.RESULT_FINISHED;
        else {
            task.turns--
            return gc.RESULT_UNFINISHED;
        }
    }

    if (undefined !== task.moduleName) {
        var module;
        module = require(task.moduleName);
        if (typeof module[task.whatFor]== "function") {
            if (module[task.whatFor](creep)) {
                return gc.RESULT_FINISHED;
            } else {
                return gc.RESULT_UNFINISHED
            }
        } else {
            console.log(creep,"inWait waitFunc is not a function");
            return gc.RESULT_UNFINISHED;
        }
    } else {
        if (typeof task.whatFor== "function") {
            if (task.whatFor(creep)) {
                return gc.RESULT_FINISHED;
            } else {
                return gc.RESULT_UNFINISHED
            }
        } else {
            console.log(creep,"inWait waitFunc is not a function");
            return gc.RESULT_UNFINISHED;
        }
    }
};

module.exports = TaskWait;





























