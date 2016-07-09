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
        var room =  Game.rooms[oldPolicy.room];
        if (policyDefend.beingAttaced(room)) {
            return policyFrameworks.createDefendPolicy(room.name);
        }
        var policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
        if (this.startConstruction(room)) {
            return oldPolicy;
        }
        return policyFrameworks.createPeacePolicy(room.name);
    },

    initilisePolicy: function (newPolicy) {
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


        
        this.assingWorkers(room, currentPolicy);
    },

    assingWorkers: function(room, currentPolicy) {
        room = Game.rooms[currentPolicy.room];
     //   stats.updateStats(room);
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders =0;
        //var nHavesters = roomOwned.constructHavesters(room, undefined, true);
        //var nBuilders = roomOwned.constructBuilders(room, undefined, true);

        var energy = roomOwned.allSourcesEnergy(room)  *5;
        var toSupply = policy.supportBurden(room);
        var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
        var toSupply = Math.floor(Math.min(toSupply, supportable));
        
        console.log("Room can support", supportable,"workers for ",supportable*1000
            ,"energy and",supportable*5,"parts. Support burder is",toSupply,"workers.");         
        if (toSupply > 0)
        {
            var nHavesters = roomOwned.supportHavesters(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nBuilders = roomOwned.supportUpgraders(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
        }  else {
            var nHavesters = roomOwned.constructHavesters(room, policy.LINKING_WORKER_SIZE,  true);
            var nBuilders = roomOwned.constructBuilders(room, policy.LINKING_WORKER_SIZE,  true);
        }
        var nEqHavesters= nHavesters;
        console.log("Support havesters",nHavesters,"Builders",nBuilders );
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
      //  console.log("creeps",creeps.length,Game.creeps.length,"creeps",creeps.length,"room", room);

        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);

        console.log("Number of creeeps",nCreeps,"with a total of ",nWorkParts,"parts looking for ",
            (nHavesters + nBuilders) * policy.LINKING_WORKER_SIZE ,"parts" );

        if ( (nHavesters + nBuilders) * policy.LINKING_WORKER_SIZE < nWorkParts )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                //nHavesters = Math.floor(nHavesters);
                nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            console.log("Count source acces ponts", roomOwned.countSiteAccess(room,FIND_SOURCES));
            if (nCreeps < 3* roomOwned.countSiteAccess(room,FIND_SOURCES)) {
          //  if (roomOwned.countSiteAccess(room,FIND_SOURCES) > 1) {
                var spawns = room.find(FIND_MY_SPAWNS);
                raceBase.spawn(raceWorker
                    , currentPolicy
                    , spawns[0]
                    , raceWorker.spawnWorkerSize(room,(nHavesters + nBuilders)*1000));
           }
            nHavesters = Math.max(Math.ceil(nEqHavesters),2);
        }
        console.log("workers size to spawn", raceWorker.spawnWorkerSize(room,(nHavesters + nBuilders)*1000));
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        }
        //Has not spawned but energy at capacty no need for havesters
        if (policy.energyStorageAtCapacity(room)){
            nHavesters = 0;
        }
        var nBuilders = nCreeps - nHavesters - nRepairers - nUpgraders;
        console.log("enact const roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers,
            "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);
        policy.convertContractWorkers(room, currentPolicy, roleBase.Type.BUILDER);

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
        console.log("In switchPolicy oldPolicy", JSON.stringify(oldPolicy)
            , "newPolcy",JSON.stringify(newPolicy));

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
        case policyFrameworks.Type.PEACE: 
            console.log("switch from peace to construction");
            policy.breakUpLinks(Game.rooms[oldPolicy.room]);
        default:
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
























