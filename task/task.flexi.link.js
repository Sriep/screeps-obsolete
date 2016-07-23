/**
 * Created by Piers on 22/07/2016.
 */
/**
 * Created by Piers on 22/07/2016.
 */
/**
 * Created by Piers on 07/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var TaskFindMoveLinkerPos = require("rask.find.move.linker.pos");
/**
 * Task harvest object.
 * @module tasksHarvest
 */


function TaskFlexiLink (flagName) {
    this.taskType = gc.TASK_FLEXI_LINK;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskFlexiLink.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    if (!flag.memory.operator || creep.id != flag.memory.operator.id)
        initilise(creep.task);
    var moduleName = "task." + flag.memory.linkType;
    var taskModule = require(moduleName);
    return taskModule.prototype.doTask(creep, task);
};

var initilise = function(creep,task) {
    flag.memory.operator = {};
    flag.memory.operator.id = creep.id;
    flag.memory.operator.arrived = Game.time;
    flag.memory.operator.ageStarted = CREEP_LIFE_TIME - creep.ticksToLive;

    if (!flag.memory.mainDumpId) {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
    }
};

TaskFlexiLink.prototype.resetState = function (creep, task) {
    return TaskFindMoveLinkerPos.prototype.doTask(creep, task);
};

TaskFlexiLink.prototype.help = function () {
    return gc.RESULT_FINISHED;
};

module.exports = TaskFlexiLink;

// flag.memory.mainDumpId
// flag.memory.mainDumpType
// flag.memory.alternateLinkId
// flag.memory.alternateLinkType
// flag.memory.operateLink
// flag.memory.transferLink



















