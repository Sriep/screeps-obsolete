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
    draftNewPolicyId: function(room) {
        if (policyDefend.beingAttaced(room)) {         
            return policy.Type.DEFEND;
        }
        policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policy.Type.RESCUE;
        }
        if (this.constructionSite(room)) {
            return policy.Type.CONSTRUCTION;
        }
        return policy.Type.PEACE;
    },

    /**
     * Enact policy during periods of constrution. The main objective is to 
     * construction as quickly as possible while using all available source
     * energy.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(room) {
        console.log("enact constrution rom", room);
        //policy = require("policy");
        //policy.breakUpLinks(room);
        //roleBase.forceCreeps(room, roleBase.Type.HAVERSTER);
        this.assingWorkers(room);
        /*
        spawns = room.find(FIND_MY_SPAWNS);
        var wokerSize = policy.workerBuildSize(room);
        console.log("enact constr worksize", wokerSize);
        raceBase.spawn(raceWorker, room, spawns[0], wokerSize);

        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nUpgraders = 0;
        var nHavesters = Math.ceil(roomOwned.constructHavesters(room, undefined, true));
        var nRepairers = 0;
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = Math.max(1, (nCreeps-nBuilders)*this.REPAIR_RATIO);
        }

        var tripsNeeded = Math.ceil(this.totalConstruction(room)
                                        /(wokerSize*CARRY_CAPACITY));
        var nHavesters = 0;
        var nRepairers = 0;
        var nBuilders = 0;
        if (tripsNeeded < nCreeps) {
            nHavesters = Math.ceil(roomOwned.peaceHavesters(room, undefined, true));           
            if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
                nRepairers = Math.max(1, (nCreeps-nBuilders)*this.REPAIR_RATIO);
            }              
            nBuilders = Math.min(tripsNeeded, nCreeps-nHavesters-nRepairers);  
            //console.log("enact const trips", tripsNeeded, "creeps", nCreeps);             
        } else {
            nHavesters = Math.ceil(roomOwned.constructHavesters(room, undefined, true));           
            if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
                nRepairers = Math.max(1, (nCreeps-nBuilders)*this.REPAIR_RATIO);
            }              
            nBuilders = nCreeps-nHavesters-nRepairers;               
        }
        var nUpgraders = nCreeps-nHavesters-nRepairers- nBuilders;                                  

        console.log("enact Const roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers, "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);*/

        raceBase.moveCreeps(room);
    },

    assingWorkers: function(room) {
        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nUpgraders = 0;
        var nRepairers = 0;     
        var nHavesters = roomOwned.constructHavesters(room, undefined, true);
        var nBuilders = roomOwned.constructBuilders(room, undefined, true);
console.log("polich constrution assingWorkes equib havesters", nHavesters, "equib build", nBuilders);

        if (nHavesters + nBuilders < nCreeps )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                nHavesters = Math.floor(nHavesters);
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            spawns = room.find(FIND_MY_SPAWNS);
            raceBase.spawn(raceWorker, room, spawns[0], policy.LINKING_WORKER_SIZE);  
            nHavesters = Math.ceil(nHavesters);
        }

        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        }
        var nBuilders = nCreeps - nHavesters - nRepairers;  

        var tripsNeeded = Math.ceil(this.totalConstruction(room)
                                        /(policy.wokerSize*CARRY_CAPACITY));

        console.log("enact const roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers,
                "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);
    },

    switchPolicy: function(room, oldPolicyId)
    {
        switch(oldPolicyId) {
        case policy.Type.RESCUE:
            break;
        case policy.Type.CONSTRUCTION:
            break;
        case policy.Type.DEFEND:
            break;
        case policy.Type.PEACE: 
            policy.breakUpLinks(room); 
        default:
        }    
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

    constructionSite: function(room) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);	  
        //console.log("In constructionSite", constructionSites.length )
        return (constructionSites.length > 0);  
    },

    //workerBuildSize: function(room)
    //{
    //    return 5;
        //return raceWorker.maxSizeRoom(room);
    //},

}

module.exports = policyConstruction;