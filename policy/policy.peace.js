/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var stats = require("stats");

var policyDefence = require("policy.defence");
var policyFrameworks = require("policy.frameworks");
var raceBase = require("race.base");
var raceWorker = require("race.worker");
var roomOwned = require("room.owned");
var _ = require('lodash');
var policyBuildspawn = require("policy.buildspawn");
var roleBase = require("role.base");
var poolSupply = require("pool.supply");
var gc = require("gc");
var roleLinkerSource = require("role.linker.source");
var roleLinkerMinerStorage = require("role.linker.miner.storage");
var tasks = require("tasks");
var roleEnergyPorter = require("role.energy.porter");
var npcInvaderBattle = require("npc.invader.battle");
var roleStorageRepairer = require("role.storage.repairer");

/**
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module policyPeace
 */
var policyPeace = {
    REPAIR_THRESHOLD: 3,
    REPAIR_RATIO: 0.1,
    CONSTRUCTION_THRESHOLD: 100,
   
    /**
     * Called when at peace. Determins what the new polciy for the comming 
     * tick should be.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(oldPolicy) {
        var room =  Game.rooms[oldPolicy.room];
        if (!policyBuildspawn.spawnFound(oldPolicy))      {
            return policyFrameworks.createBuildspawn(room.name);
        }

        
        var policyMany2OneLinker = require("policy.many2one.linker");
        if ( policyMany2OneLinker.readyForMAny2OneLinker(oldPolicy)) {
            return policyFrameworks.createMany2OneLinkersPolicy(room.name
                , room.memory.links.fromLinks
                , room.memory.links.toLink
                ,true);
        }

        if (policyDefence.beingAttaced(room)) {
            return policyFrameworks.createDefendPolicy(room.name);
        }
        var policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
       // var policyConstruction = require("policy.construction");
        //if (policyConstruction.startConstruction(room)) {
       //     return policyFrameworks.createConstructionPolicy(room.name);
      //  }
        return oldPolicy;
    },
    
    switchPolicy: function(oldPolicy, newPolicy)
    {
        switch(oldPolicy.type) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.PEACE:
                break;
            case policyFrameworks.Type.POLICY_MANY2ONE_LINKERS:
                policy.breakUpLinks(oldPolicy);
                break;
            default:
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
    },

    initialisePolicy: function (newPolicy) {
        return true;
    },

    /**
    * Enact peace time policy. The main objective in peace time is to 
    * transger as much source energy to the rooms controller as possible.
    * <ul>
    * <li> Spawn a worker if enought energy avaliable.
    * <li> Determine the ratio of havesters, upgraders, builders and repaiers. 
    * <li> Move all the workers in the room.
    * </ul>
    * @function enactPolicy
    * @param   {Object} policy  The room that might need rescuing.
    * @returns {none} 
    */
    enactPolicy: function(currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        poolSupply.updateSupplyLevel(room.name
            ,roomOwned.calaculateSuplly(room)
            ,room.energyCapacityAvailable);
        var constructionLeft = roomOwned.getConstructionLeft(room);
        console.log(room,"constructoin left", constructionLeft);
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders = 0;
        var nHavesters = 0;
        var energy  = roomOwned.allSourcesEnergy(room) *5;
       // var toSupply = policy.supportBurden(room);
        var toSupply = poolSupply.getEnergyInBuildQueue(room);
        var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
        toSupply = Math.floor(Math.min(toSupply, supportable));

        console.log("Room can support", supportable,"workers for ",supportable*1000
            ,"energy and",supportable*5,"parts. Support burder is",toSupply,"workers.");
        if (toSupply > 0)
        {
            var nLinkers = 2;
            nHavesters = roomOwned.supportHavesters(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
             nUpgraders = roomOwned.supportUpgraders(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
        }  else {
             nHavesters = roomOwned.peaceHavesters(room,  policy.LINKING_WORKER_SIZE, true);
            if (constructionLeft < this.CONSTRUCTION_THRESHOLD)
                 nUpgraders = roomOwned.peaceUpgraders(room,  policy.LINKING_WORKER_SIZE, true);
            else
                 nBuilders = roomOwned.constructBuilders(room, policy.LINKING_WORKER_SIZE,  true);
        }
        
        var equilbriumCreeps = nHavesters + nUpgraders + nBuilders + toSupply;
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE
            < nWorkParts*policy.creepsAgeFactor(currentPolicy))
        {
            if (policy.energyStorageAtCapacity(room))
            {
                 nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            nHavesters = Math.max(Math.ceil(nHavesters), 2);
        }
        this.spawnCreep(room,currentPolicy, equilbriumCreeps);

        //Has not spawned but energy at capacty no need for havesters
        if (policy.energyStorageAtCapacity(room)){
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

        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);

      //  var freeForContractWork = Math.max(0, nCreeps - Math.ceil(nHavesters));// - numlinkers);
    //    policy.convertContractWorkers(room, currentPolicy, roleBase.Type.UPGRADER);
    },

    spawnCreep: function (room, currentPolicy, equilbriumCreeps){
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        
        var workerSizeToSpawn = raceWorker.spawnWorkerSize(room, (equilbriumCreeps) * 1000);
        
        console.log(room,"woreker size to spawn", workerSizeToSpawn);
        console.log(room,"equilbriumCreeps", equilbriumCreeps,"w size", workerSizeToSpawn
            , "<= nWorkePArts",nWorkParts, " || ncreeps"  ,nCreeps);
        if (equilbriumCreeps * workerSizeToSpawn >= nWorkParts || nCreeps < 2 )//|| room.name == "W26S21")
        {
            if (nCreeps < 3 * roomOwned.countSiteAccess(room, FIND_SOURCES)) {
                var spawns = room.find(FIND_MY_SPAWNS);
                raceBase.spawn(raceWorker
                    , currentPolicy
                    , spawns[0]
                    , workerSizeToSpawn);
            }
        }
    },
    

    attachCreep: function (creep, policyId, role)
    {
        Game.creeps[creep].memory.role = role;
        Game.creeps[creep].memory.employerId = policyId;
    }
}


module.exports = policyPeace;




































