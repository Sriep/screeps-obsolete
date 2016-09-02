/**
 * Created by Piers on 15/08/2016.
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
 * @module RouteAttackRoom
 */

function RouteAttackRoom (targetRoomName, body, respawn, targetList) {
    this.type = gc.ROUTE_ATTACK_ROOM;
    this.targetRoomName = targetRoomName;
    this.body = body;
    this.respawn = respawn ? respawn : 0;
    this.targetList = targetList;
    this.due = 0;
}

RouteAttackRoom.prototype.spawn = function (build, spawn) {
    //console.log("RouteMiner spawn", spawn, JSON.stringify(build));
    //var body = raceSapper.body(build.move, build.work, build.heal);
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning miner",name);
        roleBase.switchRoles(
            Game.creeps[name],
            gc.ROLE_ATTACK_ROOM,
            build.targetRoomName,
            build.targetList
        );
        Game.creeps[name].memory.buildReference = build.targetRoomName;
    }
    return name;
};

RouteAttackRoom.prototype.energyCost = function(build) {
    return raceBase.energyFromBody(build.body);
};

RouteAttackRoom.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = RouteAttackRoom;