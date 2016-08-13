/**
 * Created by Piers on 12/08/2016.
 */
var mineralLinkStorage = function(creep, task) {
    var transferEnergy = creep.carry.energy != 0;
    var mineral =  Game.getObjectById(task.mineralId);

    var dump = Game.getObjectById(task.dumpId);
    creep.harvest(mineral);

    var link = Game.getObjectById(task.linkId)
    creep.withdraw(link, RESOURCE_ENERGY);

    if (transferEnergy) {
        creep.transfer(dump, RESOURCE_ENERGY);
    } else {
        creep.transfer(dump, flag.memory.resourceType);
    }
};