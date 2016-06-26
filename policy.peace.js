/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    //policyConstruction = require("policy.construction");
    //policyDefend = require("policy.defence");
    //policyRescue = require("policy.rescue");
    raceBase = require("race.base");
    raceWorker = require("race.worker");


/**
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module policyPeace
 */
var policyPeace = {
    
    
    /**
     * Called when at peace. Determins what the new polciy for the comming 
     * tick should be.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(room) {
        //if (policyDefend.beingAttaced(room)) {         
            //return policy.Type.DEFEND;
        //}
        policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policy.Type.RESCUE;
        }
        return policy.Type.PEACE;
    },

    /**
     * Enact peac time policy. The main objective in peace time is to 
     * transger as much source energy to the rooms controller as possible.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(room) {
        spawns = room.find(FIND_MY_SPAWNS);
        var workerSize = raceWorker.maxSize(room.controller);
        raceBase.spawn(raceWorker, room, spawns[0], workerSize);
        raceWorker.assignRoles(room, policy.Type.PEACE);
        raceWorker.moveCreeps(room);
    }

}

module.exports = policyPeace;