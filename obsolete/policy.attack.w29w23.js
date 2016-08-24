/**
 * Created by Piers on 22/08/2016.
 */
/**
 * @fileOverview Screeps module. Template.
 * @author Piers Shepperson
 */
"use strict";
var RouteGiftCreep = require("route.gift.creep");
var routeBase = require("route.base");
var raceCleric = require("race.cleric");
var raceSapper = require("race.sapper");
var TaskMoveRoom = require("task.move.room");
var TaskMoveXY = require("task.move.xy");
var TaskWait = require("task.wait");
var TaskMoveFind = require("task.move.find");
var TaskBoost = require("task.boost");
var raceHealer = require("race.healer");
var TaskFollow = require("task.follow");
var roleBase = require("role.base");
var TaskMovePos = require("task.move.pos");
var RouteBoostAndSwitch = require("route.boost.and.switch");
var gc = require("gc");
/**
 * Abstract Policy
 *
 * @module policyCoordinateAttack
 */
function  PolicyAttackW29Ss23 () {
    this.type =  gc.POLICY_ATTACK_W25S23
}


//    var PolicyAttackW29Ss23 = require("policy.attack.w29w23");
//    var attack = new PolicyAttackW29Ss23();
//    console.log("attack", JSON.stringify(attack));
//    policy.activatePolicy(attack);


PolicyAttackW29Ss23.prototype.initialisePolicy = function (newPolicy) {
    var healerBody = raceHealer.body(18,22);
    var sapperBody = raceSapper.body(23,10,13);
    var orderW25s22 = new RouteBoostAndSwitch(
        healerBody,
        ["57b7aad48b688181219ac87b"],
        gc.ROLE_SCOUT,
        ["W28S23"],
        0
    );
    var orderW25s23 = new RouteBoostAndSwitch(
        sapperBody,
        ["57bacbe9625f659d69b79372", "57b70598a03b6e9a4c8e4eb3"],
        gc.ROLE_SCOUT,
        ["W28S23"],
        0
    );
    console.log(orderW25s22);console.log(orderW25s23);
    routeBase.attachRoute("W25S22",undefined,orderW25s22,4);
    routeBase.attachRoute("W25S22",undefined,orderW25s22,4);
    routeBase.attachRoute("W25S23",undefined,orderW25s23,4);
    routeBase.attachRoute("W25S23",undefined,orderW25s23,4);
    return true;
};

PolicyAttackW29Ss23.prototype.draftNewPolicyId = function(oldPolicy) {
    return null;
    return oldPolicy;
};

PolicyAttackW29Ss23.prototype.switchPolicy = function(oldPolicy, newPolicy)
{
};

