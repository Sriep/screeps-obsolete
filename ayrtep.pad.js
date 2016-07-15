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
var raceClaimer = require("race.claimer");
var policy = require("policy");
var PoolRequisition = require("pool.requisition");
var TaskMoveFind = require("task.move.find");
var TaskMoveRoom = require("task.move.room");
var TaskActionTarget = require("task.action.target");
var policyThePool = require("policy.the.pool");
var gc = require("gc");

var ayrtepPad = {
    top: function () {
        "use strict";
        var roomcount = 0, creepcount = 0;
        for (var roomIndex in Game.rooms) {
            var currentRoom = Game.rooms[roomIndex];
        ////    console.log("Room " + roomIndex + " has " + currentRoom.energyAvailable + " energy and "
          //      + currentRoom.energyCapacityAvailable  + " max energy capacity");
            var spawns = currentRoom.find(FIND_MY_SPAWNS);
            roomcount++;
        }
        for (var i in Game.creeps) { creepcount++  }
      //  console.log("Have", roomcount, "rooms and", creepcount, "creeps")
    },
    
    bottom: function () {
        console.log("START MY  PAD START MY  PAD");
        var myroom = Game.rooms["W26S21"];
        //  var route = Game.map.findRoute("W26S21", "W27S21");
        //   console.log("route between my rooms", JSON.stringify(route));
        cpuUsage.updateCpuUsage();
        //  console.log("average cpu usage is", cpuUsage.averageCpuLoad());
        var roomName = "W26S21";
        var room = Game.rooms["W26S21"];
        //Memory.policies[0].supplyCentres["W26S21"].buildqueue = [];

        var room = Game.rooms["W25S22"];
        //room.memory.links = {};

        //var creep = Game.creeps["Emma"];
       // roleBase.switchRoles(creep, gc.ROLE_HARVESTER);

      // var creep = Game.creeps[" Callie"];
      //  roleBase.switchRoles(creep, gc.ROLE_HARVESTER)//,"55db3189efa8e3fe66e04b7d","5788fd5ed480c0fe5bb3adb7",undefined);
      //  var creep2= Game.creeps["Emma"];
      //  roleBase.switchRoles(creep2, gc.ROLE_HARVESTER);//,"55db3189efa8e3fe66e04b7c","5788110778680d884032594a",undefined);
    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
