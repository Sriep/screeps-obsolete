/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */
"use strict";
var roadBuilder = require("road.builder");
var TaskMovePos = require("task.move.pos");
var TaskAttackId = require("task.attack.id");
var TaskAttackTarget = require("task.attack.target");
var TaskMoveFind = require("task.move.find");
var TaskWait = require("task.wait");
var TaskMoveRoom = require("task.move.room");
var raceBase = require("race.base");
var freememory = require("freememory");
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
var policyFrameworks = require("policy.frameworks");
var cpuUsage = require("cpu.usage");
var roomOwned = require("room.owned");
var policy = require("policy");
var policyPeace = require("policy.peace");
var stats = require("stats");
var roleBase = require("role.base");
var gc = require("gc");
var PoolRequisition = require("pool.requisition");
var policyMany2oneLinker = require("policy.many2one.linker");


var ayrtepPad = {
    top: function () {
        "use strict";
        var roomcount = 0, creepcount = 0;
        for (var roomIndex in Game.rooms) {
            var currentRoom = Game.rooms[roomIndex];
            console.log("Room " + roomIndex + " has " + currentRoom.energyAvailable + " energy and "
                + currentRoom.energyCapacityAvailable  + " max energy capacity");
            var spawns = currentRoom.find(FIND_MY_SPAWNS);
            roomcount++;
        }
        for (var i in Game.creeps) { creepcount++  }
        console.log("Have", roomcount, "rooms and", creepcount, "creeps")
    },
    
    bottom: function () {
        console.log("START MY  PAD START MY  PAD");
        var myroom = Game.rooms["W26S21"];
        var route = Game.map.findRoute("W26S21", "W27S21");
     //   console.log("route between my rooms", JSON.stringify(route));
        cpuUsage.updateCpuUsage();
        console.log("average cpu usage is", cpuUsage.averageCpuLoad());
        var roomName = "W26S21";
        var room = Game.rooms[roomName];

      /*  if ( Game.time % 1500 == 0 ) {
            policyFrameworks.createForeignHarvest("W26S22", "W26S21", 11, "55db3176efa8e3fe66e04a55", true);
            policyFrameworks.createPotrolRoomPolicy( { roomName : "W26S22" , x : 28 , y : 14 }, 8, true);
        }*/
        if ( Game.time % 750 == 0 ) {
           policyFrameworks.createForeignHarvest("W26S23", "W26S21", 9, "55db3176efa8e3fe66e04a58", undefined, true);
        }

        if ( Game.time % 1000 == 0 ) {
            policyFrameworks.createPotrolRoomPolicy( { roomName : "W26S22" , x : 28 , y : 14 }, 8, true);
        }


      //  for (var i in Game.creeps) {
       //     console.log( Game.creeps[i],"is suitable for linker"
      //          ,policyMany2oneLinker.bodySuitableForLinker(Game.creeps[i]));
      //  }

        //if (Game.rooms["W26S23"] !== undefined) {
       ///     console.log("Owner of W26S23s controller", Game.rooms["W26S23"].controller.owner);
       // }


       // console.log("max yard size", PoolRequisition.prototype.getMaxYardSize());
      //  var policyFrameworks = require("policy.frameworks");
     //   policyFrameworks.createPotrolRoomPolicy( { roomName : "W26S22" , x : 28 , y : 14 }, 2, true);
       // var policyFrameworks = require("policy.frameworks");
      //  policyFrameworks.createForeignHarvest("W26S23", "W26S21", 1, "55db3176efa8e3fe66e04a58", undefined, true);

      //  policyFrameworks.createForeignHarvest("W26S22", "W26S21", 11, "55db3176efa8e3fe66e04a54",undefined, true);


       // var policyFrameworks = require("policy.frameworks");
       // policyFrameworks.createPotrolRoomPolicy("W26S22", 7, true)


        /*
         var policyFrameworks = require("policy.frameworks");
         policyFrameworks.createAttackStructuresPolicy(
             [
                 "5783a46a6aa59c6c1ab88870"
                ,"57841b8f0c99d6b70a2f5960"
                ,"578516b21e18f7eb7944645f"
             ], ["W26S20","W26S20","W26S20"]
             , 5,1,{x:8,y:45,roomName:"W26S20"},true);
        */
      //  console.log( "obejct form id 57851597d599d48310a54265" , Game.getObjectById("57851597d599d48310a54265"));
     //   console.log( "obejct form id 57768a5f95c1a3010d2158e7"  , Game.getObjectById("57768a5f95c1a3010d2158e7"));

        //Memory.policies[0].requisitions = {};
        //Memory.policies[0].supplyCentres["W26S21"].buildqueue = [];

       // var policyFrameworks = require("policy.frameworks");
     //   policyFrameworks.createNeutralBuilderPolicy("W26S20", "W26S21",5,true);

       // Memory.policies[52633] = undefined

      //  var creep = Game.creeps["Kaelyn"];
       // creep.moveTo(28,0);

  //  roadBuilder.run( {roomName : "W26S22", x: 27 , y : 2 }, {roomName : "W26S22", x: 36 , y : 12 } );
/*
        var creep3 = Game.creeps["Aaron"];
         target = creep3.pos.findClosestByRange(FIND_STRUCTURES, {
             filter: { structureType: STRUCTURE_WALL} });
        if(target) {
            if(creep3.attack(target) == ERR_NOT_IN_RANGE) {
                creep2.moveTo(target);
            }
        }*/

      /*
        var taskList =[];
        var moveToRoom, moveToTarget,attackTarget

         moveToRoom = new TaskMoveRoom("W26S22");
         moveToTarget = new TaskMoveFind(gc.FIND_ID, gc.RANGE_ATTACK, "5769d260b2a47f58549f1f78");
         attackTarget = new TaskAttackId("5769d260b2a47f58549f1f78");
         taskList.push(moveToRoom);
         taskList.push(moveToTarget);
         taskList.push(attackTarget);

         moveToRoom = new TaskMoveRoom("W26S22");
         moveToTarget = new TaskMoveFind(gc.FIND_ID, gc.RANGE_ATTACK, "5768460790d5359b513a0412");
         attackTarget = new TaskAttackId("5768460790d5359b513a0412");
         taskList.push(moveToRoom);
         taskList.push(moveToTarget);
         taskList.push(attackTarget);

        creep.memory.tasks.tasklist  = taskList;8/



           //  creep.moveTo(28,46);

   //            creep.memory.policyId = 45656;
             /*   creep.memory.policyId = -1;
                var roleBase = require("role.base");
                var tasks = require("tasks");
                var roleNeutralBuilder = require("role.neutral.builder");
                tasks.setTargetId(creep,undefined);
                creep.memory.tasks.tasklist = roleNeutralBuilder.getTaskList("W26S20","W26S21");
        */

    }
}

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
