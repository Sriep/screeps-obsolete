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
var raceSwordsman = require("race.swordsman");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteGiftCreep
 */

function RouteGiftCreep  (room, targetRoom, policyId, body, role, respawnRate) {
    this.type = gc.ROUTE_GIFT_CREEP;
    this.owner = room;
    this.targetRoom = targetRoom;
    this.policyId = policyId;
    this.respawnRate = respawnRate;
    this.body = body;
    this.role = role;
    if (undefined == body) {
        this.body = raceSwordsman.body(1);
    }
    if (undefined === respawnRate) {
        this.respawnRate = CREEP_LIFE_TIME;
    }
    this.due = 0;
}

RouteGiftCreep.prototype.spawn = function (build, spawn, room ) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning transporter",name);
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_GIFT,
            build.targetRoom,
            build.policyId,
            build.role
        );
        Game.creeps[name].memory.buildReference = build.policy;
        //Game.creeps[name].memory.policyId = build.policyId;
    }
    return name;
};

RouteGiftCreep.prototype.energyCost = function(build) {    // Hack until raceBase.energyFromBody gets implemented
    if (raceBase.energyFromBody(build.body)) {
        return raceBase.energyFromBody(build.body)
    }
    return raceSwordsman.energyFromSize(build.body.length/2);
};

RouteGiftCreep.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = RouteGiftCreep;





















