/**
 * Created by Piers on 23/08/2016.
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
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteBoostAndSwitch
 */

function RouteBoostAndSwitch (body, labIds, role, roleParameters, respawnRate) {
    this.type = gc.ROUTE_BOOST_AND_SWITCH;
    this.body = body;
    this.labIds = labIds;
    this.role = role;
    this.roleParameters = roleParameters;
    if (respawnRate)
        this.respawnRate = respawnRate;
    else
        this.respawnRate = 0;
    this.due = 0;
}

RouteBoostAndSwitch.prototype.spawn = function (build, spawn) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning scout",name);
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_BOOST_AND_SWITCH,
            build.labIds,
            build.role,
            build.roleParameters
        );
        Game.creeps[name].memory.buildReference = build.targetRoom;
    }
    return name;
};

RouteBoostAndSwitch.prototype.energyCost = function(build) {    // Hack until raceBase.energyFromBody gets implemented
    return raceBase.getEnergyFromBody(build.body);
};

RouteBoostAndSwitch.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = RouteBoostAndSwitch;