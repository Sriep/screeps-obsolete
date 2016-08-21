/**
 * Created by Piers on 21/08/2016.
 */
/**
 * Created by Piers on 02/08/2016.
 */
/**
 * Created by Piers on 17/07/2016.
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
var raceBase = require("race.base");
var raceScout = require("race.scout");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module routeMoveResource
 */

function routeMoveResource (from, to, resourceId, body, respawnRate) {
    this.type = gc.ROUTE_SCOUT;
    this.targetRoom = targetRoom;
    this.from = from;
    this.to = to;
    this.resourceId = resourceId;
    this.respawnRate = respawnRate;
    this.body = body;
    this.due = 0;
}

routeMoveResource.prototype.spawn = function (build, spawn) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning scout",name);
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_MOVE_RESOURCE,
            build.from,
            build.to,
            build.resourceId
        );
        Game.creeps[name].memory.buildReference = build.targetRoom;
    }
    return name;
};

routeMoveResource.prototype.energyCost = function(build) {    // Hack until raceBase.energyFromBody gets implemented
    if (raceBase.energyFromBody(build.body)) {
        return raceBase.energyFromBody(build.body)
    }
    return raceScout.energyFromSize(build.body.length);
};

routeMoveResource.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = routeMoveResource;





















