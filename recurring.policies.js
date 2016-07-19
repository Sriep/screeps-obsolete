/**
 * Created by Piers on 14/07/2016.
 */
/**
 * @fileOverview Reciyrubg policies
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
        //this.linksForW25S23();
        //this.linksForW25S22();
       // console.log("Run recurring policyies");
        policyFrameworks = require("policy.frameworks");
    },

    linksForW26S21: function () {
        console.log("In linksForW26S21");
        var room = Game.rooms["W26S21"];
        //if(!room.memory.links )
            room.memory.links = {};
        if (!room.memory.links.info)
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
      //  var link1 = {
      //      "fromId":"55db3189efa8e3fe66e04b7d",
      //      "resource":"energy",
      //      "x":28,"y":27,
      //      "fromLinkId":"578b0055a0afe21522a4ddc6"
      //  };
        var link1 = {
            "toLinkId" : "578deae39176adb836dcffcb",
            "storageId" : "578b0055a0afe21522a4ddc6",
            "mineId" : "55db3189efa8e3fe66e04b7d",
            "resource":"energy",
            "mineResource": RESOURCE_ENERGY,
            "x": 28,"y": 27,
        }
        var link2 = {
            "fromId":"55db3189efa8e3fe66e04b7c",
            "resource":"energy",
            "x":17,"y":18,
            "fromLinkId":"578ddc7133513b5270bdc9f8",
            "toLinkId" : "578deae39176adb836dcffcb"
        };
        room.memory.links.info.push(link1);
        room.memory.links.info.push(link2);
       // room.memory.links.info.push(link3);
        //room.memory.links.info.push(link4);
      //  console.log(room,"linksForW26S21", JSON.stringify(room.memory.links));
    },

    linksForW25S23: function () {
        var room = Game.rooms["W25S23"];
        room.memory.links = {};
        room.memory.links.info = [];
       /*  var link1 = {
             "fromId":"55db3189efa8e3fe66e04b80",
             "resource":"energy",
             "x":14,"y":13,
             "fromLinkId":"578c884d6e727db53ab01245"
          };*/
        var link2 = {
            "fromId":"55db3189efa8e3fe66e04b80",
            "resource":"energy",
            "x":14,"y":14,
            "fromLinkId":"578c85d412dd432c326b2890"
        };
      //  var link3 = {
      //      "fromId":"55db3189efa8e3fe66e04b81",
      //      "resource":"energy",
      //      "x":32,"y":21,
      //      "fromLinkId":"578c8bfdc4b92c823d2a137e"
      //  };
        var link4 = {
          "fromId":"55db3189efa8e3fe66e04b81",
           "resource":"energy",
           "x":32,"y":20,
           "fromLinkId":"578e2b154732415a3bf555d8"
        };
      //  room.memory.links.info.push(link1);
        room.memory.links.info.push(link2);
       // room.memory.links.info.push(link3);
        room.memory.links.info.push(link4);
        console.log(room,"linksForW25S23", JSON.stringify(room.memory.links));
    }


}

module.exports = recurringPolicies;
























































