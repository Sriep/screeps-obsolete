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
var gf = require("gf");
var routeNeutralHarvest  = require("route.neutral.harvest");
var routeBase = require("route.base");
var RouteRemoteActions = require("route.remote.actions");

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

        //  var route = Game.map.findRoute("W26S21", "W27S21");
        //   console.log("route between my rooms", JSON.stringify(route));
    //    cpuUsage.updateCpuUsage();
        //  console.log("average cpu usage is", cpuUsage.averageCpuLoad());
       // var roomName = "W26S21";
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];
        var w25s21 = Game.rooms["W25S21"];

      //  var pos = new RoomPosition(33,19,w25s23.name);
     //   console.log(JSON.stringify(pos),"is it walkable",gf.isWalkable(pos));



        for ( var i in Game.flags) {
            console.log(i,"flag ", Game.flags[i].pos);
        }

        console.log("distance between 2621 and 2721", Game.map.getRoomLinearDistance("W26S21","W27S21"));
        console.log("route between 2621 and 2721",JSON.stringify(Game.map.findRoute("W26S21","W27S21")));
        console.log("exit between 2621 and 2721",Game.map.findExit("W26S21","W27S21"));
        console.log("exit describe 2621",JSON.stringify(Game.map.describeExits("W26S21")));
        //distance between 2621 and 2721 1
        //route between 2621 and 2721 [{"exit":1,"room":"W26S20"},{"exit":7,"room":"W27S20"},{"exit":5,"room":"W27S21"}]
        //exit between 2621 and 2721 1
        //exit describe 2621 {"1":"W26S20","3":"W25S21","5":"W26S22"}
     /*   var myrooms = _.filter(Game.rooms, function (room) {
            return room.controller && room.controller.my
        });
        var nearByRooms = new Set();
        console.log("scoutHarvestSites mine", JSON.stringify(nearByRooms));
        for ( var i = 0 ; i < myrooms.length ; i++ )
        {
            nearByRooms.add(myrooms[i].name);
            var exits = Game.map.describeExits(myrooms[i].name);
            for ( var j in exits) {
                console.log( JSON.stringify(exits[j]), Game.rooms[exits[j]]);
                nearByRooms.add(exits[j]);
            }
        }
        console.log("scoutHarvestSites mine", JSON.stringify(Array.from(nearByRooms)));
        nearByRooms.forEach(function(i) {
            console.log(i);
        })
*/
        // Set [1, 5, "some text"]
        //console.log(w26s21.memory.stats["ticks"]);

        //var storageId = "577a8dd4b973e61c594592dc";
       // var storage = Game.getObjectById(storageId);
       // console.log(storageId,"energy",storage.energy,"energy capaciy",storage.energyCapacity);


    //  var creep = Game.creeps["Liam"]; //55db3176efa8e3fe66e04a58
     //  var path = creep.pos.findPathTo(Game.getObjectById("55db3189efa8e3fe66e04b82"));
     //   creep.moveByPath(path);
       // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
       // roleBase.switchRoles(creep, gc.ROLE_PATROL_ROOM, "W26S24");
       //creep.move(TOP);

      //  var creep2= Game.creeps["Xavier"]; //55db3176efa8e3fe66e04a58
      //  creep2.pos.findPathTo(Game.getObjectById(id));

    //    creep2.move(BOTTOM_LEFT);


        //   var rtv = creep.move(LEFT);
      // var rtv = creep.move(BOTTOM);
     //   console.log("move liz",rtv);

      //roleBase.switchRoles(creep, gc.ROLE_HARVESTER);
       // creep.memory.PolicyId = 72804
       // creep.memory.PolicyId = 3;
       // var creep2 = Game.creeps["Luke"];
      //  creep2.move(TOP);
   //  roleBase.switchRoles(creep2, gc.ROLE_HARVESTER);//,"W25S22","W25S22");
      //  creep2.memory.PolicyId = 3;
      //  var creep3 = Game.creeps["Johnathan"];

     //  roleBase.switchRoles(creep3, gc.ROLE_HARVESTER);//,"W25S22","W25S22");
     //   creep3.memory.PolicyId = 3;
    //  var creep3 = Game.creeps["Noah"];
      //  var rtv = creep3.move(LEFT);
     // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER)//,"55db3189efa8e3fe66e04b7d","5788fd5ed480c0fe5bb3adb7",undefined);
      //  var creep2= Game.creeps["Aria"];
      //  roleBase.switchRoles(creep2, gc.ROLE_FLEXI_STORAGE_PORTER);//,"55db3189efa8e3fe66e04b7c","5788110778680d884032594a",undefined);

       // var RouteNeutralHarvest  = require("route.neutral.harvest");
      ///  var routeBase = require("route.base");
      //  var gc = require("gc");
     //   var order = new RouteNeutralHarvest("W26S21","W26S21", "55db3189efa8e3fe66e04b78", "577a8dd4b973e61c594592dc",750);


        //routeBase.attachRoute("W26S21", gc.ROUTE_NEUTRAL_HARVEST,order);

     //   routeBase.showRoutes("W26S21");
    //    routeBase.showRoutes("W25S22");
    //    routeBase.showRoutes("W25S23");
      //  w25s23
        //var details = w26s21.memory.routes.details[5]; //55db3189efa8e3fe66e04b78
        var details = w25s23.memory.routes.details[2]; //55db3189efa8e3fe66e04b78
      //  details.respawnRate = 350;
        //var details = w26s21.memory.routes.details[3]; //55db3189efa8e3fe66e04b79
        //details.respawnRate = 700;

      //  var w26s21 = Game.rooms["W26S21"];
        //var details = w26s21.memory.routes.details.splice(5);
        //var details2 = w26s21.memory.routes.details[5] = undefined;
        //details.respawnRate = 1500;


       // var details = w25s22.memory.routes.details[1];

     //   details.operator = undefined;


        //routeBase.removeRoute("W26S21",4)
        //routeBase.removeRoute("W25S22",4)


       // roadBuilder.buildRoadsRoom(w25s23);
        //roadBuilder.removeSites(w25s21);

    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
