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
var raceBase = require("race.base");
var racePorter = require("race.porter");

/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteNeutralPorter
 */

function  RouteNeutralPorter  (roomName, flagName, respawnMultiplyer) {
    this.type = gc.ROUTE_NEUTRAL_PORTER;
    this.role = gc.ROLE_NEUTRAL_PORTER;
    this.owner = roomName;
    this.flagName = flagName;
    this.respawnMultiplyer = respawnMultiplyer ? respawnMultiplyer : 0.9;
   // var maxForRoom = racePorter.maxSizeRoom(Game.rooms[room]);
    var flag = Game.flags[flagName];
    if (!flag) return;
    var room = Game.rooms[roomName];
    var maxSizeRoom = Math.min( Math.floor((room.energyCapacityAvailable-50)/racePorter.BLOCKSIZE),
                                    gc.PORTER_SLOW_MAX_SIZE);
    //var sizeForOnePerGen = RouteNeutralPorter.prototype.sizeForOneGenerationRespawn(
    //    flag.memory.porterFrom.distance,
    //    flag.memory.energyCapacity
   // );
   // var size = Math.min(maxSizeRoom, sizeForOnePerGen);
    var size = maxSizeRoom;
    this.respawnRate = this.respawnMultiplyer * RouteNeutralPorter.prototype.calcRespawnRate(
        flag.memory.porterFrom.distance,
        flag.memory.energyCapacity,
        size
    );
    this.respawnRate = Math.min(Math.ceil(this.respawnRate), CREEP_LIFE_TIME);

    this.body = racePorter.body(size);
  //  console.log(size,"RouteNeutralPorter",this.body);
    if (room.energyCapacityAvailable >= size * racePorter.BLOCKSIZE +150) {
        this.body.unshift(MOVE);
        this.body.push(WORK);
    } else {
        this.body.pop();
        this.body.push(WORK);
    }
    this.boostActions = [gc.CAPACITY,gc.FATIGUE];
    this.due = 0;
}

RouteNeutralPorter.prototype.spawn = function ( build, spawn, room ) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            build.role,
            build.owner,
            build.flagName
        );
        Game.creeps[name].memory.builtIn = build.owner;
        Game.creeps[name].memory.buildReference = build.flagName;
        Game.creeps[name].memory.boostInfoSet = "have not set boost stuff";
    }
    return name;
};

RouteNeutralPorter.prototype.sizeForOneGenerationRespawn = function(distance, energyCapacity) {
   // console.log("sizeForOneGenerationRespawn distance",distance,"energyCapacity",energyCapacity);
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var size = SourceEnergyPerGeneration * 2*distance/(CREEP_LIFE_TIME*CARRY_CAPACITY);
  //  console.log("sizeForOneGenerationRespawn",SourceEnergyPerGeneration,size);
    return Math.ceil(size);
};

RouteNeutralPorter.prototype.calcRespawnRate = function(distance, energyCapacity, size) {
    var tripsPerLife = CREEP_LIFE_TIME / (2*distance)
    var creepEnergyPerLife = tripsPerLife * size * CARRY_CAPACITY;
    var SourceEnergyPerGeneration = energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    var numberWorkersNeeded = SourceEnergyPerGeneration/creepEnergyPerLife;
    return Math.ceil(CREEP_LIFE_TIME/numberWorkersNeeded);
};

RouteNeutralPorter.prototype.roleParameters  = function (build) {
    var parameters = [];
    parameters.push(build.owner);
    parameters.push(build.flagName);
    return  parameters;
};

RouteNeutralPorter.prototype.energyCost = function(build) {
    return raceBase.getEnergyFromBody(build.body);
};

RouteNeutralPorter.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = RouteNeutralPorter;


































