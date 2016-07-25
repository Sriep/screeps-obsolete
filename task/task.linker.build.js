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
var TaskFlexiLink = require("task.flexi.link");

/**
 * Task harvest object.
 * @module TaskLinkerBuild
 */


function TaskLinkerBuild (flagName) {
    this.taskType = gc.TASK_LINKER_BUILD;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerBuild.prototype.doTask = function(creep, task) {
  //  console.log(creep,"TaskLinkerBuild.doTask")
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);
    creep.harvest(source);

    var site = Game.getObjectById(flag.memory.mainDumpId);
    console.log(creep,"TaskLinkerBuild site", site);
    if (!site)  {
        console.log(creep,"TaskLinkerBuild !site is true about to call resetStats");
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.build(site);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerBuild;





































