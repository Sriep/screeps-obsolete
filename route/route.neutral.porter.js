/**
 * Created by Piers on 23/07/2016.
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
 * @module RouteNeutralPorter
 */

function  RouteNeutralPorter  (room, flagName, policyId) {
    this.type = gc.ROUTE_NEUTRAL_PORTER;
    this.owner = room;
    this.flagName = flagName;
    this.policyId = policyId;
    var maxForRoom = raceWorker.maxSizeRoom(Game.rooms[room]);
    var flag = Game.flags[flagName];
    if (flag) {
        var sizeForOnePerGen = RouteNeutralPorter.prototype.sizeForOneGenerationRespawn(
            flag.memory.porterFrom.distance,
            flag.memory.energyCapacity
        );
        //console.log(room,"RouteNeutralPorter",maxForRoom,"maxForRoom size onegen",sizeForOnePerGen)
        this.size = Math.min(maxForRoom, sizeForOnePerGen)
        var flag = Game.flags[flagName];
        this.respawnRate = RouteNeutralPorter.prototype.calcRespawnRate(
            flag.memory.porterFrom.distance,
            flag.memory.energyCapacity,
            this.size
        );
    }
    this.due = 0;
}

RouteNeutralPorter.prototype.spawn = function (build, spawn, room ) {
  //  console.log("trying to spawn RouteLinker");
    var body = raceWorker.body(build.size, true);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_NEUTRAL_PORTER,
            build.owner,
            Game.flags[build.flagName]);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.flagName;
    }
    return name;
};

RouteNeutralPorter.prototype.sizeForOneGenerationRespawn = function(distance, energyCapacity) {
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var size = SourceEnergyPerGeneration * 2*distance/(CREEP_LIFE_TIME*CARRY_CAPACITY);
   // console.log("sizeForOneGenerationRespawn",SourceEnergyPerGeneration,size);
    return Math.floor(size);
};

RouteNeutralPorter.prototype.calcRespawnRate = function(distance, energyCapacity, size) {
    var tripsPerLife = CREEP_LIFE_TIME / (2*distance)
    var creepEnergyPerLife = tripsPerLife * size * CARRY_CAPACITY;
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var numberWorkersNeeded = SourceEnergyPerGeneration/creepEnergyPerLife;
    return Math.ceil(CREEP_LIFE_TIME/numberWorkersNeeded);
};

RouteNeutralPorter.prototype.equals = function (route1, route2 ) {
    return route1.type == route.type
        && route1.owner == route2.owner
        && route1.flagName == route2.flagName
        && route1.policyId == route2.policyId
        && route1.size == route2.size
        && route1.respawnRate == route2.respawnRate;
};

RouteNeutralPorter.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size, true);
};

module.exports = RouteNeutralPorter;


































