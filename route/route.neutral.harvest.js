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
var raceBase = require("race.base");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RouteNeutralHarvest  (room,sourceRoom,sourceId,offloadId,size,fast,respawnRate) {
    this.type = gc.ROUTE_NEUTRAL_HARVEST;
    this.owner = room;
    this.sourceRoom = sourceRoom;
    this.sourceId = sourceId;
    this.offlaodId = offloadId;
    this.size = size;
    if (undefined === size) {
        raceWorker.maxSizeRoom(room);
    }
    this.fast = fast;
    this.respawnRate =respawnRate;
    if (undefined === respawnRate) {
        this.respawnRate = CREEP_LIFE_TIME;
    }
    this.due = 0;
}

RouteNeutralHarvest.prototype.spawn = function (build, spawn, room ) {
    console.log("trying to spawn RouteNeutralHarvest");
    var body = raceWorker.body(build.size, build.fast);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_NEUTRAL_HARVESTER,
            build.sourceRoom,
            build.owner,
            build.sourceId,
            build.offlaodId);
    }
    return name;
};

module.exports = RouteNeutralHarvest;






























