/**
 * Created by Piers on 14/07/2016.
 */
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
var raceClaimer = require("race.claimer")

var recurringPolicies = {
        
    run: function () {
        console.log("Run recurring policyies");
        policyFrameworks = require("policy.frameworks");
      //  this.linksForW26S21();
       /// this.linksForW25S22();
        // ROOM W26S23
       if (Game.time % 750 == 0 )   {
            policyFrameworks.createForeignHarvest("W26S23", "W26S21", 9, "55db3176efa8e3fe66e04a58", undefined, true);
        }
        
        // ROOM W25S21
        if (Game.time % 800 == 200) {
            var policyFrameworks = require("policy.frameworks");
            var raceClaimer = require("race.claimer");
            var body = raceClaimer.body(3);
            policyFrameworks.createRemoteActionsPolicy("W25S21", "reserveController", "findController", "policy.remote.actions", body, true);
        }

        if (Game.time % 1250 == 0) {
            var policyFrameworks = require("policy.frameworks");
            policyFrameworks.createPotrolRoomPolicy({roomName: "W25S21", x: 28, y: 14}, 10, true);
        }
        
        if (Game.time % 750 == 250) {
            policyFrameworks.createForeignHarvest("W25S21", "W26S21", 9, "55db3189efa8e3fe66e04b78", undefined, true);
        }
        
        if (Game.time % 550 == 500) {
            policyFrameworks.createForeignHarvest("W25S21", "W26S21", 9, "55db3189efa8e3fe66e04b79", undefined, true);
        }
        
        // ROOM W26S22
        if (Game.time % 1250 == 0) {
            policyFrameworks.createPotrolRoomPolicy({roomName: "W26S22", x: 28, y: 14}, 8, true);
        }
        
        // ROOM W27S21
        if (Game.time % 1000 == 650) {
            policyFrameworks.createForeignHarvest("W27S21", "W26S21", 9, "55db3151efa8e3fe66e0493e", undefined, true);
        }
    },

    linksForW26S21: function () {
        console.log("In linksForW26S21");
        var room = Game.rooms["W26S21"];
        //if(!room.memory.links )
            room.memory.links = {};
        //if (!room.memory.links.info)
        room.memory.links.info = [];
        var link1 = {
            "fromId":"55db3176efa8e3fe66e04a50",
            "resource":"energy",
            "x":13,"y":16,
            "fromLinkId":"577dfc4a028278ee71b2c875",
            "toLinkId" : "577ec1375a1c85636f551c4b",
        }
        var link2 = {
            "fromId":"55db3176efa8e3fe66e04a52",
            "resource":"energy",
            "x":8,"y":35,
            "fromLinkId":"57711380ad3cbdff451970ec",
            "toLinkId" : "577ec1375a1c85636f551c4b",
        }
        var link3 = {
            "toLinkId" : "577ec1375a1c85636f551c4b",
            "storageId" : "577a8dd4b973e61c594592dc",
            "mineId" : "56e14bf41f7d4167346e0a76",
            "resource":"energy",
            "mineResource": RESOURCE_OXYGEN,
            "x":42,"y":28,
        }
        room.memory.links.info.push(link1);
        room.memory.links.info.push(link2);
        room.memory.links.info.push(link3);
        var policyId = room.memory.polcyId;
       // console.log(room,"linksForW26S21", JSON.stringify(room.memory.links));
    },
    //                                  recurring.policies
    // var recurringPolicies = require("recurring.policies"); recurringPolicies.linksForW25S22();
    linksForW25S22: function () {
        var room = Game.rooms["W25S22"];
        room.memory.links = {};
        room.memory.links.info = [];
        var link1 = {
            "fromId":"55db3189efa8e3fe66e04b7c",
            "resource":"energy",
            "x":17,"y":19,
            "fromLinkId":"5788110778680d884032594a"
        };
        var link2 = {
            "fromId":"55db3189efa8e3fe66e04b7d",
            "resource":"energy",
            "x":28,"y":27,
            "fromLinkId":"57880ae1cfd06ae52d019a4a"
        };
        var link3 = {
            "fromId":"55db3189efa8e3fe66e04b7c",
            "resource":"energy",
            "x":17,"y":18,
            "fromLinkId":"5788f1e2b65b90fc7b9a8139"
        };
        var link4 = {
            "fromId":"55db3189efa8e3fe66e04b7c",
            "resource":"energy",
            "x":16,"y":18,
            "fromLinkId":"57890d7d35c7023c3b2a8700"
        }
        room.memory.links.info.push(link1);
        room.memory.links.info.push(link2);
        room.memory.links.info.push(link3);
        room.memory.links.info.push(link4);
      //  console.log(room,"linksForW26S21", JSON.stringify(room.memory.links));
    }



}

module.exports = recurringPolicies;
























































