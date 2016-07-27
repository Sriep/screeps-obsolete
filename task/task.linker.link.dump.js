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
 * @module TaskLinkerLinkDump
 */


function TaskLinkerLinkDump (flagName) {
    this.taskType = gc.TASK_LINKER_LINK_DUMP;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerLinkDump.prototype.doTask = function(creep, task) {
   // console.log(creep,"TaskLinkerLinkDump");
    var flag = Game.flags[task.flagName];

    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);

    var dump = Game.getObjectById(flag.memory.mainDumpId);
    if (!dump)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    if (dump.structureType != STRUCTURE_STORAGE) {
        creep.harvest(source);
    } else if (_.sum(dump.store) < 0.8 *  dump.storeCapacity) {
        creep.harvest(source);
    }

    var link = Game.getObjectById(flag.memory.alternateLinkId)
    if (!link)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.withdraw(link, RESOURCE_ENERGY);
    creep.transfer(dump, RESOURCE_ENERGY);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerLinkDump;






















