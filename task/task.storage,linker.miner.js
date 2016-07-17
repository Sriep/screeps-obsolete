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
    this.taskType = gc.TASK_HARVEST_STORAGE_LINK_MINER;
    this.conflicts = gc.HARVEST;
    this.storageId = storageId;
    this.storageLinkId = storageLinkId;
    this.mineralId = mineralId;
    this.resourceMined = resourceMined;
    this.pickup = true;
    this.loop = true;
}

TaskStorageLinkerMiner.prototype.doTask = function(creep, task) {

  //  console.log(creep,"storageId",task.storageId
   //                 ,"storageLinkId",task.storageLinkId
   //                 ,"mineralId",task.mineralId)
    var transferEnergy;
    if (creep.carry.energy != 0) {
        transferEnergy = true
    } else {
        transferEnergy = false
    }

    var storageLink =  Game.getObjectById(task.storageLinkId);
    if (!storageLink) {
        console.log(creep,"cant find link", "id",task.storageLinkId,storageLink
            , "id mineral",task.mineralId, mineral );
    }

    var mineral =  Game.getObjectById(task.mineralId);
    if (!mineral) {
        console.log(creep,"cant find mineral","id", task.mineralId,mineral);
       // creep.say("help source");
       // return gc.RESULT_FAILED;
    }

    creep.harvest(mineral);


    storageLink.transferEnergy(creep);

    var storage = Game.getObjectById(task.storageId);
    if (!storage) {
        console.log(creep,"cant find storage", "id",task.storageId,storage);
        creep.transfer(storageLink, RESOURCE_ENERGY);
    } else {
        if (transferEnergy) {
            creep.transfer(storage, RESOURCE_ENERGY);
        } else {
            creep.transfer(storage, task.resourceMined);
        }
    }
};

module.exports = TaskStorageLinkerMiner;
/**
 * Created by Piers on 07/07/2016.
 */


















