/**
 * @fileOverview Screeps main processing loop.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var gc = require("gc");
//var gf = require("gf");
var routeBase = require("route.base");

var ayrtepPad = {
    top: function () {
        //console.log("------------------------------ flags -------------------------------");
     //   for ( var i in Game.flags) {
         //   if (Game.flags[i].memory.type == "constructedWall")
         //       Game.flags[i].memory.type == "wall"
           //console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
      //  }
        //console.log("------------------------------ flags -------------------------------");

        //Memory.rooms["W28S22"].flagged = false;

    //   console.log("------------------------------ routes W26S21 ---------------------------");
    //        routeBase.showRoutes("W26S21");
    //   console.log("------------------------------ routes W25S22 ---------------------------");
       //   routeBase.showRoutes("W25S22");
      //  console.log("------------------------------ routes W25S23 ---------------------------");
      //    routeBase.showRoutes("W25S23");
     //   console.log("------------------------------ routes W25S19 ---------------------------");
     //      routeBase.showRoutes("W25S19");
     //  console.log("------------------------------ routes W28S23 ---------------------------");
    //      routeBase.showRoutes("W24S23");
    //    console.log("------------------------------ routes W24S23 ---------------------------");
    //      routeBase.showRoutes("W24S23");
    //   console.log("---------------------------------------------------------------------");


       // console.log("------------------------------ routes sim ---------------------------");
       //      routeBase.showRoutes("sim");
      //  console.log("------------------------------ routes sim ---------------------------");


    //   var creeps = _.filter(Game.creeps, function (creep) {
    //        return  creep.memory.role == gc.ROLE_WALL_BUILDER});
    //    for ( var i = 0 ; i < creeps.length ; i++ ) {
    //        roleBase.switchRoles(creeps[i], gc.ROLE_WALL_BUILDER);
    //    }

        //var sim = Game.rooms["sim"];
        //var w25s19 = Game.rooms["W25S19"];
        //var w26s21 = Game.rooms["W26S21"];
        //var w26s22 = Game.rooms["W26S22"];
        //var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];
        //var w24s23 = Game.rooms["W24S23"];

        //w25s19.memory.routes.details[12].size = 8;
        //w25s23.memory.routes.details[12604].respawnRate = 1500;
        //w25s23.memory.routes.details[15].basePriority = 100;

       // delete w25s23.memory.routes.details[389];
       // delete w25s23.memory.routes.details[390];
        //delete w25s23.memory.routes.details[392];
        //delete w25s23.memory.routes.details[393];
        //w25s23.memory.routes.details[39].priority = gc.PRIORITY_LINKER;
        //delete w26s21.memory.routes.details[5];
        //delete w25s23.memory.routes.details[3];

        //var creep = Game.creeps["Bentley"];
       // roleBase.switchRoles(creep, gc.ROLE_LINKER, "55db3176efa8e3fe66e04a54", true);
       // creep = Game.creeps["Bentley"];
        //roleBase.switchRoles(creep, gc.ROLE_LINKER, "55db3176efa8e3fe66e04a54", true);
        //delete Memory.policies;
    },

    bottom: function () {
        console.log("START MY  PAD START MY  PAD");

       // var boostPart = _.findKey(BOOSTS,"LH");
       // var action = BOOSTS[WORK]["LH"];
      //  var key = _.findKey(action);
      //  var multiplyer = BOOSTS[WORK]["LH"][key];
      //  console.log("boostPart", boostPart,"action",JSON.stringify(action),"key",key,"mult",multiplyer);

        //for ( var i in Memory.policies ) {
           // console.log("policy",i, Memory.policies[i].type, Memory.policies[i].roomName);
            //console.log("number of policies", Memory.policies)
        //}

        //var sim = Game.rooms["sim"];
        var w25s19 = Game.rooms["W25S19"];
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];

      //  var body = [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
      //  var boostActions = [gc.BUILD,gc.FATIGUE];
     //   var rtv;
     //   rtv = routeBase.reserveBoosts(w25s23, body, boostActions);
     //   console.log(w25s23,"routeBase.reserveBoosts",JSON.stringify(rtv));
       // var routeBase = require("route.base");
        var routeBase = require("route.base");
        //routeBase.resetRoutes("sim");
        //routeBase.resetRoutes("W26S21");
        //routeBase.resetRoutes("W25S22");
        //routeBase.resetRoutes("W25S23");
        //routeBase.resetRoutes("W25S19");
        //routeBase.resetRoutes("W28S23");
        //routeBase.resetRoutes("W26S22");

        //routeBase.resetRoutes("W25S24");
        //console.log("room.memory.routes.nextRouteId",w25s23.memory.routes.nextRouteId);
        var roleBase = require("role.base");
        var gc = require("gc");
        var  creep = Game.creeps["Annabelle"];

        //roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        //creep.move(BOTTOM_LEFT);
        //creep.moveTo(creep.room.controller);
        //creep.upgradeController(creep.room.controller);

        //creep.drop("U");
       // creep.move(LEFT);
        // creep.transfer(cre
       // creep.transfer(creep.room.storage, "U");
       // roleBase.switchRolesA(Game.creeps["Sebastian"],"wall.builder", []);
       // roleBase.switchRoles( Game.creeps["Katherine"],   gc.ROLE_BOOST_AND_SWITCH,
        //    ["57bacbe9625f659d69b79372","57b70598a03b6e9a4c8e4eb3"], gc.ROLE_SUPPRESS_KEEPERS, ["W25S24"]  );

        //creep.drop("L");
       // creep.move(BOTTOM)

       // var  creep = Game.creeps["OwenNathaniel"];
       // creep.transfer(creep.room.storage,"O");


      //  creep2.move(BOTTOM)
      //  roleBase.switchRoles(creep2, gc.ROLE_SUPPRESS_KEEPERS,"W24S24");
        //var  creep3 = Game.creeps["Carter"];
        //roleBase.switchRoles(creep3, gc.ROLE_FLEXI_STORAGE_PORTER);
        //creep3.move(RIGHT)
        //creep.drop(RESOURCE_ENERGY);
        //Jeremiah.move(LEFT);

     //roleBase.switchRoles(creep, gc.ROLE_MINER,"W25S23","56e14bf41f7d4167346e0a9c",
     //      "Z", undefined, false);

    //roleBase.switchRoles(creep, gc.ROLE_DISMANTLE_ROOM,"W28S24",targetList);
      //  var parth = creep.pos.findPathTo(36,26);
    //    console.log(creep,"parth",JSON.stringify(parth));
    //    console.log(creep, creep.moveTo(36,26));
        //creep.moveTo(creep.room.terminal);
        //creep.move(BOTTOM);
  //   console.log( "isy transfer",creep.transfer(creep.room.storage, "L"));
    // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);

     //  roleBase.switchRoles(creep,gc.ROLE_MOVE_RESOURCE,Game.getObjectById("57a8c118a8e324986f9dc2e9"),
     //       Game.getObjectById("577a641bb4633dec4b04f15f"),"O");
//
        if (Game.time == 13328027    ) {
            var raceClaimer = require("race.claimer");
            var RouteRemoteActions = require("route.remote.actions");
            var routeBase = require("route.base");
            var claimerBody = raceClaimer.body(1);
            var actions = {
                room : "W26S22",
                action : "claimController",
                findFunction : "findController",
                findFunctionsModule : "policy.remote.actions"
            };
            var claimOrder = new RouteRemoteActions(actions, claimerBody, 0);
            console.log("claimOrder",JSON.stringify(claimOrder));
            routeBase.attachRoute("W25S22", undefined, claimOrder, 4);
        }
        if (Game.time == 12885878   ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            var w25s22 = Game.rooms["W25S22"];
            var size = raceWorker.maxSizeRoom(w25s22,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S22", "W26S22", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }
        if (Game.time == 12885878   ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            var w26s21 = Game.rooms["W25S23"];
            var size = raceWorker.maxSizeRoom(w25s23,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S23", "W25S23", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 12885878   ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            var w26s21 = Game.rooms["W25S23"];
            var size = raceWorker.maxSizeRoom(w25s23,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S23", "W25S22", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 13763110       ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            var w26s21 = Game.rooms["W25S23"];
            var size = raceWorker.maxSizeRoom(w25s23,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S23", "W25S22", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 13763140       ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            var w26s21 = Game.rooms["W25S23"];
            var size = raceWorker.maxSizeRoom(w25s23,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S23", "W26S21", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 13764065           ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteGiftCreep = require("route.gift.creep");
            var routeBase = require("route.base");
            //var w26s21 = Game.rooms["W25S23"];
            var size = raceWorker.maxSizeRoom(w25s23,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            var order = new RouteGiftCreep("W25S23", "W28S23", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1500);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 12881479           ) {
            var gc = require("gc");
            var raceSwordsman = require("race.swordsman");
            var soldierBody = raceSwordsman.body(10);
            var routeBase = require("route.base");
            var order = new RoutePatrolRoom(
                "W25S22",
                "W26S22",
                {roomName: "W26S22", x: 28, y: 41},
                soldierBody,
                1400
            );
            routeBase.attachRoute("W26S22", gc.ROUTE_PATROL_ROOM,
                order,gc.PRIORITY_ROOM_PATROL);
        }

        if (Game.time == 13764964   ) {
            var gc = require("gc");
            var RouteWallBuilder = require("route.wall.builder");
            var order = new RouteWallBuilder("W26S21");
            routeBase.attachRoute("W26S21", undefined,
                order,gc.PRIORITY_WALL_BUILDER);
        }

        if (Game.time == 13359926 ) {
            var gc = require("gc");
            var raceWorker = require("race.worker");
            var RouteDismantleRoom = require("route.dismantle.room");
            var routeBase = require("route.base");
            var sapperBody = raceWorker.bodyE(1,0,1);
            //RouteDismantleRoom (targetRoomName, body, respawn, targetList)
            var targetList = [
                     { type : gc.TARGET_ID, target : "57c9568b55d5bc0d46e2c9ff" },
                     { type : gc.TARGET_ID, target : "57c9537bdc05b2b82ee06881" },
            ];
            var orderW25s23 = new RouteDismantleRoom(
                "W24S23",
                sapperBody,
                0,
                targetList
            );
            console.log("dismantle room", JSON.stringify(orderW25s23));
            routeBase.attachRoute("W25S23",undefined,orderW25s23,60);
        }

       // var gc = require("gc");
       // var roleBase = require("role.base");
       // var AriaRuby = Game.creeps["AriaRuby"];
       // console.log("AriaRuby",AriaRuby.transfer(AriaRuby.room.storage,"Z"));
        //var targetList = [
        //    { type : gc.TARGET_ID, target : "57c98edeb80ae1d315dfcc97" },
        //    { type : gc.TARGET_ID, target : "57c9537bdc05b2b82ee06881" },
        //];
        //roleBase.switchRoles(Mayo,"W24S23",targetList)

        //roomBase.sendScoutFromTo("W28S23", "W29S23");
        //console.log("wokerbody£",raceWorker.bodyE(37,0,13));
        var gc = require("gc");
       // console.log("TERMINAL_RESERVE",gc.TERMINAL_RESERVE,"TERMINAL_RESTOCK_THRESHOLD",gc.TERMINAL_RESTOCK_THRESHOLD);

        var from = new RoomPosition(32,1,"W24S24");
        var to  = new RoomPosition(1,8,"W24S24");
        var roadBuilder = require("road.builder");
       //roadBuilder.buildRoad( from, to );
    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
