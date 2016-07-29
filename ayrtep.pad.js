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
var TaskMoveRoom = require("task.move.room");
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
var battle = require("battle");

var ayrtepPad = {
    top: function () {
        "use strict";

               console.log("------------------------------ flags -------------------------------");
          //   for ( var i in Game.flags) {
            //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
          //   };
        console.log("------------------------------ routes W26S21 ---------------------------");
        routeBase.showRoutes("W26S21");
        console.log("------------------------------ routes W25S22 ---------------------------");
        routeBase.showRoutes("W25S22");
        console.log("------------------------------ routes W25S23 ---------------------------");
        routeBase.showRoutes("W25S23");
        console.log("---------------------------------------------------------------------");

      //  console.log("------------------------------ routes sim ---------------------------");
      //  routeBase.showRoutes("sim");
     //   console.log("------------------------------ routes sim ---------------------------");

    },

    bottom: function () {
        console.log("START MY  PAD START MY  PAD");

          var w26s21 = Game.rooms["W26S21"];
     // w26s21.memory.routes.details[40] = undefined;
     //   var w25s22 = Game.rooms["W25S22"];
   //     w25s22.memory.routes.details[2016] = undefined;
        //var w25s23 = Game.rooms["W25S23"];
        //w25s23.memory.routes.details[2] = undefined;

      ///  var w25s21 = Game.rooms["W25S21"];
        var routeBase = require("route.base");
      //  routeBase.resetRoutes("W26S21");
      //  routeBase.resetRoutes("W25S22");
     //   routeBase.resetRoutes("W25S23");

       // w26s21.memory.routes = {};
      //  w26s21.memory.routes.details = {};
       // room.memory.routes = {};
       // room.memory.routes.details = {};
      //  w25s23.memory.routes = {};
      //  w25s23.memory.routes.details = {};


      //  var sim = Game.rooms["sim"];



      //  var flag = Game.flags["56e14bf41f7d4167346e0a9a"];
      //  var flag2 = Game.flags["56e14bf41f7d4167346e0a76"];

        // console.log("------------------------------ flags -------------------------------");
      //  for ( var i in Game.flags) {
        //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
       // };
        //console.log("------------------------------ routes ---------------------------------------");
        //routeBase.showRoutes("sim");
       // console.log("---------------------------------------------------------------------");

     //   sim.memory.routes.details[]
       // for ( var room in Game.rooms ) {
       //     Game.rooms[room].memory.flagged = false;
      //  }
     //   for ( var i in Game.flags) {
          //  console.log(i,"flag ", Game.flags[i].pos);
    //       Game.flags[i].remove();
       //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
   //     }
   //     roomBase.examineRooms();
    //    flagBase.run();

       // var w26s21 = Game.rooms["W26S21"];var roadBuilder = require("road.builder"); roadBuilder.buildRoadsRoom(w26s21);

        //OBSTACLE_OBJECT_TYPES: ["spawn", "creep", "wall", "source", "constructedWall",
        //    "extension", "link", "storage", "tower", "observer",
        //    "powerSpawn", "powerBank", "lab", "terminal","nuker"],

     //   var gc = require("gc");
    //   var roleBase = require("role.base");
      var creep = Game.creeps["Joseph"];
       // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
       // roleBase.switchRoles(creep, gc.ROLE_NEUTRAL_PORTER);
     // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);

       // roleBase.switchRoles(creep, gc.ROLE_PATROL_ROOM, "W26S24");

        //   creep.moveTo(path);

      //  var creep2= Game.creeps["Xavier"]; //55db3176efa8e3fe66e04a58
      //  creep2.pos.findPathTo(Game.getObjectById(id));

    //    creep2.move(BOTTOM_LEFT);


       // var RouteNeutralHarvest  = require("route.neutral.harvest");
      ///  var routeBase = require("route.base");
      //  var gc = require("gc");
     //   var order = new RouteNeutralHarvest("W26S21","W26S21", "55db3189efa8e3fe66e04b78", "577a8dd4b973e61c594592dc",750);


        //routeBase.attachRoute("W26S21", gc.ROUTE_NEUTRAL_HARVEST,order);
    console.log("---------------------------------------------------------------------");
      // //routeBase.showRoutes("W26S21");
      //  routeBase.showRoutes("W25S22");
      //  routeBase.showRoutes("W25S23");
      //  routeBase.showRoutes("sim");
      //  w25s23
        //console.log(window[WORK],window[CARRY]);
     //   creep = Game.creeps["Source Keeper"];
        var sourceKeeper = Game.getObjectById("be8a0b2cf96476f60009efe8");
        console.log("Source Keeper");
        var enemyBody = []; enemy.push(gc.SOURCE_KEEPER_BODY);
        var swordsManBody1 = raceSwordsman.body(10);
        console.log(JSON.stringify(swordsMan1));
        var body = raceBase.convertArrayToBody(swordsMan1);
        console.log(JSON.stringify(body));
        var swordsManBody2 = raceSwordsman.body(10);
        var swordsManBdoy3 = raceSwordsman.body(10);
        var goodGuysBody = [];
        goodGuysBody.push(swordsManBody1);goodGuys.push(swordsManBody2);goodGuys.push(swordsManBdoy3);
       // var result = battle.quickCombatBodies(enemyBody, goodGuysBody);
       // console.log(result);



    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
