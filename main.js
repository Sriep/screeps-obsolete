/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */

var raceBase = require("race.base");
var freememory = require("freememory");
var policy = require("policy");
var stats = require("stats");
var ayrtepPad = require("ayrtep.pad");
var roomBase = require("room.base");
var flagBase = require("flag.base");
var gc = require("gc");
var cpuUsage = require("cpu.usage");
var recurringPolicies = require("recurring.policies");

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
//var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
//profiler.enable();

module.exports.loop = function () {
    //profiler.wrap(function() {
    //console.log("************************ Start ", Game.time," *********************************");
    PathFinder.use(true);
    ayrtepPad.top();

    roomBase.examineRooms();
    if (Game.time % gc.FLAG_UPDATE_RATE == 0 ){
        flagBase.run();
    }
    freememory.freeCreeps();
    policy.enactPolicies();
    raceBase.moveCreeps();

    ayrtepPad.bottom()

    console.log("************************ End ",  Game.time, " *********************************");
   // }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]



































