/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room is under attack.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    
    //policyDefend = require("policy.defence");
    //policyPeace= require("policy.peace");
    raceBase = require("race.base");
    raceWorker = require("race.worker");
    roomWar = require("room.war");
    raceInfantry = require("race.infantry");



/**
 * Abstract object for handling  decisions when the room needs is under attack.
 * A room is under attack when an enemy unit with attack, ranged attack, claim
 * or work modules. 
 * @module policyDefence
 */
var policyDefence = {

    /**
     * Determins what the new polciy of or the comming tick should be. 
     * This will changed if all enemy units are removed.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(room) {
        if (policyDefence.beingAttaced(room)) {         
            return policy.Type.DEFEND;
        }
        if (this.beingAttaced(room)) {
            return policy.Type.RESCUE;
        }
        policyConstruction = require("policy.construction");
        if (policyConstruction.constructionSite(room)) {
            return policy.Type.CONSTRUCTION;
        }
        return policy.Type.PEACE;
    },


    /**
     * Handles defence of the room.
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(room) {
        var nHavesters = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;      
        var nUpgraders = 0;
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);

        spawns = room.find(FIND_MY_SPAWNS);
        var infentrySize = Math.floor(
            room.energyCapacityAvailable/raceInfantry.BLOCKSIZE);
        raceBase.spawn(raceInfantry, room, spawns[0], infentrySize);
        
        npcInvaderBattle.defendRoom(room);
        //roomWar.defendRoom(room);
    },

    /**
     * Detects the presence of suspicious enemy units.
     * @function beingAttaced
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy. 
     */
    beingAttaced: function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        var foundAttackPart = false;
        var i = 0;
        while (!foundAttackPart && i < hostiles.length) {
            if (hostiles[i].getActiveBodyparts(ATTACK) > 0
                || hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0
                || hostiles[i].getActiveBodyparts(CLAIM) > 0
                || hostiles[i].getActiveBodyparts(WORK) > 0) {
                    return true;
                }
        }
        return false;
    }

}

module.exports = policyDefence;