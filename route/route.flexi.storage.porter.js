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


/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteFlexiStoragePorter
 */

function  RouteFlexiStoragePorter  (room, respawnRate, policyId, size) {
    this.type = gc.ROUTE_FLEXI_STORAGE_PORTER;
    this.role = gc.ROLE_FLEXI_STORAGE_PORTER;
    this.owner = room;
    if (size) {
        this.size = size;
    } else {
        this.size = raceWorker.maxSizeRoom(Game.rooms[room]);
    }
    this.policyId = policyId;
    this.body = raceWorker.body(this.size);
    this.respawnRate = respawnRate;
    this.due = 0;
}

RouteFlexiStoragePorter.prototype.spawn = function (build, spawn, room ) {
   // console.log("trying to spawn RouteFlexiStoragePorter");
    var body = raceWorker.body(build.size);
    var name = stats.createCreep(spawn, body, undefined, undefined);
    //console.log(room,spawn,"RouteFlexiStoragePorter spawn result", name, body);
    if (_.isString(name)) {
        roleBase.switchRoles(Game.creeps[name],
            gc.ROLE_FLEXI_STORAGE_PORTER);
        Game.creeps[name].memory.policyId = build.policyId;
        Game.creeps[name].memory.buildReference = build.owner;
       // console.log("RouteFlexiStoragePorter spawn name is string name", name);
    }
    this.boostActions = [gc.HARVEST, gc.CAPACITY, gc.FATIGUE];
    return name;
};

RouteFlexiStoragePorter.prototype.roleParameters  = function (build) {
    return [];
};

RouteFlexiStoragePorter.prototype.energyCost = function(build) {
    return raceWorker.energyFromSize(build.size);
};

RouteFlexiStoragePorter.prototype.parts = function(build) {
    return 2 * build.size;
};

module.exports = RouteFlexiStoragePorter;


































