
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
var cpuUsage = require("cpu.usage");

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
  
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
                
        var cpuLoad = cpuUsage.averageCpuLoad();
        
        for(var name in Game.rooms) {
			console.log("Room " + name+" has "+Game.rooms[name].energyAvailable+" energy");
			console.log("Room " +name+" has "+Game.rooms[name].energyCapacityAvailable+" max energy capacity");
			var roomName = name;
			
            raceWorker.spawn(roomName, "Spawn1");
            raceWorker.assignRoles(roomName);			
		}
		  
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == raceWorker.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            } else if (creep.memory.role == raceWorker.ROLE_UPGRADER) {
                roleUpgrader.run(creep);               
            } else if (creep.memory.role == raceWorker.ROLE_BUILDER) {
                roleBuilder.run(creep);
            } else if(creep.memory.role == raceWorker.ROLE_REPAIRER) {
                roleRepairer.run(creep);
            }
            //console.log(creep.name + " has " + creep.ticksToLive + 
            //    " ticks to live and is a " + creep.memory.role);           
        } // for(var name in Game.creeps)
        
        /*
        var sources = Game.rooms[roomName].find(FIND_SOURCES);
        for ( var i in  sources ) {
            console.log("source " + sources[i] );
        }*/
        //console.log(JSON.stringify(Memory))
        console.log("CPULoad is " + cpuLoad);
        console.log('CPU time used from the beginning of the current game tick ' + Game.cpu.getUsed());
        console.log('CPU limit ' + Game.cpu.limit);
        console.log('Avialible CPUat current tick ' + Game.cpu.tickLimit);
        console.log('Accumulated CPU in bucket ' + Game.cpu.bucket);
        console.log('************************ " + Game.time + " *********************************');
        cpuUsage.updateCpuUsage();
    }) // profiler.wrap(function()
}

//Game.spawns.Spawn1.createCreep( [MOVE], 'Scout1' );
//target = Game.getObjectById("55db312fefa8e3fe66e04878"); 
//Game.creeps["Scout1"].moveTo(target);
//Game.creeps["Scout1"].move(LEFT);
//Game.creeps["Scout1"].moveTo(1,40);
//console.log("Scouts bodyarry is" + Game.creeps["Scout1"].bodyarray);

































