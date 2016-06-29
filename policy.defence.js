/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room is under attack.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    
    //policyDefend = require("policy.defence");
    //policyPeace= require("policy.peace");
    npcInvaderBattle = require("npc.invader.battle");
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

    PANICK_ENEMY_CLOSE: 20,

    /**
     * Determins what the new polciy of or the comming tick should be. 
     * This will changed if all enemy units are removed.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(room) {
        if (this.beingAttaced(room)) {         
            return policy.Type.DEFEND;
        }
        policyRescue = require("policy.rescue")
        if (policyRescue.needsRescue(room)) {
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
        //roleBase.forceCreeps(room, roleBase.Type.HAVERSTER);
        var nHavesters = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;      
        var nUpgraders = 0;
        console.log("In enactPolicy");
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);
        spawns = room.find(FIND_MY_SPAWNS);       
        npcInvaderBattle.defendRoom(room);
        raceBase.moveCreeps(room);
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
        //while (!foundAttackPart && i < hostiles.length) {
           // if (hostiles[i].getActiveBodyparts(ATTACK) > 0
           //     || hostiles[i].getActiveBodyparts(RANGED_ATTACK) > 0
           //     || hostiles[i].getActiveBodyparts(CLAIM) > 0
           //     || hostiles[i].getActiveBodyparts(HEAL) > 0) {
           //         return true;
           //     }
        //}
        return hostiles.length > 0;
    },
/*
    infantrySize: function(room) {
        var targets = room.find(FIND_HOSTILE_CREEPS);
        var spawns = Game.spawns;
        for (var i in targets) {
            if (targets[i].pos.inRangeTo(spawns[0],this.PANICK_ENEMY_CLOSE))
            {
                return Math.floor(room.energyCapacityAvailable
                                        /raceInfantry.BLOCKSIZE); 
           }
        }
        return Math.max(workParts+1, raceWorker.maxSizeFromEnergy(room));
    }*/
}

module.exports = policyDefence;