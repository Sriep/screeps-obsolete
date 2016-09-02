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
var raceWorker = require("race.worker");
var gc = require("gc");
/**
 * Abstract Policy
 *
 * @module policyCoordinateAttack
 */
function  PolicyAttackW24Ss23 () {
    this.type =  gc.POLICY_ATTACK_W24S23
}


//    var PolicyAttackW24Ss23 = require("policy.attack.w24w23");
//    var attack = new PolicyAttackW29Ss23();
//    console.log("attack", JSON.stringify(attack));
//    policy.activatePolicy(attack);


PolicyAttackW24Ss23.prototype.initialisePolicy = function (newPolicy) {
    var healerBody = raceHealer.body(10,20);
    var sapperBody = raceWorker.bodyE(37,0,13);
    var orderW25s22 = new RouteBoostAndSwitch(
        healerBody,
        ["57b7aad48b688181219ac87b"],
        gc.ROLE_SCOUT,
        ["W25S23"],
        0
    );
    var orderW25s23 = new RouteBoostAndSwitch(
        sapperBody,
        ["57b70598a03b6e9a4c8e4eb3"],
        gc.ROLE_SCOUT,
        ["W25S23"],
        0
    );
    console.log(orderW25s22);console.log(orderW25s23);
    //routeBase.attachRoute("W25S22",undefined,orderW25s22,60);
    //routeBase.attachRoute("W25S22",undefined,orderW25s22,60);
    //routeBase.attachRoute("W25S22",undefined,orderW25s22,60);
    routeBase.attachRoute("W25S23",undefined,orderW25s23,65);
    routeBase.attachRoute("W25S23",undefined,orderW25s23,65);
    routeBase.attachRoute("W25S23",undefined,orderW25s23,65);
    return true;
};

PolicyAttackW24Ss23.prototype.draftNewPolicyId = function(oldPolicy) {
    return null;
    return oldPolicy;
};

PolicyAttackW24Ss23.prototype.switchPolicy = function(oldPolicy, newPolicy)
{
};

PolicyAttackW24Ss23.prototype.enactPolicy = function(currentPolicy) {
  /*  var creeps = _.filter(Game.creeps, function(c) {
        return c.memory.policyId == currentPolicy.id
            && c.memory.role == gc.ROLE_GIFT;
    });
    console.log("Enact PolicyAttackW29Ss23",creeps.length);
    var Elijah = Game.creeps["Elijah"];
    //roleBase.switchRoles(Elijah, gc.ROLE_SCOUT, "W25S23");



    var Parker = Game.creeps["Parker"];
    //var Asher = Game.creeps["Asher"];
    //var Charlie = Game.creeps["Charlie"];
   // var Alaina = Game.creeps["Alaina"];

    //var JohnLevi = Game.creeps["JohnLevi"];
    var Aaron = Game.creeps["Aaron"];
    var Madison = Game.creeps["Madison"];

    var targetList1 = [
        { type : gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION }
    ];
    var targetList2 = [
        { type : gc.TARGET_STRUCTURE, target : STRUCTURE_EXTENSION }
    ];

    ///roleBase.switchRoles(Lucy, gc.ROLE_DISMANTLE_ROOM,"W24S23",targetList1);
   // roleBase.switchRoles(Aaron, gc.ROLE_DISMANTLE_ROOM,"W24S23",targetList1);
   // roleBase.switchRoles(Elliot, gc.ROLE_DISMANTLE_ROOM,"W24S23",targetList1);

    //var Lucy= Game.creeps["Lucy"];
    //var extension = Lucy.pos.findClosestByPath(FIND_STRUCTURES, {
    //    filter: function(object) {
   //         return object.structureType == STRUCTURE_EXTENSION;
   ///     }
  //  });
  //  Lucy.moveTo(Game.getObjectById(extension.id))
  //  Lucy.dismantle(Game.getObjectById(extension.id))

    var extension = Madison.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: function(object) {
            return object.structureType == STRUCTURE_EXTENSION;
        }
    });
    Madison.moveTo(Game.getObjectById(extension.id))
    Madison.dismantle(Game.getObjectById(extension.id))

    var extension = Aaron.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(object) {
            return object.structureType == STRUCTURE_EXTENSION;
        }
    });
    Aaron.moveTo(Game.getObjectById(extension.id))
    Aaron.dismantle(Game.getObjectById(extension.id))

*/
};

PolicyAttackW24Ss23.prototype.moveTaskList = function(currentPolicy) {
    var taskList = [];
    var movexy = new TaskMoveXY(41,22);
    var wait = new TaskWait(undefined,undefined,1500);
    taskList.push(movexy);
    return taskList;
}


module.exports = PolicyAttackW24Ss23;

