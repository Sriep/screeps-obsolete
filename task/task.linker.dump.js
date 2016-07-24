/**
 * Created by Piers on 22/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var TaskFlexiLink = require("rask.flexiLink");

/**
 * Task harvest object.
 * @module TaskLinkerDump
 */


function TaskLinkerDump (flagName) {
    this.taskType = gc.TASK_LINKER_DUMP;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerDump.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);
    creep.harvest(source);

    var dump = Game.getObjectById(flag.memory.mainDumpId);
    if (!dump)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.transfer(dump, Game.flags[flagName].memory.resource);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerDump;






































