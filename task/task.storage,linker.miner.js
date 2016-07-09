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


function TaskStorageLinkerMiner (storageId, storageLinkId, mineralId, resourceMined) {
    this.taskType = gc.TASK_HARVEST_LINK;
    this.conflicts = gc.HARVEST;
    this.storageId = storageId;
    this.storageLinkId = storageLinkId;
    this.mineralId = mineralId;
    this.resourceMined = resourceMined;
    this.pickup = true;
    this.loop = true;
}

TaskStorageLinkerMiner.prototype.doTask = function(creep, task) {
    var mineral =  Game.getObjectById(task.mineralId);
    if (!mineral) {
        creep.say("help source");
        return gc.RESULT_FAILED;
    }
    creep.harvest(mineral);
    var storageLink =  Game.getObjectById(task.storageLinkId);
    if (storageLink) {
        storageLink.transferEnergy(creep);
    }
    var storage = Game.getObjectById(task.storageId);
    if (!storage) {
        creep.transfer(storageLink, RESOURCE_ENERGY);
    } else {
        creep.transfer(storage, RESOURCE_ENERGY);
        creep.transfer(storage, task.resourceMined);
    }
};

module.exports = TaskStorageLinkerMiner;
/**
 * Created by Piers on 07/07/2016.
 */