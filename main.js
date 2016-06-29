/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */

var raceBase = require("race.base"); 
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
var cpuUsage = require("cpu.usage");
var roomOwned = require("room.owned");
var policy = require("policy");
var stats = require("stats");

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        var myroom = Game.rooms["W26S21"];   
        stats.startTick(myroom);
        PathFinder.use(true);   
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
                
        var cpuLoad = cpuUsage.averageCpuLoad();
        
        for(var roomIndex in Game.rooms) {
            var currentRoom = Game.rooms[roomIndex];
			console.log("Room " + roomIndex+" has "
			    +currentRoom.energyAvailable+" energy");
			console.log("Room " +roomIndex+" has "
			    +currentRoom.energyCapacityAvailable+" max energy capacity");
			var controllerLevel = currentRoom.controller.level;
            spawns = currentRoom.find(FIND_MY_SPAWNS);          
		}		 
		policy.enactPolicies();
      //  console.log("CPULoad is " , cpuLoad);
       // console.log('CPU time used from the beginning of the current game tick ' , Game.cpu.getUsed());
      //  console.log("CPU usage " , JSON.stringify(Game.cpu));
      //  console.log("Global contol level GCL " , JSON.stringify(Game.gcl));       
                        

        var workerSize = 5;
        var force = true;
        console.log("Havest peace " , roomOwned.peaceHavesters(myroom, workerSize, force),"workersize", workerSize);
        console.log("Upgrade peace " , roomOwned.peaceUpgraders(myroom, workerSize, force));  
        console.log("War Havest " , roomOwned.warTimeHavesters(myroom, workerSize, force));  
        console.log("Consruct HAvesters " , roomOwned.constructHavesters(myroom, workerSize, force));  
        console.log("Costruct Builders " , roomOwned.constructBuilders(myroom, workerSize, force)); 
        console.log("Havest links " , roomOwned.supportHavesters(myroom, 
                           2, 15000, workerSize, force),"workersize", workerSize);
        console.log("Upgrade links " , roomOwned.supportUpgraders(myroom, 
                           2, 15000,     workerSize, force));  
        console.log("Number spportable " , roomOwned.numWorkersSupportable(myroom, 
                            15000,     workerSize, force));  

        //console.log("harvest trip " , roomOwned.getHavestRoundTripLength(myroom, "true")); 
        //console.log("upgrade trip " , roomOwned.getUpgradeRondTripLength(myroom, "true")); 
        cpuUsage.updateCpuUsage();
        stats.endTick(myroom);
        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]

































