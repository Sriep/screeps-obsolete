/**
 * Created by Piers on 07/07/2016.
 */
/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var tasks = require("tasks");

/**
 * Task harvest object.
 * @module tasksHarvest
 */


function TaskHarvestLinker (sourceId, homeLinkId, targetLinkId) {
    this.taskType = gc.TASK_HARVEST_LINK;
    this.conflicts = gc.HARVEST;
    this.sourceId = sourceId;
    this.homeLinkId = homeLinkId;
    this.targetLinkId = targetLinkId;
    this.pickup = true;
    this.loop = true;
}

TaskHarvestLinker.prototype.doTask = function(creep, task) {
    //console.log(creep,"TaskHarvestLinker")
    var source =  Game.getObjectById(task.sourceId);
    if (!source) {
        console.log(creep,"no source")
        creep.say("help source");
        return gc.RESULT_FINISHED;
    }
    var hrtv = creep.harvest(source)
 //   console.log(creep,"harvest result",hrtv);
    var sourceLink = Game.getObjectById(task.homeLinkId);
    if (!sourceLink) {
        console.log(creep,"no from link")
        creep.say("help link");
        return gc.RESULT_FINISHED;
    }
    creep.transfer(sourceLink, RESOURCE_ENERGY);
    var targetLink = Game.getObjectById(task.targetLinkId);
    if (!targetLink) {
        console.log(creep,"no to link")
        creep.say("help link");
        return gc.RESULT_FINISHED;
    }
    var result = sourceLink.transferEnergy(targetLink);
    console.log(creep,"transfer result",result);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskHarvestLinker;



















