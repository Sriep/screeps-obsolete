/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */

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
var stats = require("stats");
var roleBase = require("role.base");


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
        "use strict";
        console.log("START MY  PAD START MY  PAD");

        var myroom = Game.rooms["W26S21"];
        var route = Game.map.findRoute("W26S21","W27S21");
        console.log("route between my rooms", JSON.stringify(route));

        cpuUsage.updateCpuUsage();
        console.log("average cpu usage is", cpuUsage.averageCpuLoad())
        

    }
    
}

module.exports = ayrtepPad;




































/**
 * Created by Piers on 07/07/2016.
 */
