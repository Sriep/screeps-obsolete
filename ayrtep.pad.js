/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */
"use strict";
var raceBase = require("race.base");
var freememory = require("freememory");
var raceWorker = require("race.worker");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
var cpuUsage = require("cpu.usage");
var roomOwned = require("room.owned");
var policy = require("policy");
var policyPeace = require("policy.peace");
var stats = require("stats");
var roleBase = require("role.base");
var gc = require("gc");


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
        //console.log("route between my rooms", JSON.stringify(route));
        cpuUsage.updateCpuUsage();
        console.log("average cpu usage is", cpuUsage.averageCpuLoad());
        var roomName = "W26S21";
        var room = Game.rooms[roomName];




        //Memory.policies[0].requisitions = {};
        //Memory.policies[0].supplyCentres["W26S21"].buildqueue = [];

      //  console.log("ayrtep {a:a, b:b}",JSON.stringify( {a:"a", b:"b"} ));
     //   console.log("ayrtep [{a:a, b:b}]",JSON.stringify( [{a:"a", b:"b"}] ));

     //   var policyFrameworks = require("policy.frameworks");
    //    policyFrameworks.createNeutralBuilderPolicy("W26S20", "W26S21",5,true);

    //         var creep = Game.creeps["Parker"];
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
