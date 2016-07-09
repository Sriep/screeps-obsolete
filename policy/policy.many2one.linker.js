/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Set up linkers.
 * @author Piers Shepperson
 */

/**
 * Abstract Policy
 * @module policyRescue
 */
var policyGiftWorkers = {

    initilisePolicy: function (newPolicy) {
        return true;
    },

    draftNewPolicyId: function(oldPolicy) {
        //return null;
        return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
    },

    clearCreep: function(creep) {
    },

    cleanUp: function(oldPolicy)
    {
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
        "use strict";
        switch(oldPolicy.type) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.PEACE:
            default:
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
    },

    enactPolicy: function(currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        var room = Game.rooms[currentPolicy.room];
        //Turn everyone into energy
        //Calculate current workers vrs needed workers.
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
                && ( creep.memory.role == gc.ROLE_HARVESTER
                || creep.memory.role == gc.ROLE_BUILDER
                || creep.memory.role == gc.ROLE_UPGRADER
                || creep.memory.role == gc.ROLE_ENERGY_PORTER );
        });
        var energyCost = 0;
        for (var i in creeps) {
            if (creep[i].memory.role != gc.ROLE_ENERGY_PORTER) {
                creep[i].memory.role = gc.ROLE_ENERGY_PORTER;
                creep[i].memory.tasks.tasklist = roleEnergyPorter.moveTaskList(creep[i]);
                tasks.setTargetId(creep[i],undefined);
            }
            energyCost += roomOwned.getEnergyFromBody(creep[i].body);
        }
        //Build if necessary
        // 200 = getEnergyFromBody([MOVE, WORE, CARRY]) a minimum sized worker.
        var porterSize = 11; // well why not
        var existingPorterParts = energyCost / 200;
        var portersNoBurderEnergyLT = roomOwned.energyLifeTime(myroom, 1,  gc.ROLE_ENERGY_PORTER);
        var externalCommitments = poolSupply.getEnergyInBuildQueue();
        var sourceEnergyLT  = roomOwned.allSourcesEnergy(room) *5;
        var endergyBuildLinkersAndRepairer = 4*1000;
        var EnergyForUpgradeing = sourceEnergyLT - endergyBuildLinkersAndRwpairer - externalCommitments;
        var numPortersPartsNeeded = Math.max(1,EnergyForUpgradeing / portersNoBurderEnergyLT);

        var porterShortfall = numPortersPartsNeeded - existingPorterParts
        if(  porterSize < porterShortfalls || existingPorterParts < porterSize) {
            var body = raceWorker.body(porterSize * 200);
            var spawns = room.find(FIND_MY_SPAWNS);
            var name = stats.createCreep(spawns[0], body, undefined, currectPolicy.id);
        } else if (externalCommitments) {
            var nextBuildItem  = room.memory.nextRequisition(room);
            name = stats.createCreep(spawns[0], nextBuildItem.body, undefined, currectPolicy.id);
        }

    }

}

module.exports = policyGiftWorkers;







































