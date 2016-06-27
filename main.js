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

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
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
            policy.enactPolicies();
		}		 
		
        console.log("CPULoad is " , cpuLoad);
        console.log('CPU time used from the beginning of the current game tick ' , Game.cpu.getUsed());
        console.log("CPU usage " , JSON.stringify(Game.cpu));
        console.log("Global contol level GCL " , JSON.stringify(Game.gcl));
        //console.table([{"level":"level","progress":"progress","progressTotal":"progressTotal"}
        //                ,JSON.stringify(Game.gcl)]);
        cpuUsage.updateCpuUsage();
        var myroom = Game.rooms["W26S21"];  
        
        //sources = myroom.find(FIND_SOURCES);
        //for (var i in sources)
        //{
        //    console.log(sources[i] + " has asspoints " + roomOwned.accessPoints(myroom, sources[i].pos));    
        //}
        
        var now = new Date();
        hour = now.getHours();
        min  = now.getMinutes();
        sec  = now.getSeconds();
        date = now.getDate();     
        month = now.getMonth() + 1;  
        year = now.getFullYear();
        var longtime = hour + ":" + min + ":" + sec + " "
            + date + "/" + month + "/" + year;
        if (Game.time % 1500 == 0) { 
            Game.notify("Tick Time Date Contoller\n"
                + Game.time +  " " + longtime + " " + myroom.controller.progress);           
        }

        var workerSize = 5;
        var force = true;
        console.log("Havest peace " , roomOwned.peaceHavesters(myroom, workerSize, force),"workersize", workerSize);
        console.log("Upgrade peace " , roomOwned.peaceUpgraders(myroom, workerSize, force));  
        console.log("War Havest " , roomOwned.warTimeHavesters(myroom, workerSize, force));  
        console.log("Consruct HAvesters " , roomOwned.constructHavesters(myroom, workerSize, force));  
        console.log("Costruct Builders " , roomOwned.constructBuilders(myroom, workerSize, force)); 
        console.log("Havest links " , roomOwned.linkHavesters(myroom, workerSize, force),"workersize", workerSize);
        console.log("Upgrade links " , roomOwned.linkUpgraders(myroom, workerSize, force));  

        //console.log("harvest trip " , roomOwned.getHavestRoundTripLength(myroom, "true")); 
        //console.log("upgrade trip " , roomOwned.getUpgradeRondTripLength(myroom, "true")); 
        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]

































