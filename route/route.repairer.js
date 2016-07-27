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
 * @module RouteFlexiStoragePorter
 */

function  RouteRepairer  (room, policyId) {
    this.type = gc.ROUTE_REPAIRER;
    this.owner = room;
    this.size = Math.min(raceWorker.maxSizeRoom(Game.rooms[room]),gc.REPAIRER_WORKER_SIZE);
    this.policyId = policyId;
    this.respawnRate = CREEP_LIFE_TIME;
    this.due = 0;
}

RouteRepairer.prototype.spawn = function (build, spawn, room ) {
    //console.log("trying to spawn RouteFlexiStoragePorter");
    var body = raceWorker.body(build.size);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_REPAIRER);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.owner;
    }
    return name;
};

RouteRepairer.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size);
};

module.exports = RouteRepairer;