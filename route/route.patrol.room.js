/**
 * Created by Piers on 17/07/2016.
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
var raceBase = require("race.base");
var raceSwordsman = require("race.swordsman");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RoutePatrolRoom  (room, patrolRoom, startPos, body, respawnRate, reference) {
    this.type = gc.ROUTE_PATROL_ROOM;
    this.owner = room;
    this.patrolRoom = patrolRoom;
    this.startPos = startPos;
    this.respawnRate = respawnRate;
    this.body = body;
    if (undefined == body) {
        this.body = raceSwordsman.body(1);
    }
    if (undefined === respawnRate) {
        this.respawnRate = CREEP_LIFE_TIME;
    }
    this.due = 0;
    this.reference = reference;
}

RoutePatrolRoom.prototype.spawn = function (build, spawn, room ) {
    //console.log("trying to spawn RoutePatrolRoom");
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning transporter",name);
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_PATROL_ROOM,
            build.patrolRoom,
            build.startPos
        );
        Game.creeps[name].memory.buildReference = build.reference;
    }
    return name;
};

RoutePatrolRoom.prototype.equals = function (route1, route2 ) {
    return route1.type == route.type
        && route1.owner == route2.owner
        && route1.patrolRoom == route2.patrolRoom
        && route1.startPos == route2.startPos
        && JSON.stringify(route1.body)==JSON.stringify(route2.body)
        && route1.reference == route2.reference
        && route1.respawnRate == route2.respawnRate;
};

RoutePatrolRoom.prototype.energyCost = function(build) {
    // Hack until raceBase.energyFromBody gets implemented
    if (raceBase.energyFromBody(build.body)) {
        return raceBase.energyFromBody(build.body)
    }
    return raceSwordsman.energyFromSize(build.body.length/2);
};

RoutePatrolRoom.prototype.parts = function(build) {
    return build.body.length;
};

module.exports = RoutePatrolRoom;





























