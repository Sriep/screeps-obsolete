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
    this.owner = roomName;
    this.flagName = flagName;
    this.respawnMultiplyer = respawnMultiplyer ? respawnMultiplyer : 1;
   // var maxForRoom = racePorter.maxSizeRoom(Game.rooms[room]);
    var flag = Game.flags[flagName];
    if (!flag) return;
    var room = Game.rooms[roomName];
    var maxSizeRoom = Math.min( Math.floor((room.energyCapacityAvailable-50)/racePorter.BLOCKSIZE),
                                    gc.PORTER_SLOW_MAX_SIZE);
   // console.log("room.energyCapacityAvailable",room.energyCapacityAvailable,
  //      "racePorter.BLOCKSIZE",racePorter.BLOCKSIZE,"PORTER_SLOW_MAX_SIZE",gc.PORTER_SLOW_MAX_SIZE,
   //     "maxSizeRoom",maxSizeRoom);

    var sizeForOnePerGen = RouteNeutralPorter.prototype.sizeForOneGenerationRespawn(
        flag.memory.porterFrom.distance,
        flag.memory.energyCapacity
    );
   // console.log(room,"RouteNeutralPorter",maxSizeRoom,"maxForRoom size onegen",sizeForOnePerGen)
    var size = Math.min(maxSizeRoom, sizeForOnePerGen);
   // console.log(size,"in routeneutralpoeter");
    this.respawnRate = this.respawnMultiplyer * RouteNeutralPorter.prototype.calcRespawnRate(
        flag.memory.porterFrom.distance,
        flag.memory.energyCapacity,
        size
    );

    this.body = racePorter.body(size);
  //  console.log(size,"RouteNeutralPorter",this.body);
    if (room.energyCapacityAvailable >= size * racePorter.BLOCKSIZE +150) {
        this.body.unshift(MOVE);
        this.body.push(WORK);
    } else {
        this.body.pop();
        this.body.push(WORK);
    }

    //this.healParts = healParts ? healParts : 0;
    this.due = 0;
}

RouteNeutralPorter.prototype.spawn = function (build, spawn, room ) {
  //  console.log("trying to spawn RouteLinker");
    //var body = racePorter.body(build.size);
    //for ( var i = 1 ; i < build.healParts ; i++ ) {
    //    body.pop();
   //     body.shift();
   // }
   // for ( var i = 0 ; i < build.healParts ; i++ ) {
   //     body.push(HEAL);
    //    body.unshift(MOVE);
    //}
    var flag = Game.flags[build.flagName];
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_NEUTRAL_PORTER,
            build.owner,
            flag
        );
        Game.creeps[name].memory.builtIn = build.owner;
        Game.creeps[name].memory.buildReference = build.flagName;
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

RouteNeutralPorter.prototype.equals = function (route1, route2 ) {
    return route1.type == route.type
        && route1.owner == route2.owner
        && route1.flagName == route2.flagName
        && route1.policyId == route2.policyId
        && route1.size == route2.size
        && route1.respawnRate == route2.respawnRate;
};

RouteNeutralPorter.prototype.energyCost = function(build) {
    return racePorter.energyFromSize(build.size);
};

RouteNeutralPorter.prototype.parts = function(build) {
    return build.size * 3;
};

module.exports = RouteNeutralPorter;


