PolicyAttackW29Ss23.prototype.enactPolicy = function(currentPolicy) {

    var creeps = _.filter(Game.creeps, function(c) {
        return c.memory.policyId == currentPolicy.id
            && c.memory.role == gc.ROLE_GIFT;
    });
    console.log("Enact PolicyAttackW29Ss23",creeps.length);

    var Evelyn = Game.creeps["Evelyn"];
    var Arianna = Game.creeps["Arianna"];
    var Bella = Game.creeps["Bella"];

    //roleBase.switchRoles(Bella, gc.ROLE_FOLLOW, Connor);
   // roleBase.switchRoles(Evelyn, gc.ROLE_FOLLOW, Connor);


    var Elliot = Game.creeps["Elliot"];
    var Jason = Game.creeps["Jason"];
    var Connor = Game.creeps["Connor"];
    var Peyton = Game.creeps["Peyton"];
    var Allison = Game.creeps["Allison"];

   // roleBase.switchRoles(Evelyn, gc.ROLE_FOLLOW, Peyton);
   // roleBase.switchRoles(Bella, gc.ROLE_FOLLOW, Peyton);
   // roleBase.switchRoles(Arianna, gc.ROLE_FOLLOW, Peyton);


 //   roleBase.switchRoles(Liam, gc.ROLE_FOLLOW, Liam);
    //roleBase.switchRoles(Jason, gc.ROLE_FOLLOW, Connor);
    //roleBase.switchRoles(Connor, gc.ROLE_FOLLOW, Connor);
  //  roleBase.switchRoles(Peyton, gc.ROLE_FOLLOW, Liam);
 //   roleBase.switchRoles(Sophia, gc.ROLE_FOLLOW, Liam);




    //roleBase.switchRoles(LilaElla, gc.ROLE_FOLLOW, Alexandra);
    //roleBase.switchRoles(LilaElla, gc.ROLE_FOLLOW, Alexandra);
    var targetList1 = [
   //     { type : gc.TARGET_ID, target : "577ac44db7671bef3faf256a" },
   //     { type : gc.TARGET_ID, target : "577ac1782d45a20d3dc21ef8" },
        { type : gc.TARGET_ID, target : "57b52ec0b8157c564d72b0fa" },
        { type : gc.TARGET_ID, target : "576d08a723cdb91a52c3df9d" },
        { type : gc.TARGET_ID, target : "576a727cca25e7697610c14e" },
        { type : gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION },
        { type : gc.TARGET_ID, target : "57b6f122833c9fd46237ab6b" }
    ];
    //roleBase.switchRoles(Connor, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList1);


   // roleBase.switchRoles(Liam, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList1);
    //Connor.move(LEFT);

    var targetList2 = [
 //       { type : gc.TARGET_STRUCTURE, target : STRUCTURE_TOWER },
 //       { type : gc.TARGET_ID, target : "577ac44db7671bef3faf256a" },
//    { type : gc.TARGET_ID, target : "576cc543f3e31783635b54c9" },
//    { type : gc.TARGET_ID, target : "57b52ec0b8157c564d72b0fa" },
 //   { type : gc.TARGET_ID, target : "576d08a723cdb91a52c3df9d" },
   // { type : gc.TARGET_ID, target : "576a727cca25e7697610c14e" },
    { type : gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION },
    { type : gc.TARGET_ID, target : "57b6f122833c9fd46237ab6b" }
    ];
    roleBase.switchRoles(Allison, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList2);
    roleBase.switchRoles(Elliot, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList2);
    //roleBase.switchRoles(Liam, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList2);

    var targetList3 = [
       // { type : gc.TARGET_ID, target : "576cdf0f717b99bc1002f2a6" },
       // { type : gc.TARGET_STRUCTURE, target : STRUCTURE_RAMPART },
        //{ type : gc.TARGET_ID, target : "57b52ec0b8157c564d72b0fa" },
        { type : gc.TARGET_ID, target : "576d08a723cdb91a52c3df9d" },
        { type : gc.TARGET_ID, target : "576a727cca25e7697610c14e" },
        { type : gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION },
        { type : gc.TARGET_ID, target : "57b6f122833c9fd46237ab6b" }
    ];

   //roleBase.switchRoles(Peyton, gc.ROLE_DISMANTLE_ROOM,"W29S23",targetList3);

  //  Bella.move(TOP_RIGHT);
  //  Arianna.move(TOP);
  //  var r1 = Elliot.dismantle(Game.getObjectById("5773a39ef92e3c460e40f8ee"));
  // Elliot.move(BOTTOM_LEFT);
  //  console.log(Elliot,"r1",r1);
    //Peyton.move(TOP);
    //Peyton.dismantle(Game.getObjectById("57b52ec0b8157c564d72b0fa"));

   // var extension = Elliot.pos.findClosestByPath(FIND_STRUCTURES, {
  //      filter: function(object) {
  //          return object.structureType == STRUCTURE_EXTENSION;
  //      }
  ///  });
   // Elliot.moveTo(extension);
   // Elliot.dismantle(extension);
  //  Allison.move(BOTTOM_LEFT);



    //Connor.dismantle(Game.getObjectById("577ac1782d45a20d3dc21ef8"));*/

};

PolicyAttackW29Ss23.prototype.moveTaskList = function(currentPolicy) {

    var taskList = [];
    //var moveroom = new TaskMoveRoom("W28S23");
    var movexy = new TaskMoveXY(4,12);
    var wait = new TaskWait(undefined,undefined,1500);
   // taskList.push(moveroom);
    taskList.push(movexy);
    return taskList;
}


module.exports = PolicyAttackW29Ss23;

