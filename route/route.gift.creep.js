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
var raceWorker = require("race.worker");
var raceSwordsman = require("race.swordsman");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteGiftCreep
 */

function RouteGiftCreep  (room, policyId, bdoy, role, respawnRate) {
    this.type = gc.ROUTE_GIFT_CREEP;
    this.owner = room;
    this.policy = policyId;
    this.respawnRate = respawnRate;
    this.body = body;
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
            gc.ROLE_PATROL_ROOM,
            build.policyId,
            build.role
        );
    }
    return name;
};

module.exports = RouteGiftCreep;





















