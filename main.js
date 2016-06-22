var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnWorker = require('spawn.worker');
var roadBuilder = require('road.builder');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require('screeps-profiler');
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        var tower = Game.getObjectById('TOWER_ID');
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
        
		var roomName;
        for(var name in Game.rooms) {
			console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
			console.log('Room "'+name+'" has '+Game.rooms[name].energyCapacityAvailable+' max energy capacity');
			roomName = name;
		}
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        console.log('Harvesters: ' + harvesters.length);
        if (harvesters.length <= 0) {
        	spawnWorker.run('harvester', roomName, "Spawn1", 0.0)
        } else if (harvesters.length < 6) {
            spawnWorker.run('harvester', roomName, "Spawn1", 0.8);
        } else {
        
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            console.log('Upgraders: ' + upgraders.length);
            if(upgraders.length < 7) {
                spawnWorker.run('upgrader', roomName, "Spawn1", 0.8);
            } else {
        
                var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
                console.log('Builders: ' + harvesters.length);
                if(builders.length < 0) {
                    spawnWorker.run('builder', roomName, "Spawn1", 0.8);
                } // if(builders.length < 4)
            } // upgraders.length < 4) 
        } // harvesters.length <= 0) 
        
    
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        } // for(var name in Game.creeps)
        
        console.log('CPU time used from the beginning of the current game tick ' + Game.cpu.getUsed());
        console.log('CPU limit ' + Game.cpu.limit);
        console.log('Avialible CPUat current tick ' + Game.cpu.tickLimit);
        console.log('Accumulated CPU in bucket ' + Game.cpu.bucket);
        console.log('*********************************************************');
    }) // profiler.wrap(function()
}



































