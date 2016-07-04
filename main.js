/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */

var raceBase = require("race.base");
var freeMemory = require("free.memory");
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
        //Game.creeps["Peyton"].suicide();
        freeMemory.freeCreeps();


        mySuffArray = ["stuff1","stuff2"];
        Memory.test = mySuffArray;
        console.log("my memory.test",Memory.test);

        //var profiler = require("policy");
       // myPolicy =  policy.createNeutralBuilderPolicy("W26S21","W27S20", "W26S21", "W26S20",1,true);
        //myPolicy =  policy.createNeutralBuilderPolicy("W26S21","W27S20", "W26S21", "W26S21",1,true);
        //var profiler = require("policy");
       // policy.createGiftWorkersPolicy("W26S21", "W27S21", 0, true);
        //console.log("My new claim policy", myPolicy);
        //policy.activate(myPolicy);
        var cpuLoad = cpuUsage.averageCpuLoad();
        var roomcount = 0;
        var creepcount = 0;
        for(var roomIndex in Game.rooms) {
            var currentRoom = Game.rooms[roomIndex];
			console.log("Room " + roomIndex+" has "
			    +currentRoom.energyAvailable+" energy and " +currentRoom.energyCapacityAvailable
                +" max energy capacity");
			//var controllerLevel = currentRoom.controller.level;
            spawns = currentRoom.find(FIND_MY_SPAWNS);
            roomcount++;
		}
        for (var i in Game.creeps) {creepcount++}
        console.log("Have",roomcount,"rooms and",creepcount,"creeps");

        

        //policy.breakUpLinks(myroom);
        //Memory.policies = undefined;
        //try {
         policy.enactPolicies();
      //  }
     ///   catch (e) {
           // console.log("Exception thrwon from enactPolicies\n",e);
     //   }
        raceBase.moveCreeps();


       //Game.creeps["Savannah"].moveTo(40,25);
    //    Game.creeps["Jayce"].memory.workRoom = "W27S21";
    //    Game.creeps["Jayce"].memory.sourceRoom = "W27S21";
    //    Game.creeps["Jayce"].memory.targetSourceId = 0;
   //     Game.creeps["Jayce"].memory.type = "builder";

  //    Game.creeps["Elena"].moveTo(42,26);
  //     Game.creeps["Elena"].memory.workRoom = "W27S21";
 //       Game.creeps["Elena"].memory.sourceRoom = "W27S21";
 //       Game.creeps["Elena"].memory.targetSourceId = 0;
 //       Game.creeps["Elena"].memory.type = "builder";
     //   Game.creeps["Sebastian"].moveTo(42,27);
        //spawnConSite = Game.getObjectById("57781204b60c80ad1a31f7ef");
    //    Game.creeps["Mateo"].build(spawnConSite);
      //  Game.creeps["Christian"].build(spawnConSite);
       // Game.creeps["Christian"].moveTo(43,23);

    //   controller = Game.getObjectById("55db3151efa8e3fe66e0493d");
   //  Game.creeps["Savannah"].upgradeController(controller);

        //Game.creeps["Mateo"].moveTo(12,13);
        //controller = Game.getObjectById("55db3151efa8e3fe66e0493d");
        //Game.creeps["Mateo"].upgradeController(controller);
        //Game.creeps[Elijah].memory.role = "upgrader";
     //   Game.creeps["Maria"].moveTo(21,49);
       // Game.creeps["Maria"].moveTo(12,13);
       // Game.creeps["Maria"].claimController(Game.getObjectById("55db3151efa8e3fe66e0493d"));
      //  console.log("CPULoad is " , cpuLoad);
       // console.log('CPU time used from the beginning of the current game tick ' , Game.cpu.getUsed());
      //  console.log("CPU usage " , JSON.stringify(Game.cpu));
      //  console.log("Global contol level GCL " , JSON.stringify(Game.gcl));       
                        
/*
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
        //console.log("upgrade trip " , roomOwned.getUpgradeRondTripLength(myroom, "true"));*/
        cpuUsage.updateCpuUsage();
        stats.endTick(myroom);
        //Game.creeps["Adeline"].move(TOP);
        console.log("************************ " + Game.time + " *********************************");
    }) // profiler.wrap(function()
}
//JSON.stringify(memory);
//Game.rooms["W26S21"]

































