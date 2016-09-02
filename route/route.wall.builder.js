/**
 * Created by Piers on 08/08/2016.
 */
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

/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteWallBuilder
 */

function  RouteWallBuilder  (room, size) {
    this.type = gc.ROUTE_WALL_BUILDER;
    this.role = gc.ROLE_WALL_BUILDER;
    this.owner = room;
    if (size) {
        this.size = size;
    } else {
        this.size = raceWorker.maxSizeRoom(Game.rooms[room], true);
    }
    this.body = raceWorker.body(this.size, true);
    this.boostActions = [gc.BUILD,gc.FATIGUE];
    this.respawnRate = CREEP_LIFE_TIME;
    this.due = 0;
}

RouteWallBuilder.prototype.spawn = function (build, spawn, room ) {
    //console.log("trying to spawn RouteFlexiStoragePorter");
    //var body = raceWorker.body(build.size, true);
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],build.role);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.owner;
        Game.creeps[name].memory.boostInfoSet = "have not set boost stuff";
    }
    return name;
};

RouteWallBuilder.prototype.roleParameters  = function (build) {
    return [];
};

RouteWallBuilder.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size);
};

RouteWallBuilder.prototype.parts = function(build) {
    return build.size * 3;
};

module.exports = RouteWallBuilder;















