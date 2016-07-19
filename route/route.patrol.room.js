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
var raceWorker = require("race.worker");
var raceSwordsman = require("race.swordsman");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RoutePatrolRoom  (room, patrolRoom, startPos, body, respawnRate) {
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
}

RoutePatrolRoom.prototype.spawn = function (build, spawn, room ) {
    console.log("trying to spawn RoutePatrolRoom");
    var body = raceWorker.body(raceWorker.maxSizeRoom(room));
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning transporter",name);
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_PATROL_ROOM,
            build.patrolRoom,
            build.startPos
        );
    }
    return name;
};

module.exports = RoutePatrolRoom;





























