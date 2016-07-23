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

/**
 * Task harvest object.
 * @module TaskLinkerBuild
 */


function TaskLinkerBuild (flagName) {
    this.taskType = gc.TASK_FLEXI_LINK;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerBuild.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);
    creep.harvest(source);

    var site = Game.getObjectById(flag.memory.mainDumpId);
    if (!site)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.build(dump);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerBuild;





































