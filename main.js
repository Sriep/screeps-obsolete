/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */

var raceBase = require("race.base");
var freememory = require("freememory");
var policy = require("policy");
var stats = require("stats");
var ayrtepPad = require("ayrtep.pad");
var cpuUsage = require("cpu.usage");

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        PathFinder.use(true);
        try {
            ayrtepPad.top();
        }
        catch(exp) {
            conole.log("ops",exp);
        }
        
        freememory.freeCreeps();
        policy.enactPolicies();
        raceBase.moveCreeps();

        ayrtepPad.bottom();


        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]



































