/**
 * Created by Piers on 23/07/2016.
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
var raceBase = require("race.base");
var raceWorker = require("rase.worker");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteFlexiStoragePorter
 */

function  RouteFlexiStoragePorter  (room, respawnRate) {
    this.type = gc.ROUTE_NEUTRAL_PORTER;
    this.owner = room;
    this.size = raceWorker.maxSizeRoom(room);
    this.respawnRate = respawnRate;
    this.due = 0;
}

RouteFlexiStoragePorter.prototype.spawn = function (build, spawn, room ) {
    //console.log("trying to spawn RouteFlexiStoragePorter");
    var body = raceWorker.body(build.size);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_FLEXI_STORAGE_PORTER);
    }
    return name;
};

module.exports = RouteFlexiStoragePorter;


































