/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var stats = require("stats");
var roomOwned = require("room.owned");
var _ = require('lodash');
var roleBase = require("role.base");
//var poolSupply = require("pool.supply");
var gc = require("gc");
var tasks = require("tasks");

var routeBase = require("route.base");
var npcInvaderBattle = require("npc.invader.battle");
var economyRepair = require("economy.repair");
//var economyDefence = require("economy.defence");

/**
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module PolicyPeace
 */
function PolicyPeace  (roomName) {
    this.type = gc.POLICY_PEACE;
    this.roomName = roomName;
}

/**
 * Called when at peace. Determins what the new polciy for the comming
 * tick should be.
 * @function draftNewPolicyId
 * @param   {Object} room  The room we are drafting the policy for.
 * @returns {enum} Id of policy for comming tick.
 */
PolicyPeace.prototype.draftNewPolicyId = function (oldPolicy) {
    var PolicyBuildspawn = require("policy.build.spawn");
    var PolicyDefence = require("policy.defence");
    var PolicyRescue = require("policy.rescue");

    var room = Game.rooms[oldPolicy.roomName];
    if (undefined === room)
        return oldPolicy;

    if (!room || !room.controller.my) {
        var PolicyNeutralRoom = require("policy.neutral.room");
        return new PolicyNeutralRoom(roomName);
    }

    if (PolicyDefence.prototype.beingAttacked(room)) {
        return new PolicyDefence(room.name);
    }

    if (!PolicyBuildspawn.prototype.spawnFound(oldPolicy)) {
        return new PolicyBuildspawn(room.name);
    }

    if (PolicyRescue.prototype.needsRescue(room)) {
        return new PolicyRescue(room.name, oldPolicy);
    }
    return oldPolicy;
};

PolicyPeace.prototype.switchPolicy = function (oldPolicy, newPolicy) {
    policy.reassignCreeps(oldPolicy, newPolicy);
};

PolicyPeace.prototype.initialisePolicy = function (newPolicy) {
    return true;
};
/*
PolicyPeace.prototype.connvertToFlexiWorkers = function (room, currentPolicy) {
    var creeps = _.filter(Game.creeps, function (creep) {
        return creep.memory.policyId == currentPolicy.id
                && creeps[i].memory.role != gc.ROLE_FLEXI_STORAGE_PORTER
                && creeps[i].memory.role != gc.ROLE_LINKER
                && creeps[i].memory.role != gc.ROLE_NEUTRAL_PORTER
                && creeps[i].memory.role != gc.ROLE_WALL_BUILDER;
    });
    for (var i = 0; i < creeps.length; i++) {
        roleBase.switchRoles(creeps[i], gc.ROLE_FLEXI_STORAGE_PORTER);
        creeps[i].memory.switchedInconnvertToFlexiWorkers = true;
    }
};*/

//checkLinkIntegrety: function (room, policy)

/**
 * Enact peace time policy. The main objective in peace time is to
 * transger as much source energy to the rooms controller as possible.
 * <ul>
 * <li> Spawn a worker if enought energy avaliable.
 * <li> Determine the ratio of havesters, upgraders, builders and repaiers.
 * <li> Move all the workers in the room.
 * </ul>
 * @function enactPolicy
 * @param   {Object} policy  The room that might need rescuing.
 * @returns {none}
 */
PolicyPeace.prototype.enactPolicy = function (currentPolicy) {
    var room = Game.rooms[currentPolicy.roomName];
  //  console.log("ENACT POLICY PEACE", room);

    var nSpawns = room.find(FIND_MY_SPAWNS).length;
   // console.log(room, "energyCapacity",room.energyCapacityAvailable , "Energy in build queue",
  //         Math.ceil(routeBase.buildQueueEnergyPerGen(room)),
    //        "spawn time",Math.ceil(routeBase.buldQueueRespawnTimePerGen(room)),
   //        "number spawns", nSpawns, "Spawn time", nSpawns*1500 );
  //  console.log(room, "Energy mined", economyLinkers.energyFromLinkersGen(room),
  //          "Average supply journey", roomOwned.avProductionSupplyDistance(room),"Average upgarde distance",
   //         roomOwned.avUpgradeDistance(room));

    routeBase.update(room);
    if (room.name == "W26S21") {
        //   this.initialisePolicy(currentPolicy);
    }
    if (room.name == "W25S23") {
        //this.initialisePolicy(currentPolicy);
    }
    if (room.name == "W25S22") {
        // this.initialisePolicy(currentPolicy);
    }
    var creeps = _.filter(Game.creeps);
    //console.log(room, "policy id", currentPolicy.id, "creeps"
    //    , creeps.length, "room.mode is", room.mode);

    var testNewCode = false;
    // if (room.name == "W25S22" || room.mode != MODE_WORLD) {
    var economyLinkers = require("economy.linkers");



    if (Game.time % gc.ATTACH_FLAGGED_ROUTES_RATE == 0 ) {
        economyLinkers.attachLocalFlaggedRoutes(room, currentPolicy);
        economyLinkers.attachForeignFlaggedRoutes(room, currentPolicy);
        economyRepair.attachWallBuilder(room, currentPolicy);

    }
    economyLinkers.removeExhausedMiners(room);
    economyLinkers.attachFlexiStoragePorters(room, currentPolicy);
    economyLinkers.processBuildQueue(room, currentPolicy);

    if (gc.AI_CONSTRUCTION)
        this.newConstruction(room);
    npcInvaderBattle.defendRoom(room);
};

PolicyPeace.prototype.newConstruction = function (room) {
    var spawns = room.find(FIND_MY_SPAWNS);
    var extensions = room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_EXTENSION}
    });
    var sites = room.find(FIND_CONSTRUCTION_SITES, {
        filter: {structureType: STRUCTURE_EXTENSION}
    });
    var maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    //     console.log(room,"builds spawns",spawns,"extensions",extensions.length,
    //                         "max extensions",maxExtensions,"controller level", room.controller.level);
    /* if (extensions.length + sites.length < maxExtensions) {
     var numSites = maxExtensions - extensions.length - sites.length;
     var x = 2, y = 3;
     var range = 2;
     while (numSites--) {
     var perimeter = getPerimeter(range);
     for ( i = 0 ; i < perimeter.length ; i += 2 ) {
     var pos = new RoomPosition( spawns[0].pos.x + perimeter[i].x,
     spawns[0].pos.y + perimeter[i].y    , room.name);
     var result =  room.createConstructionSite(pos, STRUCTURE_EXTENSION);
     if (result == OK)
     numSites--
     }
     }
     }*/
};


module.exports = PolicyPeace;




































