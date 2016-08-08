/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room is under attack.
 * @author Piers Shepperson
 */

var policy = require("policy");
var policyFrameworks = require("policy.frameworks");
var npcInvaderBattle = require("npc.invader.battle");
var BattleDefenceEstimate = require("battle.defence.estimate");
var raceWorker = require("race.worker");
var stats = require("stats");
var raceSwordsman = require("race.swordsman");
var gc = require("gc");
var roleBase = require("role.base");
var raceBase = require("race.base");

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
        if (undefined == room) {
            return null;//oldPolicy;
        }
        if (this.beingAttacked(room)) {
            return oldPolicy;
        }
        var policyRescue = require("policy.rescue")
        if (policyRescue.needsRescue(room, oldPolicy)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
        return policyFrameworks.createPeacePolicy(room.name);
    },

    initialisePolicy: function (newPolicy) {
        var room = Game.rooms[newPolicy.room];
        if (room.memory)
            room.memory.policyId = newPolicy.id;
        return true;
    },
    
    /**
     * Handles defence of the room.
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(currentPolicy) {
        //currentPolicy.room = "W26S21";
        var room = Game.rooms[currentPolicy.room];
        console.log("Enact policy defence room", room);

        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns == undefined || spawns == []) return npcInvaderBattle.defendRoom(room);
        var size = raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, room);
        var body = raceSwordsman.body(size);
        console.log("body",body,"size",size);
        var name = spawns[0].createCreep(body);
        console.log("enact policy try to spawn swordsman result",name);
       // var name = raceBase.spawn(raceWorker, currentPolicy, spawns[0], workerSize);
        if (_.isString(name)) {
            roleBase.switchRoles(Game.creeps[name], gc.ROLE_PATROL_ROOM);
            Game.creeps[name].policyId = currentPolicy.id;
            console.log(room, "result of spawn", name, "swordsman");
        }
        npcInvaderBattle.defendRoom(room);
    },

    switchPolicy: function(oldPolicyId, newPolicy) {
        switch(oldPolicyId.type) {
        case policyFrameworks.Type.RESCUE:
            break;
        case policyFrameworks.Type.CONSTRUCTION:
            break;
        case policyFrameworks.Type.DEFEND:
            break;
        case policyFrameworks.Type.PEACE:
        default:
        }
        policy.reassignCreeps(oldPolicyId, newPolicy);
    },

    /**
     * Detects the presence of suspicious enemy units.
     * @function beingAttacked
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy.
     */
    beingAttacked: function(room) {
        if (room == undefined) {
            return false;
        }
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if ( !hostiles || 0 == hostiles.length ) return false;
        for ( var i = 0 ; i < hostiles.length ; i++ ) {
            if (hostiles[i].owner  && hostiles[i].owner != "Invader")
                return true;
        }

        //var hostileParts = _.sum(hostiles.body.length);
        //console.log("hostileparts", hostileParts);
        //if ( hostileParts >50) return true;

        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        var friendlies = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.getActiveBodyparts(ATTACK) > 0
                    ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0;
            }
        });
        if ( towers.length == 0 && friendlies.length == 0) {
            return true;
        } else {
            //console.log("beingAttacked about to call quickDefence",hostiles,friendlies,towers);
            var simResult = BattleDefenceEstimate.quickDefence(hostiles, friendlies, towers);
            //console.log("back from BattleDefenceEstimate");
            //console.log("beingAttacked simResult", simResult);
            //console.log("simBattleResult", JSON.stringify(simResult));
            if (towers.length > 0) {
                return towers.length > simResult.towers.length;
            } else  {

                return friendlies.length > simResult.defenders.length;
            }
        }
    }
};

module.exports = policyDefence;






























































