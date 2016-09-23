/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room is under attack.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var npcInvaderBattle = require("npc.invader.battle");
var BattleDefenceEstimate = require("battle.defence.estimate");
var stats = require("stats");
var raceSwordsman = require("race.swordsman");
var gc = require("gc");
var roleBase = require("role.base");
var raceBase = require("race.base");
var battleDefenceEstimate = require("battle.defence.estimate");

/**
 * Abstract object for handling  decisions when the room needs is under attack.
 * A room is under attack when an enemy unit with attack, ranged attack, claim
 * or work modules. 
 * @module policyDefence
 */
function PolicyDefence (roomName) {
    this.type = gc.POLICY_DEFENCE;
    this.roomName = roomName;
}

/**
 * Determins what the new polciy of or the comming tick should be.
 * This will changed if all enemy units are removed.
 * @function draftNewPolicyId
 * @param   {Object} room  The room we are drafting the policy for.
 * @returns {enum} Id of policy for comming tick.
 */
PolicyDefence.prototype.draftNewPolicyId = function(oldPolicy) {
    var PolicyRescue = require("policy.rescue");
    var PolicyPeace = require("policy.peace");

    var room =  Game.rooms[oldPolicy.roomName];
    if (undefined == room) {
        return null;//oldPolicy;
    }
    if (this.beingAttacked(room)) {
        return oldPolicy;
    }
    if (PolicyRescue.prototype.needsRescue(room, oldPolicy)) {
        return new PolicyRescue(room.name);
    }
    return new PolicyPeace(room.name);
}

PolicyDefence.prototype.initialisePolicy = function (newPolicy) {
    var room = Game.rooms[newPolicy.roomName];
    room.memory.repairWall = true;
    if (room.memory)
        room.memory.policyId = newPolicy.id;
    return true;
};

/**
 * Handles defence of the room.
 * @param   {Object} room  The room that might need rescuing.
 * @returns {none}
 */
PolicyDefence.prototype.enactPolicy = function(currentPolicy) {
    //currentPolicy.room = "W26S21";
    var room = Game.rooms[currentPolicy.roomName];
    console.log("Enact policy defence room", room);
    room.memory.repairWall = true;
    var PolicyPeace = require("policy.peace");
    PolicyDefence.prototype.wallBuildingDefence(room, currentPolicy);
    /*var spawns = room.find(FIND_MY_SPAWNS);
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
    }*/
    //npcInvaderBattle.defendRoom(room);
};

PolicyDefence.prototype.wallBuildingDefence = function(room, currentPolicy) {
    console.log(room,"all building defence")
    var routeBase = require("route.base");
    routeBase.update(room);
    var economyLinkers = require("economy.linkers");
    if (Game.time % gc.ATTACH_FLAGGED_ROUTES_RATE == 0 ) {
        economyLinkers.attachLocalFlaggedRoutes(room, currentPolicy);
        economyLinkers.attachForeignFlaggedRoutes(room, currentPolicy);
        economyRepair.attachWallBuilder(room, currentPolicy);
    }
    economyLinkers.removeExhausedMiners(room);
    economyLinkers.attachFlexiStoragePorters(room, currentPolicy);
    economyLinkers.processBuildQueue(room, gc.PRIORITY_HOME_PORTER);

    //if (gc.AI_CONSTRUCTION) this.newConstruction(room);
    //npcInvaderBattle.defendRoom(room);
    this.defendRoom(room);
}


PolicyDefence.prototype.switchPolicy = function(oldPolicyId, newPolicy) {
    policy.reassignCreeps(oldPolicyId, newPolicy);
};

/**
 * Detects the presence of suspicious enemy units.
 * @function beingAttacked
 * @param   {Object} room  The room that might need rescuing.
 * @returns {Bool} True inidcates we should use a rescue policy.
 */
PolicyDefence.prototype.beingAttacked = function(room) {
    if (room == undefined) {
        return false;
    }
    //var attackersParts = this.combatParts(room,FIND_HOSTILE_CREEPS);
    //var defendersParts = this.combatParts(room,FIND_MY_CREEPS);
    //console.log(room,"attackersParts", JSON.stringify(attackersParts));
    //console.log(room,"defendersParts",JSON.stringify(defendersParts));

    var hostiles = room.find(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
            return creep.getActiveBodyparts(ATTACK) > 0
                ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0
                ||  creep.getActiveBodyparts(WORK) > 0
                ||  creep.getActiveBodyparts(CLAIM) > 0
                ||  creep.getActiveBodyparts(HEAL) > 0;
        }
    });
    if ( !hostiles || 0 == hostiles.length ) return false;
    return true;
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
};

