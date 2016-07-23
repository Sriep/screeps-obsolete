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
 * @module TaskLinkerDumpLinkDump
 */


function TaskLinkerDumpLinkDump (flagName) {
    this.taskType = gc.TASK_FLEXI_LINK;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerDumpLinkDump.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    var transferEnergy = creep.carry.energy != 0;

    var mineral =  Game.getObjectById(task.flagName);
    if (!mineral) return TaskFlexiLink.prototype.help(creep, task);

    var dump = Game.getObjectById(flag.memory.mainDumpId);
    if (!dump)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    if (dump.structureType != STRUCTURE_STORAGE) {
        creep.harvest(mineral);
    } else if (_.sum(dump.store) < 0.8 *  dump.storeCapacity) {
        creep.harvest(mineral);
    }

    var link = Game.getObjectById(flag.memory.alternateLinkId)
    if (!link)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.withdraw(link, RESOURCE_ENERGY);

    if (transferEnergy) {
        creep.transfer(storage, RESOURCE_ENERGY);
    } else {
        creep.transfer(storage, flag.memory.resourceType);
    }
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskLinkerDumpLinkDump;






























