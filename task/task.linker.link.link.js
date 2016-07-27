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
    //console.log(creep, "inTaskLinkerLinkLink");
    var flag = Game.flags[task.flagName];
    var source =  Game.getObjectById(task.flagName);
    if (!source) return TaskFlexiLink.prototype.help(creep, task);

    creep.harvest(source);

    var link = Game.getObjectById(flag.memory.mainDumpId);
    if (!link)  {
        //console.log(creep,"no link",link,flag.memory.mainDumpId)
        return TaskFlexiLink.prototype.resetState(creep, task);
    }
   // cosole.log(creep,"invalid transfer args", link,flag.memory.resource );
    var result =  TaskFlexiLink.prototype.transfer(creep,flag,link);
    //var result = creep.transfer(link, flag.memory.resourceType);
   // console.log(creep,"result of transfer to link",result);
    //creep.say(result);
    return gc.RESULT_UNFINISHED
};

module.exports = TaskLinkerLinkLink;





























