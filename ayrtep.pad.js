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

var ayrtepPad = {
    top: function () {
        "use strict";

      /*  console.log("------------------------------ flags -------------------------------");
        for ( var i in Game.flags) {
            if (Game.flags[i].memory.type != "keeperlair"
                && Game.flags[i].memory.type != "portal"
                && Game.flags[i].memory.type != "lab"
                && Game.flags[i].memory.type != "controller"
                && Game.flags[i].memory.type != "link")
           console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
         }
        console.log("------------------------------ flags -------------------------------");
*/
        //Memory.rooms["W28S22"].flagged = false;

   //     console.log("------------------------------ routes W26S21 ---------------------------");
   //         routeBase.showRoutes("W26S21");
   //     console.log("------------------------------ routes W25S22 ---------------------------");
    //      routeBase.showRoutes("W25S22");
     //   console.log("------------------------------ routes W25S23 ---------------------------");
    //       routeBase.showRoutes("W25S23");
    //   console.log("------------------------------ routes W25S19 ---------------------------");
      //      routeBase.showRoutes("W25S19");
      //    console.log("---------------------------------------------------------------------");
      //   console.log("------------------------------ routes W28S23 ---------------------------");
      //      routeBase.showRoutes("W28S23");
     //     console.log("---------------------------------------------------------------------");


       // console.log("------------------------------ routes sim ---------------------------");
      //       routeBase.showRoutes("sim");
      //  console.log("------------------------------ routes sim ---------------------------");


    //   var creeps = _.filter(Game.creeps, function (creep) {
    //        return  creep.memory.role == gc.ROLE_WALL_BUILDER});
    //    for ( var i = 0 ; i < creeps.length ; i++ ) {
    //        roleBase.switchRoles(creeps[i], gc.ROLE_WALL_BUILDER);
    //    }

        //var creep = Game.creeps["Bentley"];
       // roleBase.switchRoles(creep, gc.ROLE_LINKER, "55db3176efa8e3fe66e04a54", true);
       // creep = Game.creeps["Bentley"];
        //roleBase.switchRoles(creep, gc.ROLE_LINKER, "55db3176efa8e3fe66e04a54", true);
        //delete Memory.policies;
    },

    bottom: function () {
        console.log("START MY  PAD START MY  PAD");

        //console.log("cost",Game.market.calcTransactionCost(1000,"W26S21","W25S23"));

        //Memory.policies[580] = undefined;outgoingTransactions
        //console.log(JSON.stringify(Game.market.outgoingTransactions));
        for ( var i in Memory.policies ) {
           // console.log("policy",i, Memory.policies[i].type, Memory.policies[i].roomName);
            //console.log("number of policies", Memory.policies)
        }
/*
        if (Game.time == 12880839  ) {
            var PolicyCoordinateAttack = require("policy." + gc.POLICY_COORDINATE_ATTACK);
            var attack = new PolicyCoordinateAttack();
            console.log("attack", JSON.stringify(attack));
            policy.activatePolicy(attack);
        }


*/
      //  var roomBase = require("room.base");
        //var nearByRooms = roomBase.nearByRooms();
        //var roomsInRange0 = roomBase.roomsInRange(0);
       // var roomsInRange1 = roomBase.roomsInRange(1);
       // var roomsInRange2 = roomBase.roomsInRange(2);
        //var roomsInRange3 = roomBase.roomsInRange(3);
        //var roomsInRange4 = roomBase.roomsInRange(4);
        //console.log("nearByRooms", JSON.stringify(nearByRooms));
        //console.log("roomsInRange0", JSON.stringify(roomsInRange0));
        //console.log("roomsInRange1", JSON.stringify(roomsInRange1));
        //console.log("roomsInRange2", JSON.stringify(roomsInRange2));
        //console.log("roomsInRange3", JSON.stringify(roomsInRange3));
        //console.log("roomsInRange4", JSON.stringify(roomsInRange4));

        //roomBase.sendScoutFromTo("W25S23","W25S25");

        //var creeps = _.filter(Game.creeps, function(creep) {
       //     return creep.memory.role == gc.ROLE_GIFT
      //  });
        //console.log("number gicts",creeps.length);
        //for (var i = 0 ; i < creeps.length ; i++ ) {
            //console.log(creeps[i],"gigts",creeps[i].memory.role);
            //console.log(creeps[i],"tasks",JSON.stringify(creeps[i].memory.tasks.tasklist));
            //creeps[i].suicide();
        //}

        //var sim = Game.rooms["sim"];
        var w25s19 = Game.rooms["W25S19"];
        var w26s21 = Game.rooms["W26S21"];
        var w25s22 = Game.rooms["W25S22"];
        var w25s23 = Game.rooms["W25S23"];
        //console.log("swordsman size W25S19 ", raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w25s19));
        //console.log("swordsman size w26s21 ", raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w26s21));
        //console.log("swordsman size W25S22 ", raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w25s22));
        //console.log("swordsman size W25S23 ", raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w25s23));

       // console.log("W25S19",JSON.stringify(Game.map.describeExits("W25S19")),
        //    "W26S21",JSON.stringify(Game.map.describeExits("W26S21")),
       //     "W25S22",JSON.stringify(Game.map.describeExits("W25S22")),
       //     "W25S23",JSON.stringify(Game.map.describeExits("W25S23")));

      //  console.log("rooms within 2",roomBase.roomsInRange(2));

       // console.log("w25s19 energy capacity", w25s19.energyAvailable);

        var flag1 = Game.flags["55db3188efa8e3fe66e04b70"];
        var flag2 = Game.flags["55db3189efa8e3fe66e04b81"];
        //var d = roomBase.distanceBetween(flag1.pos, flag2.pos);
        //console.log(flag1, flag2,"distance between flags",d);

       // var economyLinkers = require("economy.linkers");
       // var flag3 = Game.flags["56e14bf41f7d4167346e0a99"];
      //  economyLinkers.useLinkerMiner(w25s22, flag3);


       //w25s19.memory.routes.details[12].size = 8;
        // w25s23.memory.routes.details[8] = undefined;
        //delete w26s21.memory.routes.details[155];
        //delete w25s23.memory.routes.details[3];
        //delete w25s22.memory.routes.details[589];
        //w26s21.memory.routes.details[430].policyId = 79114;
        //w25s22.memory.routes.details[590].policyId = 79114;
        //w25s23.memory.routes.details[784].policyId = 79114;
        //delete w25s22.memory.routes.details[346];
        //w25s23.memory.routes.details[422] = undefined;
        //w25s23.memory.routes.details[5]= 750;
        // w25s23.memory.routes.details[27] = undefined;
/*
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
*/


        //RouteGiftCreep  (room, policyId, body, role, respawnRate)
    //    var size = raceWorker.maxSizeRoom(w25s22,true);
        //console.log("worker size w25s22 maxsieroom",size,"userace base",raceWorker.maxSizeRoom(w25s22,true));
        //console.log("worker size w25s23 maxsieroom",raceWorker.maxSizeRoom(w25s23,true)
         //   ,"userace base",raceWorker.maxSizeRoom(w25s23,true));
       // size = raceBase.maxSizeFromEnergy(gc.RACE_SWORDSMAN, w25s22);
        //console.log("enegty capacity w25s22",w25s22.energyCapacityAvailable);
        //console.log("swordsman size",raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s23));

       // if (Game.time == 12752720       ) {
          //  var order = new RouteSuppressKeepers("W25S24", undefined, 0);
          //  routeBase.attachRoute("W25S23", gc.ROUTE_SUPPRESS_KEEPERS, order, 1);
      //  }
/*
        if (Game.time == 12862162   ) {
            //w25s19
            var order = new RouteGiftCreep("W25S19","W24S19",undefined,[MOVE,WORK]);
            routeBase.attachRoute("W25S19", undefined, order, 4);
        }
        //var creep = Game.creeps["Caleb"];//""Miles"];
        //roleBase.switchRoles(creep, gc.ROLE_DISMANTLE_ROOM, "W23S19");

        if (Game.time == 12862280     ) {
            //w25s19
            var order = new RouteGiftCreep("W25S19","W24S19",undefined,[MOVE,ATTACK]);
            routeBase.attachRoute("W25S19", undefined, order, 4);
        }

        if (Game.time == 12885590       ) {
            var claimerBody = raceClaimer.body(1);
            var actions = {
                room : "W28S23",
                action : "claimController",
                findFunction : "findController",
                findFunctionsModule : "policy.remote.actions"
            };
            var claimOrder = new RouteRemoteActions("W25S22", actions, claimerBody, 0);
            routeBase.attachRoute("W25S22", undefined, claimOrder, 4);
        }

        if (Game.time == 12881479           ) {
            var soldierBody = raceSwordsman.body(10);
            var order = new RoutePatrolRoom(
                "W26S21",
                "W28S23",
                {roomName: "W28S23", x: 28, y: 41},
                soldierBody,
                800
            );
            routeBase.attachRoute("W26S21", gc.ROUTE_PATROL_ROOM,
                order,gc.PRIORITY_ROOM_PATROL);
        }


        var creep = Game.creeps["Christian"];//""Miles"];
       // creep.moveTo(Game.getObjectById("5769790d4673b865097b5ba9"));
        //console.log(creep.attack(Game.getObjectById("5769790d4673b865097b5ba9")));
        //roleBase.switchRoles(creep, gc.ROLE_ATTACK_ROOM, "W23S19");

        var size;
        if (Game.time == 12885878   ) {
            size = raceWorker.maxSizeRoom(w25s22,true);
            var body = raceWorker.body(12, true);
            console.log("worker size",size);
            order = new RouteGiftCreep("W26S21", "W28S23", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1400);
            routeBase.attachRoute("W25S22", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);

            order = new RouteGiftCreep("W25S22", "W28S23", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1400);
            routeBase.attachRoute("W25S22", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);

            order = new RouteGiftCreep("W25S23", "W28S23", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 1400);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 12659620      ) {
            size = raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s22);
            var body = raceSwordsman.body(16);
            console.log("swordsman size",size);
            var pos = new RoomPosition(16,31,"W25S19");
            var order = new RoutePatrolRoom("W25S22", "W25S19", pos, body, 700,"W25S19");
            routeBase.attachRoute("W25S22", gc.ROUTE_PATROL_ROOM, order, gc.PRIORITY_HOME_PORTER);
       }

        if (Game.time == 12668530  ) {
            size = raceWorker.maxSizeRoom(w25s23);
            body = raceWorker.body(size);
            console.log("worker size",size);
            order = new RouteGiftCreep("W25S23", "W26S21", undefined, body, gc.ROUTE_FLEXI_STORAGE_PORTER, 700);
            routeBase.attachRoute("W25S23", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        if (Game.time == 12661260       ) {
            size = raceBase.maxSizeRoom(gc.RACE_SWORDSMAN, w25s23);
            var body = raceSwordsman.body(size);
            console.log("swordsman size",size);
            var pos = new RoomPosition(16,31,"W26S21");
            var order = new RoutePatrolRoom("W25S23", "W26S21", pos, body, 800,"W26S21");
            routeBase.attachRoute("W25S23", gc.ROUTE_PATROL_ROOM, order, gc.PRIORITY_HOME_PORTER);
        }
*/

        //routeBase.resetRoutes("sim");
        //routeBase.resetRoutes("W26S21");
        //routeBase.resetRoutes("W25S22");
        //routeBase.resetRoutes("W25S23");
        //routeBase.resetRoutes("W25S19");
        //routeBase.resetRoutes("W28S23");

        //routeBase.resetRoutes("W25S24");

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
        //for ( var room in Memory.rooms ) {
           // console.log("unflag rooms", room);
           // Memory.rooms[room].flagged = false;
      //  }
       // for ( var i in Game.flags) {
          //  console.log(i,"flag ", Game.flags[i].pos);
         // Game.flags[i].remove();
       //    console.log(Game.flags[i].pos,i, JSON.stringify(Game.flags[i].memory));
     //   }
       // var roomController = require("room.controller");
       // console.log("roomcontoler 7",roomController.maxProduction[7]);
     //var creep = Game.creeps["Victoria"];//""Miles"];
      // roleBase.switchRoles(creep,gc.ROLE_MOVE_RESOURCE,Game.getObjectById("57a8c118a8e324986f9dc2e9"),
      //      Game.getObjectById("577a641bb4633dec4b04f15f"),RESOURCE_OXYGEN);
        if (Game.time == 13004744    ) {
            var size = raceWorker.maxSizeRoom(w25s23);
            var body = raceWorker.body(raceWorker.maxSizeRoom(w26s21));
            console.log("worker size",size);
            var order = new RouteGiftCreep(
                Game.getObjectById("57a8c118a8e324986f9dc2e9"),
                Game.getObjectById("577a641bb4633dec4b04f15f"),
                RESOURCE_OXYGEN,
                body,
                0
            );
            routeBase.attachRoute("W26S21", gc.ROUTE_FLEXI_STORAGE_PORTER, order, gc.PRIORITY_HOME_PORTER);
        }

        //creep.move(TOP);
     var creep2 = Game.creeps["Aria"];
       // creep2.move(TOP);
        var creep3 = Game.creeps["Adayln"];
      //  creep3.move(TOP);

      //var creep3 = Game.creeps["Jack"];
        //console.log(creep,creep.move(LEFT));
        //roleBase.screepwitchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        //roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        //roleBase.switchRoles(creep3, gc.ROLE_FLEXI_STORAGE_PORTER);
        ////creep.memory.policyId = 79114;
       // creep2.memory.policyId = 79114;
       // creep3.memory.policyId = 79114;

        //  roleBase.switchRoles(creep, gc.ROLE_DISMANTLE_ROOM, "W23S19");
        //roleBase.switchRoles(creep, gc.ROLE_PATROL_ROOM, "W25S25");
        //creep.memory.tasks.tasklist = [];
        //var moveRoom = new TaskMoveRoom("W38S22");
        //creep.memory.tasks.tasklist.push(moveRoom);
       // var creep4 = Game.creeps["Gabriella"];
        //creep4.move(LEFT);
       // creep2.move(LEFT);

        //var creep3 = Game.creeps["Sarah"]
        //roleBase.switchRoles(creep2, gc.ROLE_FLEXI_STORAGE_PORTER);

        //var flag = Game.flags["55db3176efa8e3fe66e04a58"];
        //roleBase.switchRoles(creep1, gc.ROLE_DISMANTLE_ROOM, "W28S24");
       //roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
        //roleBase.switchRoles(creep, gc.ROLE_SUPPRESS_KEEPERS, "W25S24");
        //roleBase.switchRoles(creep, gc.ROLE_SUPPRESS_KEEPERS, "W25S24");
       // var flag = Game.flags["55db318aefa8e3fe66e04b86"];
       // roleBase.switchRoles(creep, gc.ROLE_NEUTRAL_HARVESTER, "W25S23","W26S23"
       //     ,"55db3176efa8e3fe66e04a58",RESOURCE_ENERGY);
        // Maria
        //roleBase.switchRoles(creep, gc.ROLE_MINER, "W25S22","56e14bf41f7d4167346e0a9b",
       //        RESOURCE_KEANIUM);
       //creep.drop(RESOURCE_ENERGY);,
       //roleBase.switchRoles(creep, gc.ROLE_LINKER, "55db318aefa8e3fe66e04b8a", true);
       //creep, flagName, defensive


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
        //console.log("Memory.rooms[W25S24].suppressed",Memory.rooms["W25S24"].suppressed);

        //var creep2= Game.creeps["Nicholas"]; //55db3176efa8e3fe66e04a58
        //var x = 36, y=11;
        //var terrain = Game.map.getTerrainAt(x, y, creep2.room.name);
       // terrain = Game.map.getTerrainAt(x, y, "W25S23");
        //console.log(x,y,creep2.room.name,"terrain",terrain);
      //  creep2.pos.findPathTo(Game.getObjectById(id));

     //   creep2.move(BOTTOM_LEFT);
        //Memory.rooms["W24S19"].flagged = false;
        //console.log("closest to W24S22",
        //    JSON.stringify(roomBase.findClosestOwnedRooms("W24S22",3)));

        //console.log("is enemy room",roomBase.isEnemyRoom("W24S23"));

///
        //var r1 = _.findKey(REACTIONS, function(o) { return {  _.findKey(o,"OH") : "OH"  } } );
       // console.log("r1",r1);

        var from = new RoomPosition(41,32,"W25S24");
        var to  = new RoomPosition(29,47,"W25S24");
        var roadBuilder = require("road.builder");
       // roadBuilder.buildRoad( from, to );
    }

};

module.exports = ayrtepPad;
























































































/**
 * Created by Piers on 07/07/2016.
 */
