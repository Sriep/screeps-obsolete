/**
 * Created by Piers on 08/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
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
var roleBase = require("role.base");
var gc = require("gc");
/**
 * Abstract Policy
 *
 * @module policyCoordinateAttack
 */
function  PolicyCoordinateAttack () {
    this.type =  gc.POLICY_COORDINATE_ATTACK
}

//if (Game.time == 12880839  ) {
//    var PolicyCoordinateAttack = require("policy." + gc.POLICY_COORDINATE_ATTACK);
//    var attack = new PolicyCoordinateAttack();
//    console.log("attack", JSON.stringify(attack));
//    policy.activatePolicy(attack);
//}

PolicyCoordinateAttack.prototype.initialisePolicy = function (newPolicy) {
    var sapperBody = raceSapper.body(25,13,12);
    var clerciBody = raceCleric.body(12,13);
    var orderw26s21 = new RouteGiftCreep("W26S21","W26S23",newPolicy.id,sapperBody,undefined,0);
    var orderw25s22 = new RouteGiftCreep("W25S22","W26S23",newPolicy.id,sapperBody,undefined,0);
    var orderw25s23 = new RouteGiftCreep("W25S23","W26S23",newPolicy.id,clerciBody,undefined,0);
    console.log(orderw26s21);console.log(orderw25s22);console.log(orderw25s23);
    routeBase.attachRoute("W26S21",undefined,orderw26s21,4,"W26S21");
    routeBase.attachRoute("W25S22",undefined,orderw25s22,4,"W25S22");
    routeBase.attachRoute("W25S23",undefined,orderw25s23,4,"W25S23");
    return true;
};

PolicyCoordinateAttack.prototype.draftNewPolicyId = function(oldPolicy) {
    return null;
    return oldPolicy;
};

PolicyCoordinateAttack.prototype.switchPolicy = function(oldPolicy, newPolicy)
{
};

PolicyCoordinateAttack.prototype.enactPolicy = function(currentPolicy) {
    var creeps = _.filter(Game.creeps, function(c) {
        return c.memory.policyId == currentPolicy.id
        && c.memory.role == gc.ROLE_GIFT;
    });
    console.log("Enact PolicyCoordinateAttack",creeps.length);
    for ( var i = 0 ; i < creeps.length ; i++ ) {
       creeps[i].memory.tasks.tasklist = this.moveTaskList();
       creeps[i].memory.role = "movingSomewhere";
    }
};

PolicyCoordinateAttack.prototype.attackTaskList = function() {
    var TaskMoveFind = require("task.move.find");
    var TaskAttackId = require("task.attack.id");
    var taskList = [];
    //var room0 = new TaskMoveRoom("W28S24");
    //var move439 = new TaskMoveXY(4,39);
    //var move819 = new TaskMoveXY(8,19);
    var moveToTarget = new TaskMoveFind(
        gc.FIND_FUNCTION ,
        gc.RANGE_TRANSFER,
        "findNextTarget",
        "role.attack.room",
        undefined,
        undefined,
        "moveAndAttack",
        "tasks"
    );
    var attack = new TaskAttackId();
    //taskList.push(room0);
    //taskList.push(move439);
    //taskList.push(move819);
    taskList.push(moveToTarget);
    taskList.push(attack);
    return taskList;
};

PolicyCoordinateAttack.prototype.dismantleTaskList = function() {
    var TaskMoveFind = require("task.move.find");
    var TaskDismantle = require("task.dismantle");
    var taskList = [];
    //var room0 = new TaskMoveRoom("W28S24");
    //var move439 = new TaskMoveXY(4,39,1);
    //var move819 = new TaskMoveXY(8,19,1);
    var moveToTarget = new TaskMoveFind(
        gc.FIND_FUNCTION ,
        gc.RANGE_TRANSFER,
        "findNextTarget",
        "role.dismantle.room",
        undefined,
        undefined,
        "defensiveMoveTo",
        "tasks"
    );
    var dismantle = new TaskDismantle();
    //taskList.push(room0);
    //taskList.push(move439);
    //taskList.push(move819);
    taskList.push(moveToTarget);
    taskList.push(dismantle);
    return taskList;
};

PolicyCoordinateAttack.prototype.moveTaskList = function() {
    var taskList = [];
    var room0 = new TaskMoveRoom("W26S23");
    var room139 = new TaskMoveXY(1,39);
    var room1 = new TaskMoveRoom("W27S23");
    var room2 = new TaskMoveRoom("W27S24");
    var room3 = new TaskMoveRoom("W27S25");
    var room4 = new TaskMoveRoom("W27S26");
    var room5 = new TaskMoveRoom("W28S26");
    var room6 = new TaskMoveRoom("W29S26");
    var room7 = new TaskMoveRoom("W29S25");
    var room8 = new TaskMoveRoom("W28S25");
    var room2124 = new TaskMoveXY(21,19);
    var wait = new TaskWait(undefined,undefined,1500);
    taskList.push(room0);
    taskList.push(room139);
    taskList.push(room1);
    taskList.push(room2);
    taskList.push(room3);
    taskList.push(room4);
    taskList.push(room5);
    taskList.push(room6);
    taskList.push(room7);
    taskList.push(room8);
    taskList.push(room2124);
    taskList.push(wait);
    return taskList;
};

PolicyCoordinateAttack.prototype.moveTaskList2 = function() {
    var taskList = [];
    var room2 = new TaskMoveRoom("W27S24");
    var room3 = new TaskMoveRoom("W27S25");
    var room4 = new TaskMoveRoom("W27S26");
    var room5 = new TaskMoveRoom("W28S26");
    var room6 = new TaskMoveRoom("W29S26");
    var room7 = new TaskMoveRoom("W29S25");
    var room8 = new TaskMoveRoom("W28S25");
    var room2124 = new TaskMoveXY(21,19);
    var wait = new TaskWait(undefined,undefined,1500);
    taskList.push(room2);
    taskList.push(room3);
    taskList.push(room4);
    taskList.push(room5);
    taskList.push(room6);
    taskList.push(room7);
    taskList.push(room8);
    taskList.push(room2124);
    taskList.push(wait);
    return taskList;
};

PolicyCoordinateAttack.prototype.waitFor =  function (policy) {

}


module.exports = PolicyCoordinateAttack;

