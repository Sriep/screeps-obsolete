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
var gc = require("gc");
var gf = require("gf");
var raceSwordsman = require("race.swordsman");
var routeNeutralHarvest  = require("route.neutral.harvest");
var routeBase = require("route.base");
var RoutePatrolRoom = require("route.patrol.room");
var RouteRemoteActions = require("route.remote.actions");
var roomBase = require("room.base");
var flagBase = require("flag.base");
var roleLinker =  require("role.linker");
var battle = require("battle.quick.estimate");
var policyFrameworkes = require("policy.frameworks");
var RouteGiftCreep = require("route.gift.creep");
var RouteSuppressKeepers = require("route.suppress.keepers");
var roomController = require("room.controller");
var labColours = require("lab.colours");
var TaskBoost = require("task.boost");
var RouteBoostAndSwitch = require("route.boost.and.switch");
var RouteAttackRoom = require("route.attack.room");
var RouteDismantleRoom = require("route.dismantle.room");

var ayrtepPad = {
    top: function () {
        "use strict";

        //console.log("------------------------------ flags -------------------------------");
        //for ( var i in Game.flags) {
        //    if (Game.flags[i].memory.type == "source")
        //   console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
        //}
        //console.log("------------------------------ flags -------------------------------");

        //Memory.rooms["W28S22"].flagged = false;

       // console.log("------------------------------ routes W26S21 ---------------------------");
      //      routeBase.showRoutes("W26S21");
      //  console.log("------------------------------ routes W25S22 ---------------------------");
   //       routeBase.showRoutes("W25S22");
     //   console.log("------------------------------ routes W25S23 ---------------------------");
     //     routeBase.showRoutes("W25S23");
     //   console.log("------------------------------ routes W25S19 ---------------------------");
     //       routeBase.showRoutes("W25S19");
     //    console.log("------------------------------ routes W28S23 ---------------------------");
     //      routeBase.showRoutes("W28S23");
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
        var w25s19 = Game.rooms["W25S19"];
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];
        // var sim = Game.rooms["sim"];

        //w25s19.memory.routes.details[12].size = 8;
        // delete w25s23.memory.routes.details[31];
        //w25s23.memory.routes.details[39].priority = gc.PRIORITY_LINKER;
        //delete w26s21.memory.routes.details[155];
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




        for ( var i in Memory.policies ) {
           // console.log("policy",i, Memory.policies[i].type, Memory.policies[i].roomName);
            //console.log("number of policies", Memory.policies)
        }

        //var sim = Game.rooms["sim"];
        var w25s19 = Game.rooms["W25S19"];
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];

      //  var body = [MOVE,MOVE,WORK,CARRY,HEAL,HEAL,HEAL,HEAL,HEAL];
       // var bostActions = ['fatigue', 'heal'];
       // var rtv;
       // rtv = routeBase.reserveBoosts(w25s23, body, bostActions);
      //  console.log(w25s23,"routeBase.reserveBoosts",JSON.stringify(rtv));

       // routeBase.resetRoutes("sim");
        //routeBase.resetRoutes("W26S21");
        //routeBase.resetRoutes("W25S22");
        //routeBase.resetRoutes("W25S23");
        //routeBase.resetRoutes("W25S19");
        //routeBase.resetRoutes("W28S23");

        //routeBase.resetRoutes("W25S24");

        var  creep = Game.creeps["Allison"];
        //creep.move(BOTTOM_LEFT)
        //roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        var  creep2 = Game.creeps["Nora"];
        //roleBase.switchRoles(creep2, gc.ROLE_FLEXI_STORAGE_PORTER);
        var  creep3 = Game.creeps["Riley"];
        //roleBase.switchRoles(creep3, gc.ROLE_FLEXI_STORAGE_PORTER);

        //creep.drop(RESOURCE_ENERGY);
        //Jeremiah.move(LEFT);

     // roleBase.switchRoles(creep, gc.ROLE_MINER,"W25S23","56e14bf41f7d4167346e0a9c",
     //      "Z", undefined, false);

    var targetList = [
        { type : 1, target : "576c83b832e496403a3989dd" },
        { type : 1, target : "576c83b568abfd183ad17e42"}
    ];
    //roleBase.switchRoles(creep, gc.ROLE_DISMANTLE_ROOM,"W28S24",targetList);
      //  var parth = creep.pos.findPathTo(36,26);
    //    console.log(creep,"parth",JSON.stringify(parth));
    //    console.log(creep, creep.moveTo(36,26));
        //creep.moveTo(creep.room.terminal);
        //creep.move(BOTTOM);
  //   console.log( "isy transfer",creep.transfer(creep.room.storage, "L"));
    // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);

    //   roleBase.switchRoles(creep,gc.ROLE_MOVE_RESOURCE,Game.getObjectById("57a8c118a8e324986f9dc2e9"),
    //        Game.getObjectById("577a641bb4633dec4b04f15f"),"O");
//

        //roomBase.sendScoutFromTo("W28S23", "W29S23");

        if (Game.time == 13055195 ) {
            var PolicyAttackW29Ss23 = require("policy." + gc.POLICY_ATTACK_W25S23);
            var attack = new PolicyAttackW29Ss23();
            console.log("attack", JSON.stringify(attack));
            policy.activatePolicy(attack);
        }


        if (Game.time == 13057525  ) {
            var targetList = [
                { type : gc.TARGET_FIND_TYPE, target : FIND_HOSTILE_CREEPS },
                { type :  gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION }
            ];
            var sBody = raceSwordsman.body(6);
            var testOrder = new RouteAttackRoom(
                "W29S23",
                sBody,
                0,
                targetList
            );
            routeBase.attachRoute("W25S23", undefined, testOrder, 1);
        }

        if (Game.time == 13057990    ) {
            var targetList = [
                { type : gc.TARGET_FIND_TYPE, target : STRUCTURE_EXTENSION },
                { type :  gc.TARGET_STRUCTURE, target : STRUCTURE_STORAGE }
            ];
            var wBody = raceWorker.bodyE(7,0,10);
            var testOrder = new RouteDismantleRoom(
                "W29S23",
                wBody,
                0,
                targetList
            );
            routeBase.attachRoute("W25S23", undefined, testOrder, 1);
        }

        if (Game.time == 13057525  ) {
            var targetList = [
                { type : gc.TARGET_FIND_TYPE, target : FIND_HOSTILE_CREEPS },
                { type :  gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION }
            ];
            var sBody = raceSwordsman.body(6);
            var testOrder = new RouteAttackRoom(
                "W29S23",
                sBody,
                0,
                targetList
            );
            routeBase.attachRoute("W25S23", undefined, testOrder, 1);
        }

        var from = new RoomPosition(32,1,"W28S24");
        var to  = new RoomPosition(19,19,"W28S24");
        var roadBuilder = require("road.builder");
      //  roadBuilder.buildRoad( from, to );
    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
