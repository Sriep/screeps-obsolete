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


        // var creep = Game.creeps["Levi"];
        //  policyPeace.convertStorageRepairer(creep);
      //  var myroom = Game.rooms["W26S21"];
      //  var room1 = "W26S21";
      //  var room2 = "W27S21"
       // var route = Game.map.findRoute(room1,room2);
       // console.log("route between",room1,"and",room2,"is", JSON.stringify(route));

        //var roleBase = require("role.base");; var creep = Game.creeps["Abigail"]; roleBase.resetTasks(creep);

       // var creep = Game.creeps["Arianna"];
       // var   policyMany2OneLinker=require("policy.many2one.linker");
      //  policyMany2OneLinker.convertPorter(creep);
       // console.log("size 1 upgader",roomOwned.energyLifeTime(myroom, 1, "upgrader")
        //    ,"porter",roomOwned.energyLifeTime(myroom, 1,  gc.ROLE_ENERGY_PORTER));

        //console.log("size 5 upgader",roomOwned.energyLifeTime(myroom, 5, "upgrader")
        //    ,"porter",roomOwned.energyLifeTime(myroom, 5, gc.ENERGY_PORTER));


       // console.log("size 1 upgader",roomOwned.energyLifeTime(myroom, 11, "upgrader")
     //       ,"porter",roomOwned.energyLifeTime(myroom, 11, gc.ENERGY_PORTER));



        // room.memory.linkState = "linkForming";
       // room.memory.links.linkState = undefined;
       /* Links two sources to a storage object next to a mine.
        room.memory.links = {};
        room.memory.links.fromLinks = undefined;
        room.memory.links.toLink = undefined;
        room.memory.links.linkState = "linkForming";
        //room.memory.links.links = undefined;
      //  room.memory.links.fromLinksFormed = undefined;

       var fromLink1 = { fromId : "55db3176efa8e3fe66e04a50", resource : RESOURCE_ENERGY
                      , x : 13, y : 16, fromLinkId : "577dfc4a028278ee71b2c875" }
       var fromLink2 = { fromId : "55db3176efa8e3fe66e04a52", resource : RESOURCE_ENERGY
                      , x : 8, y : 35, fromLinkId : "57711380ad3cbdff451970ec" }
       var toLink = { toLinkId : "577ec1375a1c85636f551c4b", x : 42, y : 28
                            , storageId : "577a8dd4b973e61c594592dc"
                          , mineId : "56e14bf41f7d4167346e0a76", mineResource : RESOURCE_OXYGEN }

        room.memory.links = {};
        room.memory.links.fromLinks = []
        room.memory.links.fromLinks.push(fromLink1);
        room.memory.links.fromLinks.push(fromLink2);
        room.memory.links.toLink = toLink;
        room.memory.links.linkState = "linkForming";*/



        /*
         var creeps = room.find(FIND_MY_CREEPS);
         for ( var i = 0 ; i < creeps.length ; i++ ) {
         creeps[i].memory.policyId = currentPolicy.id
         }
         */




    }
}

module.exports = ayrtepPad;









































































/**
 * Created by Piers on 07/07/2016.
 */
