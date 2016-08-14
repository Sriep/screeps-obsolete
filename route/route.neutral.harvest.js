/**
 * Created by Piers on 16/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var stats = require("stats");
var roleBase = require("role.base");
var raceWorker = require("race.worker");
var raceBase = require("race.base");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RouteNeutralHarvest  (room, flagName, fast, healParts, respawnMultiplier) {
    this.type = gc.ROUTE_NEUTRAL_HARVEST;
    this.flagName = flagName;
    var flag = Game.flags[flagName];
    if (!flag) return;
    this.owner = room;
    this.targetRoom = flag.pos.room;
    this.healParts = healParts ? healParts : 0;
    this.resourceId = flag.memory.resourceType;
    this.fast = fast ? true : false;
    this.respawnMultiplyer = respawnMultiplier ? respawnMultiplier : 1;
    var maxForRoom = raceWorker.maxSizeRoom(Game.rooms[room], this.fast );
    if (gc.WORKER_FAST_MAX_SIZE == maxForRoom) {
        if (this.healParts > 1)
            maxForRoom -= Math.floor(this.healParts/2);
    }
    if (maxForRoom <= 0) return;
    var sizeForOnePerGen = RouteNeutralHarvest.prototype.sizeForOneGenerationRespawn(
        flag.memory.porterFrom.distance,
        flag.memory.energyCapacity
    );
    console.log(room,"RouteNeutralPorter",maxForRoom,"maxForRoom size onegen",sizeForOnePerGen)
    this.size = Math.min(maxForRoom, sizeForOnePerGen)
    this.respawnRate = RouteNeutralHarvest.prototype.calcRespawnRate(
        flag.memory.porterFrom.distance,
        flag.memory.energyCapacity,
        this.size
    );
    this.respawnRate = this.respawnRate * this.respawnMultiplyer;
    this.due = 0;
    this.body = raceWorker.body(this.size, this.fast);
    for ( var i = 0 ; i < this.healParts ; i++ ) {
        this.body.push(HEAL);
        this.body.unshift(MOVE);
    }
}

RouteNeutralHarvest.prototype.spawn = function (build, spawn, room ) {
    //console.log("trying to spawn RouteNeutralHarvest");
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_NEUTRAL_HARVESTER,
            build.owner,
            build.targetRoom,
            build.flagName,
            build.resourceId
        );
        Game.creeps[name].memory.buildReference = build.flagName;
    }
    return name;
};

RouteNeutralHarvest.prototype.sizeForOneGenerationRespawn = function(distance, energyCapacity) {
    // console.log("sizeForOneGenerationRespawn distance",distance,"energyCapacity",energyCapacity);
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var roundTrip = 2*distance + (CARRY_CAPACITY/HARVEST_POWER);
    var size = SourceEnergyPerGeneration * roundTrip/(CREEP_LIFE_TIME*CARRY_CAPACITY);
    console.log("sizeForOneGenerationRespawn",SourceEnergyPerGeneration,size);
    return Math.ceil(size);
};

RouteNeutralHarvest.prototype.calcRespawnRate = function(distance, energyCapacity, size) {
    var roundTrip = 2*distance + (CARRY_CAPACITY/HARVEST_POWER);
    var tripsPerLife = CREEP_LIFE_TIME / roundTrip
    var creepEnergyPerLife = tripsPerLife * size * CARRY_CAPACITY;
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var numberWorkersNeeded = SourceEnergyPerGeneration/creepEnergyPerLife;
    return Math.ceil(CREEP_LIFE_TIME/numberWorkersNeeded);
};

RouteNeutralHarvest.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size, build.fast);
};

RouteNeutralHarvest.prototype.parts = function(build) {
    return raceBase.getEnergyFromBody(build.body);
};

module.exports = RouteNeutralHarvest;






























