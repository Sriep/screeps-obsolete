/**
 * Created by Piers on 10/08/2016.
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
var raceCleric = require("race.cleric");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module RouteSuppressKeepers
 */

function RouteSuppressKeepers (keeperRoom, body, respawnRate, atttack, heal) {
    this.type = gc.ROUTE_SUPPRESS_KEEPERS;
    this.keeperRoom = keeperRoom;
    if (body) {
        this.body = body;
    } else {
        this.body = raceCleric.body(atttack, heal)
    }
    if (undefined !== respawnRate)
        this.respawnRate = respawnRate;
    else
        this.respawnRate = CREEP_LIFE_TIME - 100;
    this.due = 0;
}

RouteSuppressKeepers.prototype.spawn = function (build, spawn) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning scout",name);
        roleBase.switchRoles(
            Game.creeps[name],
            gc.ROLE_SUPPRESS_KEEPERS,
            build.keeperRoom
        );
        Game.creeps[name].memory.buildReference = build.targetRoom;
        Memory.rooms[build.keeperRoom].suppressed = Game.time;
    }
    return name;
};

RouteSuppressKeepers.prototype.energyCost = function(build) {    // Hack until raceBase.energyFromBody gets implemented
   // i//f (raceBase.energyFromBody(build.body)) {
   //     return raceBase.energyFromBody(build.body)
   // }
  //  return raceCleric.energyFromSize(build.body.length);
    return 4800;
};

RouteSuppressKeepers.prototype.parts = function(build) {
    //console.log(JSON.stringify(build));
    //return build.body.length;
    return 50;
};

module.exports = RouteSuppressKeepers;





















