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


function TaskStorageLinker (storageId, storageLinkId) {
    this.taskType = gc.TASK_HARVEST_LINK;
    this.conflicts = gc.HARVEST;
    this.storageId = storageId;
    this.storageLinkId = storageLinkId;
    this.pickup = true;
    this.loop = true;
}

TaskStorageLinker.prototype.doTask = function(creep, task) {
    var storageLink =  Game.getObjectById(task.storageLinkId);
    if (!storageLink) {
        creep.say("help link!");
        return gc.RESULT_FAILED;
    }
    storageLink.transferEnergy(creep);
    var storage = Game.getObjectById(task.storageId);
    if (!storage) {
        creep.say("help storage!");
        return gc.RESULT_FAILED;
    }
    creep.transfer(storage, RESOURCE_ENERGY);
};

module.exports = TaskStorageLinker;
/**
 * Created by Piers on 07/07/2016.
 */
