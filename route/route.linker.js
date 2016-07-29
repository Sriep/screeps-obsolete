/**
 * Created by Piers on 23/07/2016.
 */
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
 * @module RouteLinker
 */

function  RouteLinker  (room, flagName, policyId) {
    this.type = gc.ROUTE_LINKER;
    this.owner = room;
    this.flagName = flagName;
    this.policyId = policyId;
    var flag = Game.flags[flagName];
   // console.log("In Route Linker");
    if (flag) {
        if (flag.memory.type == gc.FLAG_SOURCE) {
            var workerParts = flag.memory.energyCapacity / (HARVEST_POWER * ENERGY_REGEN_TIME);
            if (room != flag.pos.roomName) workerParts++;
            this.size = Math.min(raceWorker.maxSizeRoom(Game.rooms[room]), Math.ceil(workerParts));
        } else {
           /* var mineral = Game.getObjectById(flagName);
            var ticksToRegeneration = mineral.ticksToRegeneration;
            if (!ticksToRegeneration) ticksToRegeneration = MINERAL_REGEN_TIME;
            var amountPerTick =  mineral.mineralAmount / ticksToRegeneration;
            var workerParts = Math.ceil(amountPerTick / HARVEST_POWER);
            this.size = Math.min(raceWorker.maxSizeRoom(Game.rooms[room]), workerParts);
            console.log("routeliner mineral", mineral.mineralAmount,"ticksToRegeneration",
                mineral.ticksToRegeneration,"pertick", amountPerTick);
            console.log(room,"RouteLinker size",this.size, raceWorker.maxSizeRoom(Game.rooms[room]), workerParts);*/
            this.size = gc.LINKING_MINER_SIZE;
        }
        this.respawnRate = CREEP_LIFE_TIME - flag.memory.porterFrom.distance - CREEP_SPAWN_TIME;
    }
    this.due = 0;
}

RouteLinker.prototype.spawn = function (build, spawn, room ) {
   // console.log("trying to spawn RouteLinker");
    var body = raceWorker.body(build.size);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_LINKER,
            build.flagName);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.flagName;
    }
    return name;
};

RouteLinker.prototype.equals = function (route1, route2 ) {
    return route1.type == route.type
        && route1.owner == route2.owner
        && route1.flagName == route2.flagName
        && route1.policyId == route2.policyId
        && route1.size == route2.size
        && route1.respawnRate == route2.respawnRate;
};

RouteLinker.prototype.energyCost = function(build) {
    //console.log("In RouteLinker.energyCost");
    return raceWorker.energyFromSize(build.size);
};

module.exports = RouteLinker;






























