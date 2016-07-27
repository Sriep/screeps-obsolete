/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions during periods of constrution.
 * @author Piers Shepperson
 */
var    policy = require("policy");
var    roomOwned = require("room.owned");
var    policyDefend = require("policy.defence");
var    policyFrameworks = require("policy.frameworks");
var    raceBase = require("race.base");
var    raceWorker = require("race.worker");
var    roleBase = require("role.base");
var   stats = require("stats");
var policyPeace = require("policy.peace");
var poolSupply = require("pool.supply");

/**
 * Abstract base object for deceison when there are construction projects.
 * @module policyConstruction
 */
var policyConstruction = {
    REPAIR_THRESHOLD: 4,
    REPAIR_RATIO: 0.1,
    
    /**
     * Called during constrution. Determins what the new polciy for the comming 
     * tick should be.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(oldPolicy) {
        return null;
    },

    initialisePolicy: function (newPolicy) {
        return true;
    },

    /**
     * Enact policy during periods of constrution. The main objective is to 
     * construction as quickly as possible while using all available source
     * energy.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(currentPolicy) {
        room = Game.rooms[currentPolicy.room];
        room.memory.policyId = currentPolicy.id;
        poolSupply.updateSupplyLevel(room.name
            ,roomOwned.calaculateSuplly(room)
            ,room.energyCapacityAvailable);
        var constructionLeft = roomOwned.getConstructionLeft(room);
        console.log(room,"constructoin left", constructionLeft);
     //   stats.updateStats(room);
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders =0;


        var energy = roomOwned.allSourcesEnergy(room)  *5;
        var toSupply = poolSupply.getEnergyInBuildQueue(room);
        var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
        var toSupply = Math.floor(Math.min(toSupply, supportable));

        if (toSupply > 0)
        {
            var nHavesters = roomOwned.supportHavesters(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nBuilders = roomOwned.supportUpgraders(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
        }  else {
            var nHavesters = roomOwned.constructHavesters(room, policy.LINKING_WORKER_SIZE,  true);
            var nBuilders = roomOwned.constructBuilders(room, policy.LINKING_WORKER_SIZE,  true);
        }

        var equilbriumCreeps = nHavesters + nUpgraders + nBuilders + toSupply;
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        if ( equilbriumCreeps * policy.LINKING_WORKER_SIZE < nWorkParts )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            nHavesters = Math.max(Math.ceil(nHavesters),2);
        }
        policyPeace.spawnCreep(room,currentPolicy, equilbriumCreeps );

        //Has not spawned but energy at capacty no need for havesters
        if (policy.energyStorageAtCapacity(room)){
            nHavesters = 0;
        }
        //Limit to one harvester if only one acces point
        if (1 == roomOwned.countSiteAccess(room, FIND_SOURCES)) {
            nHavesters = Math.min(1, nHavesters);
        }
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        }
        

        nBuilders = nCreeps - nHavesters - nRepairers - nUpgraders;
        
        console.log("Enact construction with links roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers
            , "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);
       // policy.convertContractWorkers(room, currentPolicy, roleBase.Type.BUILDER);

    },



    dependantPolices: function(room) {
        var roomNames = [];
        var dependantPolices = room.memory.dependantPolicies;
        for (var i in dependantPolices) {
            var depPolicy = policy.getPolicyFromId(dependantPolices[i]);
            if (depPolicy.type == policy.Type.FOREIGN_ROAD) {
                roomNames.push(depPolicy.workRoom);
            }
        }
        return roomNames;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
      //  console.log("In switchPolicy oldPolicy", JSON.stringify(oldPolicy)
        //    , "newPolcy",JSON.stringify(newPolicy));

        //if (oldPolicy === undefined) {
       //     return;
       // }
        switch(oldPolicy.type) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.POLICY_MANY2ONE_LINKERS:
                policy.breakUpLinks(oldPolicy);
                break;
            case policyFrameworks.Type.PEACE: 
                console.log("switch from peace to construction");
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
    },

    totalConstruction: function(room) {
        var sites = room.find(FIND_CONSTRUCTION_SITES);	 
        workRequired = 0;
        for (var i in sites) {
            var leftToDo = sites[i].progressTotal - sites[i].progress;
            workRequired = workRequired + leftToDo;
        }
        return workRequired;
    },

    startConstruction: function(room) {
        if (undefined === room) {
            return false;
        }
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0) {
            return true;
        }
        return false;
    },
}

module.exports = policyConstruction;
























