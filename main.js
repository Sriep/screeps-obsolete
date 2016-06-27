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
        
        //var tower = Game.getObjectById("576ce5599b0f1fa6144bae55");
        //if(tower) {
            /*console.log("Found tower " + tower);
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
    
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }*/
        //}
        //closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        //closestHostile(closestHostile);
        //hostile = Game.getObjectById(576e5ad65b8ba9d162b967e8);
        //tower = Game.getObjectById(576ce5599b0f1fa6144bae55);
        //tower.attack(hostile);
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
                
        var cpuLoad = cpuUsage.averageCpuLoad();
        
        for(var roomIndex in Game.rooms) {
            var currentRoom = Game.rooms[roomIndex];
            //roomOwned.newTickUpdate(currentRoom);
            //defendRoom(roomIndex);
			console.log("Room " + roomIndex+" has "
			    +currentRoom.energyAvailable+" energy");
			console.log("Room " +roomIndex+" has "
			    +currentRoom.energyCapacityAvailable+" max energy capacity");
			var controllerLevel = currentRoom.controller.level;
            spawns = currentRoom.find(FIND_MY_SPAWNS);
            //console.log("myspawns", spawns);
            //raceWorker.spawn(roomIndex, "Spawn1");
            //raceWorker.spawn(roomIndex, "Spawn1", raceWorker.biggistSpawnable(roomIndex));
            //roomOwned.setWorkerSize(currentRoom, 6);
            //raceWorker.assignRoles(currentRoom);
            //raceWorker.moveCreeps(currentRoom);
            //var policy = require("policy");
            policy.enactPolicies();
		}		 
		
		
		//for(var i in Game.creeps) {
		//    console.log(Game.creeps[i].name + " has fatigue " +  Game.creeps[i].fatigue );   
		//}
		
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
        
        console.log("Havest equlib " , roomOwned.peaceHavesters(myroom, undefined, true));
        console.log("Upgrade equlib " , roomOwned.peaceUpgraders(myroom, undefined, true));  
        console.log("War Havest " , roomOwned.warTimeHavesters(myroom, undefined, true));  
        console.log("Consruct HAvesters " , roomOwned.constructHavesters(myroom, undefined, true));  
        console.log("Costruct Builders " , roomOwned.constructBuilders(myroom, undefined, true));  
        //console.log("harvest trip " , roomOwned.getHavestRoundTripLength(myroom, "true")); 
        //console.log("upgrade trip " , roomOwned.getUpgradeRondTripLength(myroom, "true")); 
        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]
//Game.spawns.Spawn1.createCreep( [MOVE], 'Scout1' );
//target = Game.getObjectById("55db312fefa8e3fe66e04878"); 
//Game.creeps["Scout1"].moveTo(target);
//Game.creeps["Scout1"].move(LEFT);
//Game.creeps["Scout1"].moveTo(1,40);
//console.log("Scouts bodyarry is" + Game.creeps["Scout1"].bodyarray);

  //function defendRoom(room) {
    /*
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
    
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            var towers = room.find(FIND_MY_STRUCTURES, 
                {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }*/
    //}
































