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
    this.size = raceWorker.maxSizeRoom(Game.rooms[room]);
    var flag = Game.flags[flagName];
    if (flag) {
        this.respawnRate = this.respawnRate(flag.memory.porterFrom.distance,
                    flag.memory.energyCapacity, this.size );
    }
    this.due = 0;
}

RouteNeutralPorter.prototype.spawn = function (build, spawn, room ) {
    console.log("trying to spawn RouteLinker");
    var body = raceWorker.body(build.size);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_NEUTRAL_PORTER,
            build.owner,
            Game.flags[build.flagName]);
        Game.creeps[name].memory.policyId = build.policyId;
    }
    return name;
};

RouteNeutralPorter.prototype.respawnRate = function(distance, energyCapacity, size) {
    var tripsPerLife = CREEP_LIFE_TIME / (2*distance)
    var energyPerLife = tripsPerLife * size * CARRY_CAPACITY;
    var numberWorkersNeeded = energyCapacity/energyPerLife;
    return CREEP_LIFE_TIME/numberWorkersNeeded;
};

module.exports = RouteNeutralPorter;


































