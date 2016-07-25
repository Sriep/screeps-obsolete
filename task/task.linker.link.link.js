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
 * @module TaskLinkerLinkLink
 */


function TaskLinkerLinkLink (flagName) {
    this.taskType = gc.TASK_LINKER_LINK_LINK;
    this.conflicts = gc.HARVEST;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskLinkerLinkLink.prototype.doTask = function(creep, task) {
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);

    creep.harvest(source);

    var link = Game.getObjectById(flag.memory.mainDumpId);
    if (!link)  {
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
    creep.transfer(link, Game.flags[flagName].memory.resource);

    var linkFlag = Game.flags[flag.memory.mainDumpId];
    if (linkFlag) {
        var nextLinkId = linkFlag.memory.sendToLinkId;
        if (!nextLinkId) {
            var links = creep.room.find(FIND_STRUCTURES, {
                filter: function(object) {
                    return object.id != flag.memory.mainDumpId;
                }
            });
            if (links.length > 0) {
                nextLinkId == links[0];
            } else {
                return gc.RESULT_UNFINISHED;
            }
        }
        link.transferEnergy(nextLinkId);
        return gc.RESULT_UNFINISHED
    }
    return TaskFlexiLink.prototype.resetState(creep, task);
};

module.exports = TaskLinkerLinkLink;





























