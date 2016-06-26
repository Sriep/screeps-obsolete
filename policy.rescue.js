/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room needs rescuing.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    //policyConstruction = require("policy.construction");
    //policyDefend = require("policy.defence");
    policyPeace= require("policy.peace");
    raceBase = require("race.base");
    raceWorker = require("race.worker");



/**
 * Abstract object for handling  decisions when the room needs rescuing.
 * Typically this will be when a rooms creeps has fallen to zero or one. 
 * This might occur due to an invasion or software bug.
 * @module policyRescue
 */
var policyRescue = {

    /**
     * Determins what the new polciy of or the comming tick should be. 
     * Last tick production was too low in comparison with contoller level.
     * Has a new worker improved production enough. 
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(room) {
        //if (policyDefend.beingAttaced(room)) {         
            //return policy.Type.DEFEND;
        //}
        if (this.needsRescue(room)) {
            return policy.Type.RESCUE;
        }
        return policy.Type.PEACE;
    },


    /**
     * Preforms resuce measures. Try to build a creep with size one more than
     * total work parts available or bigger one if energy available.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(room) {
        creeps = room.find(FIND_MY_CREEPS);
        workParts = raceBase.countBodyParts(creeps, WORK);       
        var workerSize = Math.max(workParts+1, raceWorker.maxSizeFromEnergy(room));
        spawns = room.find(FIND_MY_SPAWNS);
        raceBase.spawn(raceWorker, room, spawns[0], workerSize);
        raceWorker.assignRoles(room, policy.Type.RESCUE);
        raceWorker.moveCreeps(room);     
    },

    /**
     * Determins if the production capacity has fallen to such an unexpectedly
     * low level that rescue measures are necessary. 
     * The number of WORK parts are used
     * to indicate production capacity and contoller level to measure what 
     * it should be. 
     * @function needsRescue
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy. 
     */
    needsRescue: function(room) {
        creeps = room.find(FIND_MY_CREEPS);
        workParts = raceBase.countBodyParts(creeps, WORK);
        console.log("In rescue policy needrescue work parts",workParts);
        return workParts < raceWorker.maxSize(room.controller) - 2;
    }

}

module.exports = policyRescue;