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
var TaskLinkerDump = require("task.linker.dump");
var roomBase = require("room.base");
/**
 * Task harvest object.
 * @module TaskLinkerRepairDump
 */


function TaskLinkerRepairDump (flagName) {
    this.taskType = gc.TASK_FLEXI_LINK;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerRepairDump.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    var container = Game.getObjectById(flag.memory.mainDumpId);
    if (!container || container.structureType != STRUCTURE_CONTAINER ) {
        TaskFlexiLink.prototype.resetState(creep, task);
    }
    var timeOperating = Game.time - flag.memory.operator.ageStarted;
    var workParts = creep.getActiveBodyparts(WORK);
    var repairInterval;
    if (roomBase.isMyRoom(creep.room.name)) {
        repairInterval = 10 * workParts;
    } else {
        repairInterval = 2 * workParts;
    }
    if ( timeOperating % repairInterval == 0 ) {
        creep.repair(container);
    } else {
        TaskLinkerDump.prototype.doTask(creep, task);
    }
};

module.exports = TaskLinkerRepairDump;