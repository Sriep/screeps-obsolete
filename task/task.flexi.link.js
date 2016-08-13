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
    this.defensiveRetreat = false;
}

TaskFlexiLink.prototype.doTask = function(creep, task) {
    if (task.defensiveRetreat)
        if (tasks.defensiveRetreat(creep))
            return gc.RESULT_ROLLBACK;

    var flag = Game.flags[task.flagName];
    //console.log(creep,"in TaskFlexiLink.doTask flag",flag);
    if (!flag.memory.operator
        || creep.id != flag.memory.operator.id
        || undefined == flag.memory.linkType)
        initilise(creep,task,flag);

    if ((Game.time - flag.memory.operator.arrived) % gc.LINKER_RESET_RATE == 0 ) {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
  //  console.log(creep, "In TaskFlexiLink doTask linkType", flag.memory.linkType);
    creep.say(flag.memory.linkType);
    var moduleName = "task." + flag.memory.linkType;
    var taskModule = require(moduleName);

    return taskModule.prototype.doTask(creep, task);
};

var initilise = function(creep,task,flag) {
    if (!flag.memory.operator || creep.id != flag.memory.operator.id) {
        flag.memory.operator = {};
        flag.memory.operator.id = creep.id;
        flag.memory.operator.arrived = Game.time;
        flag.memory.operator.ageStarted = CREEP_LIFE_TIME - creep.ticksToLive;
    }
    if (!flag.memory.mainDumpId || undefined == flag.memory.linkType) {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: function(object) {
                return object.pos == creep.pos
                    && object.structureType == STRUCTURE_CONTAINER;
            }
        });
        if (undefined !== sites[0])
            flag.memory.mainDumpId = sites[0].id;
        flag.memory.linkType = gc.LINKER_BUILD;
    }
};

TaskFlexiLink.prototype.resetState = function (creep, task) {
    var TaskFindMoveLinkerPos = require("task.find.move.linker.pos");
    return TaskFindMoveLinkerPos.prototype.doTask(creep, task);
};

TaskFlexiLink.prototype.help = function () {
    return gc.RESULT_FINISHED;
};

TaskFlexiLink.prototype.transfer = function (creep,flag,link) {
    return creep.transfer(link, flag.memory.resourceType);
}

module.exports = TaskFlexiLink;

// flag.memory.mainDumpId
// flag.memory.mainDumpType
// flag.memory.alternateLinkId
// flag.memory.alternateLinkType
// flag.memory.operateLink
// flag.memory.transferLink



