PolicyDefence.prototype.combatParts = function(room, findType) {
    var hostiles = room.find(findType, {
        filter: function(creep) {
            return creep.getActiveBodyparts(ATTACK) > 0
                ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0
                ||  creep.getActiveBodyparts(WORK) > 0
                ||  creep.getActiveBodyparts(CLAIM) > 0
                ||  creep.getActiveBodyparts(HEAL) > 0;
        }
    });
    var result = { attackParts : 0, workParts : 0, rangedAttackParts : 0, healParts : 0, claimParts : 0}  ;

    for ( var i = 0 ; i < hostiles.length ; i++ ) {
        result.attackParts += hostiles[i].getActiveBodyparts(ATTACK);
        result.rangedAttackParts += hostiles[i].getActiveBodyparts(RANGED_ATTACK);
        result.workParts += hostiles[i].getActiveBodyparts(WORK);
        result.claimParts += hostiles[i].getActiveBodyparts(CLAIM);
        result.healParts += hostiles[i].getActiveBodyparts(HEAL);
    }
    return result;
};

PolicyDefence.prototype.defendRoom = function(room) {
    var towers = room.find(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_TOWER}});
    if (towers.length > 0) {
        var bestTarget = this.findBestTarget(room, towers);
        console.log(room,"defendRoom findBestTarget",bestTarget)
        if (bestTarget)  {
            for ( var i = 0 ; i < towers.length ; i++) {
                towers[i].attack(bestTarget);
            }
        }
    }
};

PolicyDefence.prototype.findBestTarget = function(room, towers) {
    var attackersParts = this.combatParts(room,FIND_HOSTILE_CREEPS);
    var defendersParts = this.combatParts(room,FIND_MY_CREEPS);

    var hostiles = room.find(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
            return creep.getActiveBodyparts(ATTACK) > 0
                ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0
                ||  creep.getActiveBodyparts(WORK) > 0
                ||  creep.getActiveBodyparts(CLAIM) > 0
                ||  creep.getActiveBodyparts(HEAL) > 0;
        }
    });
    //hostiles.sort(PolicyDefence.prototype.sortTowerTargets(h1, h2, towers))
    //console.log("before sort",JSON.stringify(hostiles));
    hostiles.sort( function (h1, h2) {
        return PolicyDefence.prototype.towersDamage(h2, towers) - PolicyDefence.prototype.towersDamage(h1, towers) ;
    });
    //console.log("after sort",JSON.stringify(hostiles));
    for ( var i = 0 ; i < hostiles.length ; i++ ) {
        if (this.worthTargeting(hostiles[i], towers)) return hostiles[i];
    }

    //var clostest = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
};

PolicyDefence.prototype.towersDistance = function(hostile, towers) {
    var distance = 0;
    for ( var i = 0 ; i < towers.length ; i++ ) {
        var d =  hostile.pos.getRangeTo(towers[i]) - 6;
        if (d <= 0) return 0;
        distance += Math.min(20,d);
    }
    return distance;
};

PolicyDefence.prototype.towersDamage = function(hostile, towers) {
    var damage = 0;
    for ( var i = 0 ; i < towers.length ; i++ ) {
        var range =  Math.min(20, Math.max(0, hostile.pos.getRangeTo(towers[i]) - 5));
        damage += battleDefenceEstimate.towerDamage(range);
    }
    return damage;
};

PolicyDefence.prototype.worthTargeting = function (hostile, towers) {
    var hostileGroupe = hostile.room.find(FIND_HOSTILE_CREEPS, {
        filter: function(creep) {
            return (creep.getActiveBodyparts(ATTACK) > 0
                ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0
                ||  creep.getActiveBodyparts(WORK) > 0
                ||  creep.getActiveBodyparts(CLAIM) > 0
                ||  creep.getActiveBodyparts(HEAL) > 0)
                    && creep.pos.isNearTo(hostile)
        }
    });
    var healParts = 0;
    for ( var i = 0 ; i < hostileGroupe.length ; i++ ) {
        healParts +=  hostileGroupe[i].getActiveBodyparts(HEAL);
    }

    var friends = hostile.room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
            return (creep.getActiveBodyparts(ATTACK) > 0
                ||  creep.getActiveBodyparts(RANGED_ATTACK) > 0)
                && creep.pos.isNearTo(hostile)
        }
    });
    var friendlyFire = 0;
    for ( var i = 0 ; i < friends.length ; i++ ) {
        friendlyFire +=  friends[i].getActiveBodyparts(ATTACK) * 30;
        friendlyFire +=  friends[i].getActiveBodyparts(RANGED_ATTACK) * 10;
    }

    var damage = this.towersDamage(hostile, towers);

    console.log(hostile,towers,"worthTargeting heal and damage heal parts", healParts,
        "tower damage",damage,"friedlyfire",friendlyFire, healParts * 12 < damage);
    return healParts * 12 < damage + friendlyFire;
};

module.exports = PolicyDefence;






























































