/**
 * Created by Piers on 02/08/2016.
 */

/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
var policy = require("policy");
var policyFrameworks = require("policy.frameworks");

/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module economyCentral
 */
var economyCentral = {


    calculateAndAssignRoles: function (room, currentPolicy) {
        var constructionLeft = roomOwned.getConstructionLeft(room);
        //    console.log(room,"constructoin left", constructionLeft);
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders = 0;
        var nHavesters = 0;
        var energy = roomOwned.allSourcesEnergy(room) * 5;
        // var toSupply = policy.supportBurden(room);
        var toSupply = poolSupply.getEnergyInBuildQueue(room);
        var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
        toSupply = Math.floor(Math.min(toSupply, supportable));

        //  console.log("Room can support", supportable,"workers for ",supportable*1000
        //      ,"energy and",supportable*5,"parts. Support burder is",toSupply,"workers.");
        if (toSupply > 0) {
            var nLinkers = 2;
            nHavesters = roomOwned.supportHavesters(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            nUpgraders = roomOwned.supportUpgraders(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
        } else {
            nHavesters = roomOwned.peaceHavesters(room, policy.LINKING_WORKER_SIZE, true);
            if (constructionLeft < this.CONSTRUCTION_THRESHOLD)
                nUpgraders = roomOwned.peaceUpgraders(room, policy.LINKING_WORKER_SIZE, true);
            else
                nBuilders = roomOwned.constructBuilders(room, policy.LINKING_WORKER_SIZE, true);
        }

        var equilbriumCreeps = nHavesters + nUpgraders + nBuilders + toSupply;
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
        });
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE
            < nWorkParts * policy.creepsAgeFactor(currentPolicy)) {
            if (policy.energyStorageAtCapacity(room)) {
                nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            nHavesters = Math.max(Math.ceil(nHavesters), 2);
        }
        this.spawnCreep(room, currentPolicy, equilbriumCreeps);

        //Has not spawned but energy at capacty no need for havesters
        if (policy.energyStorageAtCapacity(room)) {
            nHavesters = 0;
        }
        //Limit to one harvester if only one access point
        if (1 == roomOwned.countSiteAccess(room, FIND_SOURCES)) {
            nHavesters = Math.min(1, nHavesters);
        }
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        }
        if (constructionLeft < this.CONSTRUCTION_THRESHOLD)
            nUpgraders = nCreeps - nHavesters - nRepairers - nBuilders;
        else
            nBuilders = nCreeps - nHavesters - nRepairers - nUpgraders;

        console.log("Enact Peace with links roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers
            , "total creeps", nCreeps);

        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders, nRepairers);

        //  var freeForContractWork = Math.max(0, nCreeps - Math.ceil(nHavesters));// - numlinkers);
        //    policy.convertContractWorkers(room, currentPolicy, roleBase.Type.UPGRADER);
    },

    spawnCreep: function (room, currentPolicy, equilbriumCreeps) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
        });
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);

        var workerSizeToSpawn = raceWorker.spawnWorkerSize(room, (equilbriumCreeps) * 1000);

        //  console.log(room,"woreker size to spawn", workerSizeToSpawn);
        // console.log(room,"equilbriumCreeps", equilbriumCreeps,"w size", workerSizeToSpawn
        //      , "<= nWorkePArts",nWorkParts, " || ncreeps"  ,nCreeps);
        if (equilbriumCreeps * 5 >= nWorkParts && nCreeps <= 4)//|| room.name == "W26S21")
        {
            if (nCreeps <= 3 * roomOwned.countSiteAccess(room, FIND_SOURCES)) {
                var spawns = room.find(FIND_MY_SPAWNS);
                raceBase.spawn(raceWorker
                    , currentPolicy
                    , spawns[0]
                    , workerSizeToSpawn);
            }
        }
    },



};

module.exports = economyCentral;


