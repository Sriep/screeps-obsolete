
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
var cpuUsage = require("cpu.usage");
var roomOwned = require("room.owned");

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
var profiler = require("screeps-profiler");
// This line monkey patches the global prototypes.
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        PathFinder.use(true);    
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
        
        for(var roomIndex in Game.rooms) {
			console.log("Room " + roomIndex+" has "
			    +Game.rooms[roomIndex].energyAvailable+" energy");
			console.log("Room " +roomIndex+" has "
			    +Game.rooms[roomIndex].energyCapacityAvailable+" max energy capacity");
			var controllerLevel = Game.rooms[roomIndex].controller.level;
            raceWorker.spawn(roomIndex, "Spawn1");
            raceWorker.assignRoles(roomIndex);			
		}
		 
		raceWorker.moveCreeps();
		
		//for(var i in Game.creeps) {
		//    console.log(Game.creeps[i].name + " has fatigue " +  Game.creeps[i].fatigue );   
		//}
		
        console.log("CPULoad is " + cpuLoad);
        console.log('CPU time used from the beginning of the current game tick ' + Game.cpu.getUsed());
        console.log("CPU usage " + JSON.stringify(Game.cpu));
        console.log("Global contol level GCL " + JSON.stringify(Game.gcl));
        //console.table([{"level":"level","progress":"progress","progressTotal":"progressTotal"}
        //                ,JSON.stringify(Game.gcl)]);
        cpuUsage.updateCpuUsage();
        var myroom = Game.rooms["W26S21"];  
        
        //sources = myroom.find(FIND_SOURCES);
        //for (var i in sources)
        //{
        //    console.log(sources[i] + " has asspoints " + roomOwned.accessPoints(myroom, sources[i].pos));    
        //}
        
        console.log("Havest equlib " + roomOwned.eqlibHavesters(myroom, true));
        console.log("Upgrade equlib " + roomOwned.equlibUpgraders(myroom, true));        
        console.log("harvest trip " + roomOwned.getHavestRoundTripLength(myroom, "true")); 
        console.log("upgrade trip " + roomOwned.getUpgradeRondTripLength(myroom, "true")); 
        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//Game.rooms["W26S21"]
//Game.spawns.Spawn1.createCreep( [MOVE], 'Scout1' );
//target = Game.getObjectById("55db312fefa8e3fe66e04878"); 
//Game.creeps["Scout1"].moveTo(target);
//Game.creeps["Scout1"].move(LEFT);
//Game.creeps["Scout1"].moveTo(1,40);
//console.log("Scouts bodyarry is" + Game.creeps["Scout1"].bodyarray);

Game.rooms["W26S21"]































