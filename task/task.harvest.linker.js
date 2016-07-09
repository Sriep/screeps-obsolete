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
    this.targetLinkId = targetLineId;
    this.pickup = true;
    this.loop = true;
}

TaskHarvestLinker.prototype.doTask = function(creep, task) {
    var source =  Game.getObjectById(task.sourceId);
    if (!source) {
        creep.say("help source");
        return gc.RESULT_FAILED;
    }
    creep.harvest(source)
    var sourceLink = Game.getObjectById(task.homeLinkId);
    if (!sourceLink) {
        creep.say("help link");
        return gc.RESULT_FAILED;
    }
    creep.transfer(sourceLink, RESOURCE_ENERGY);
    var targetLink = Game.getObjectById(task.targetLinkId);
    if (!targetLink) {
        creep.say("help link");
        return gc.RESULT_FAILED;
    }
    sourceLink.transferEnergy(targetLink);
    return gc.RESULT_UNFINISHED;
};

module.exports = TaskHarvestLinker;



















