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
var PoolRequisition = require("pool.requisition");
var TaskMoveFind = require("task.move.find");
var TaskActionTarget = require("task.action.target");
var policyThePool = require("policy.the.pool");
var gc = require("gc");
var gf = require("gf");
var raceSwordsman = require("race.swordsman");
var routeNeutralHarvest  = require("route.neutral.harvest");
var routeBase = require("route.base");
var RouteRemoteActions = require("route.remote.actions");
var roomBase = require("room.base");
var flagBase = require("flag.base");
var roleLinker =  require("role.linker");
var battle = require("battle.quick.estimate");
var policyFrameworkes = require("policy.frameworks");
var RouteGiftCreep = require("route.gift.creep");

var ayrtepPad = {
    top: function () {
        "use strict";

//        console.log("------------------------------ flags -------------------------------");
         for ( var i in Game.flags) {
         //  console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
         };
/*
        console.log("------------------------------ routes W26S21 ---------------------------");
    //        routeBase.showRoutes("W26S21");
        console.log("------------------------------ routes W25S22 ---------------------------");
    //        routeBase.showRoutes("W25S22");
        console.log("------------------------------ routes W25S23 ---------------------------");
     //       routeBase.showRoutes("W25S23");
        console.log("------------------------------ routes W25S19 ---------------------------");
           routeBase.showRoutes("W25S19");
        console.log("---------------------------------------------------------------------");
*/
    //    console.log("------------------------------ routes sim ---------------------------");
      //       routeBase.showRoutes("sim");
    //    console.log("------------------------------ routes sim ---------------------------");


    //   var creeps = _.filter(Game.creeps, function (creep) {
    //        return  creep.memory.role == gc.ROLE_WALL_BUILDER});
    //    for ( var i = 0 ; i < creeps.length ; i++ ) {
    //        roleBase.switchRoles(creeps[i], gc.ROLE_WALL_BUILDER);
    //    }
    },

    bottom: function () {
        console.log("START MY  PAD START MY  PAD");

        //Memory.policies[580] = undefined;
    //    for ( var i in Memory.policies ) {
   //       console.log("policy", Memory.policies[i]);
    //    }

        var w25s19 = Game.rooms["W25S19"];
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];

        //w25s22.memory.routes.details[12] = undefined;
        // w25s23.memory.routes.details[8] = undefined;
        // w25s23.memory.routes.details[9]= undefined;
        // w25s23.memory.routes.details[27] = undefined;

        var flag = Game.flags["55db3188efa8e3fe66e04b70"];
        var maxForRoom = raceWorker.maxSizeRoom(w25s19);
        //var flag = Game.flags[flagName];
        console.log("maxForRoom", maxForRoom,"flag",flag);
        var RouteNeutralPorter = require("route.neutral.porter");
        var sizeForOnePerGen = RouteNeutralPorter.prototype.sizeForOneGenerationRespawn(
            flag.memory.porterFrom.distance,
            flag.memory.energyCapacity
        );
        console.log("sizeForoneGen",sizeForOnePerGen);



        //RouteGiftCreep  (room, policyId, body, role, respawnRate)
    //    var size = raceWorker.maxSizeRoom(w25s22,true);
        //console.log("worker size w25s22 maxsieroom",size,"userace base",raceWorker.maxSizeRoom(w25s22,true));
        //console.log("worker size w25s23 maxsieroom",raceWorker.maxSizeRoom(w25s23,true)
         //   ,"userace base",raceWorker.maxSizeRoom(w25s23,true));
       // size = raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w25s22);
        //console.log("enegty capacity w25s22",w25s22.energyCapacityAvailable);
        //console.log("swordsman size",raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s23));
/*
        if (Game.time == 12674440 ) {
            size = raceWorker.maxSizeRoom(w25s22,true);
            body = raceWorker.body(11);
            console.log("worker size",size);
            order = new RouteGiftCreep("W25S22", "W25S19", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 800);
            routeBase.attachRoute("W25S22", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
       // }

      //  if (Game.time == 12659620      ) {
            size = raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s22);
            var body = raceSwordsman.body(16);
            console.log("swordsman size",size);
            var pos = new RoomPosition(16,31,"W25S19");
            var order = new RoutePatrolRoom("W25S22", "W25S19", pos, body, 700,"W25S19");
            routeBase.attachRoute("W25S22", gc.ROUTE_PATROL_ROOM, order, gc.PRIORITY_HOME_PORTER);
    //   }

     //   if (Game.time == 12668530  ) {
            size = raceWorker.maxSizeRoom(w25s23);
            body = raceWorker.body(size);
            console.log("worker size",size);
            order = new RouteGiftCreep("W25S23", "W26S21", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 700);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
   //     }

   //     if (Game.time == 12661260       ) {
            size = raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s23);
            var body = raceSwordsman.body(size);
            console.log("swordsman size",size);
            var pos = new RoomPosition(16,31,"W26S21");
            var order = new RoutePatrolRoom("W25S23", "W26S21", pos, body, 800,"W26S21");
            routeBase.attachRoute("W25S23", gc.ROUTE_PATROL_ROOM, order, gc.PRIORITY_HOME_PORTER);
        }
*/

    //    routeBase.resetRoutes("sim");
    //    routeBase.resetRoutes("W26S21");
    //    routeBase.resetRoutes("W25S22");
    //    routeBase.resetRoutes("W25S23");
    //    routeBase.resetRoutes("W25S19");

       // w26s21.memory.routes = {};
      //  w26s21.memory.routes.details = {};
       // room.memory.routes = {};
       // room.memory.routes.details = {};
      //  w25s23.memory.routes = {};
      //  w25s23.memory.routes.details = {};

        // console.log("------------------------------ flags -------------------------------");
      //  for ( var i in Game.flags) {
        //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
       // };

     //   sim.memory.routes.details[]
        for ( var room in Game.rooms ) {
        //   Game.rooms[room].memory.flagged = false;
        }
        for ( var i in Game.flags) {
          //  console.log(i,"flag ", Game.flags[i].pos);
       //   Game.flags[i].remove();
       //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
        }

      var creep = Game.creeps["Joseph"];
       // creep.move(BOTTOM_LEFT);
       //roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        // roleBase.switchRoles(creep, gc.ROLE_WALL_BUILDER);
        //creep.drop(RESOURCE_ENERGY);

    //    var TaskMoveRoom = require("task.move.room");
 //      var move2529 = new TaskMoveRoom ("W25S19", undefined, 5);
       // creep.memory.tasks.tasklist = []
       // creep.memory.tasks.tasklist.push(move2529);
       // creep.memory.policyId = 0;
      // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        //roleBase.switchRoles(creep, gc.ROLE_PATROL_ROOM);
       // roleBase.switchRoles(creep, gc.ROLE_NEUTRAL_PORTER);
     // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);

       // roleBase.switchRoles(creep, gc.ROLE_PATROL_ROOM, "W26S24");

        //   creep.moveTo(path);

        var creep2= Game.creeps["Penelope"]; //55db3176efa8e3fe66e04a58
      //  creep2.pos.findPathTo(Game.getObjectById(id));

     //   creep2.move(BOTTOM_LEFT);
    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
