/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room is under attack.
 * @author Piers Shepperson
 */

var    policy = require("policy");
var    policyFrameworks = require("policy.frameworks");
var   npcInvaderBattle = require("npc.invader.battle");
var    raceWorker = require("race.worker");
var   stats = require("stats");

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
    draftNewPolicyId: function(oldPolicy) {
        var room =  Game.rooms[oldPolicy.room];
        if (this.beingAttaced(room)) {
            return oldPolicy;
        }
        var policyRescue = require("policy.rescue")
        if (policyRescue.needsRescue(room, oldPolicy)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
     //   var policyConstruction = require("policy.construction");
     //   if (policyConstruction.startConstruction(room)) {
    //        return policyFrameworks.createConstructionPolicy(room.name);
    //    }
        return policyFrameworks.createPeacePolicy(room.name                
            , room.memory.links.fromLinks
            , room.memory.links.toLink);
    },

    initialisePolicy: function (newPolicy) {
        return true;
    },
    
    /**
     * Handles defence of the room.
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(currentPolicy) {
        currentPolicy.room = "W26S21";
        var room = Game.rooms[currentPolicy.room];
      //  stats.updateStats(room);
        room.memory.policyId = currentPolicy.id;

        var nHavesters = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;      
        var nUpgraders = 0;
        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders,
                                nBuilders , nRepairers);
        npcInvaderBattle.defendRoom(room);
    },

    switchPolicy: function(oldPolicyId, newPolicy)
    {
        switch(oldPolicyId.type) {
        case policyFrameworks.Type.RESCUE:
            break;
        case policyFrameworks.Type.CONSTRUCTION:
            break;
        case policyFrameworks.Type.DEFEND:
            break;
        case policyFrameworks.Type.PEACE:  
            policy.breakUpLinks(Game.rooms[oldPolicyId.room]);
        default:
        }
        policy.reassignCreeps(oldPolicyId, newPolicy);
    },

    /**
     * Detects the presence of suspicious enemy units.
     * @function beingAttaced
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy. 
     */
    beingAttaced: function(room) {
        if (room == undefined) {
            return false;
        }
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