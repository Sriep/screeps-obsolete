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

/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteLinker
 */

function  RouteLinker  (room, flagName, policyId, defensive, fast, healParts) {
    this.type = gc.ROUTE_LINKER;
    this.role = gc.ROLE_LINKER;
    this.owner = room;
    this.flagName = flagName;
    this.policyId = policyId;
    var flag = Game.flags[flagName];
   // console.log("In Route Linker");
    if (flag) {
        if (flag.memory.type == gc.FLAG_SOURCE) {
            var source = Game.getObjectById(flagName);
            var energyCapacity;
            if (source && source.energyCapacity) {
                energyCapacity = source.energyCapacity;
            } else {
                energyCapacity = flag.memory.energyCapacity; // should not be here
            }
            var workerParts = energyCapacity / (HARVEST_POWER * ENERGY_REGEN_TIME);
            if (room != flag.pos.roomName) workerParts++;
            this.size = Math.min(raceWorker.maxSizeRoom(Game.rooms[room]), Math.ceil(workerParts));
        } else {
            this.size = gc.LINKING_MINER_SIZE;
        }
        this.respawnRate = CREEP_LIFE_TIME - flag.memory.linkerFrom.distance - CREEP_SPAWN_TIME;
    }
    this.defensive = defensive ? defensive : false;
    this.fast = fast ? fast : false;
    this.healParts = healParts ? healParts : 0;
    this.body = RouteLinker.prototype.getLinkerBody(room, energyCapacity, this.healParts );
    //this.boostActions = [gc.HARVEST, gc.CAPACITY,gc.FATIGUE];
    this.due = 0;
}

RouteLinker.prototype.spawn = function (build, spawn, room ) {
   // console.log("trying to spawn RouteLinker");
    var body = raceWorker.body(build.size, build.fast);
    for ( var i = 0 ; i < build.healParts ; i++ ) {
        body.push(HEAL);
        body.unshift(MOVE);
    }
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_LINKER,
            build.flagName,
            build.defensive);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.flagName;
        Game.creeps[name].memory.testNewLinkerBody = build.body;
    }
    return name;
};

RouteLinker.prototype.getLinkerBody = function ( buildRoom, sourceEnergy, healParts ) {
    var room = Game.rooms[buildRoom];
    //console.log(room,buildRoom,"getLinkerBody")
    var workParts = sourceEnergy / (HARVEST_POWER * ENERGY_REGEN_TIME);
    var moveParts = workParts;
    var enrgyForCarry = room.energyCapacityAvailable - BODYPART_COST[WORK] * workParts
                            - BODYPART_COST[MOVE] * moveParts - BODYPART_COST[HEAL] * healParts;
    var carryParts;
    if (healParts > 0) {
        carryParts = Math.min(MAX_CREEP_SIZE - workParts - moveParts - healParts,
            Math.floor(enrgyForCarry/BODYPART_COST[CARRY]) );
    } else {
        carryParts = Math.min(MAX_CREEP_SIZE - workParts - moveParts,
                             Math.floor(enrgyForCarry/BODYPART_COST[CARRY]) )
    }
    return raceWorker.bodyE(workParts, carryParts, moveParts, healParts);
};

RouteLinker.prototype.roleParameters  = function (build) {
    var parameters = [];
    parameters.push(build.flagName);
    parameters.push(build.defensive);
    return  parameters;
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
    return raceWorker.energyFromSize(build.size);
};

RouteLinker.prototype.parts = function(build) {
    return 2 * build.size;
};

module.exports = RouteLinker;






























