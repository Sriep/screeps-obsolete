
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var spawnWorker = require("spawn.worker");
var roadBuilder = require("road.builder");


// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        var tower = Game.getObjectById("TOWER_ID");
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
    
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
        
        var AverageCPU = 0;
        CPU_MEMORY_LENGTH = 20;
        if ("cpuUsage" in Memory)
        {
        	for (var i in Memory.cpuUsage)
        	{
        		AverageCPU = AverageCPU + Memory.cpuUsage[i];   
        	}
        	if (Memory.cpuUsage.length > 0)
        	{
        		AverageCPU = AverageCPU/Memory.cpuUsage.length
        	}
        } else {
        	Memory.cpuUsage = new Array(CPU_MEMORY_LENGTH).fill(0);
        }
        console.log("Average CPUs " + AverageCPU);
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
		var roomName;
        for(var name in Game.rooms) {
			console.log("Room " + name+" has "+Game.rooms[name].energyAvailable+" energy");
			console.log("Room " +name+" has "+Game.rooms[name].energyCapacityAvailable+" max energy capacity");
			roomName = name;
		}
		
		var cpuLoad = AverageCPU/Game.cpu.limit;
        raceWorker.spawn(cpuLoad, roomName, "Spawn1");
        raceWorker.assignRoles(cpuLoad, roomName);
    
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == raceWorker.HARVESTER) {
                roleHarvester.run(creep);
            } else if (creep.memory.role == raceWorker.UPGRADER) {
                roleUpgrader.run(creep);
                
            } else if (creep.memory.role == raceWorker.BUILDER) {
                roleBuilder.run(creep);
            } else if(creep.memory.role == raceWorker.REPAIRER) {
                roleRepairer.run(creep);
            }
            console.log(creep.name + " has " + creep.ticksToLive + 
                " ticks to live and is a " + creep.memory.role);           
        } // for(var name in Game.creeps)
        
        var sources = creep.room.find(FIND_SOURCES);
        for ( var i in  sources ) {
            console.log("source " + sources[i] );
        }
        console.log(JSON.stringify(Memory))
        console.log('CPU time used from the beginning of the current game tick ' + Game.cpu.getUsed());
        console.log('CPU limit ' + Game.cpu.limit);
        console.log('Avialible CPUat current tick ' + Game.cpu.tickLimit);
        console.log('Accumulated CPU in bucket ' + Game.cpu.bucket);
        if (Memory.cpuUsage.length > 0)
        {
        	Memory.cpuUsage.shift();
        }
        Memory.cpuUsage.push(Game.cpu.getUsed());
        console.log('*********************************************************');
    }) // profiler.wrap(function()
}



































