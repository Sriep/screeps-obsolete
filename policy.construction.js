/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions during periods of constrution.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");
    roomOwned = require("room.owned");

    //policyConstruction = require("policy.construction");
    policyDefend = require("policy.defence");
    //policyRescue = require("policy.rescue");
    raceBase = require("race.base");
    raceWorker = require("race.worker");
    roleBase = require("role.base");


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
            return policy.createDefendPolicy(room.name);
        }
        var policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policy.createRescuePolicy(room.name);
        }
        if (this.startConstruction(room)) {
            return oldPolicy;
        }
        return policy.createPeacePolicy(room.name);
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
        //room.memory.reservedSources = undefined;
        //for (var i in Game.creeps) {
        //    Game.creeps[i].memory.policyId = currentPolicy.id;
        //    console.log("setting policy ids to",currentPolicy.id,"for creep",Game.creeps[i])
       // }
        this.assingWorkers(room, currentPolicy);
    },

    assingWorkers: function(room, currentPolicy) {
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders =0;
        //var nHavesters = roomOwned.constructHavesters(room, undefined, true);
        //var nBuilders = roomOwned.constructBuilders(room, undefined, true);

        var energy = roomOwned.allSourcesEnergy(room)  *5;
        var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
        var toSupply = Math.min(policy.supportBurden(currentPolicy), supportable);

        if (toSupply > 0)
        {
            var nHavesters = roomOwned.supportHavesters(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nBuilders = roomOwned.supportUpgraders(room,  toSupply, energy, policy.LINKING_WORKER_SIZE, true);
        }  else {
            var nHavesters = roomOwned.constructHavesters(room, policy.LINKING_WORKER_SIZE,  true);
            var nBuilders = roomOwned.constructBuilders(room, policy.LINKING_WORKER_SIZE,  true);
        }

        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        console.log("creeps",creeps.length,Game.creeps.length,"creeps",creeps.length,"room", room);

        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);

        console.log("after room.owned funs nHavesters",nHavesters,nBuilders,"ncreeps"
            ,nCreeps,"creeps",creeps.length,"workparts",nWorkParts,"policyid",currentPolicy.id );

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
            var spawns = room.find(FIND_MY_SPAWNS);
            raceBase.spawn(raceWorker, currentPolicy, spawns[0], policy.LINKING_WORKER_SIZE);
            nHavesters = Math.ceil(nHavesters);
        }

        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
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
        switch(oldPolicy.id) {
        case policy.Type.RESCUE:
            break;
        case policy.Type.CONSTRUCTION:
            break;
        case policy.Type.DEFEND:
            break;
        case policy.Type.PEACE: 
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
        var dependantPolices = room.memory.dependantPolicies;
        if (undefined !== dependantPolices || null === dependantPolices) {
            for (var i in dependantPolices)
            {
                var dependantPolicy = policy.getPolicyFromId(dependantPolices[i]);
                if (dependantPolicy !== null && undefined  !== dependantPolicy) {
                    if (dependantPolicy.type == policy.Type.FOREIGN_ROAD
                        && dependantPolicy.sourceRoom == room.name) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
}

module.exports = policyConstruction;
























