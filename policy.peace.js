/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    policyConstruction = require("policy.construction");
    policyDefend = require("policy.defence");
    //policyRescue = require("policy.rescue");
    raceBase = require("race.base");
    raceWorker = require("race.worker");
    roomOwned = require("room.owned");


/**
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module policyPeace
 */
var policyPeace = {
    REPAIR_THRESHOLD: 4,
    REPAIR_RATIO: 0.1,
   
    /**
     * Called when at peace. Determins what the new polciy for the comming 
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
        if (policyConstruction.constructionSite(room)) {
            return policy.Type.CONSTRUCTION;
        }
        return policy.Type.PEACE;
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
    * @param   {Object} room  The room that might need rescuing.
    * @returns {none} 
    */
    enactPolicy: function(room) {
        spawns = room.find(FIND_MY_SPAWNS);
        var wokerSize = this.workerBuildSize(room);
        raceBase.spawn(raceWorker, room, spawns[0], wokerSize);

        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nHavesters = Math.ceil(roomOwned.peaceHavesters(room, undefined, true));
        var nBuilders = 0;
        var nRepairers = 0;
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = Math.max(1, (nCreeps-nBuilders)*this.REPAIR_RATIO);
        }
        var nUpgraders = nCreeps - nHavesters - nBuilders - nRepairers;
        console.log("enact Peace roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers, "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);


        raceWorker.moveCreeps(room);
    },

    workerBuildSize: function(room)
    {
        return raceWorker.maxSizeRoom(room);
    },

}

module.exports = policyPeace;