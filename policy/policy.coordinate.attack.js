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
var TaskMoveRoom = require("task.move.room");
var TaskMoveXY = require("task.move.xy");
/**
 * Abstract Policy
 * @module policyCoordinateAttack
 */
var policyCoordinateAttack = {

    initialisePolicy: function (newPolicy) {
        //var w25s19 = Game.rooms["W25S19"];
        var orderw26s21 = new RouteGiftCreep("W26S21","W26S23",newPolicy.id,[MOVE],undefined,0);
        var orderw25s22 = new RouteGiftCreep("W25S22","W26S23",newPolicy.id,[MOVE],undefined,0);
        var orderw25s23 = new RouteGiftCreep("W25S23","W26S23",newPolicy.id,[MOVE],undefined,0);
        routeBase.attachRoute("W26S21",undefined,orderw26s21,5,"W26S21");
        routeBase.attachRoute("W25S22",undefined,orderw25s22,5,"W25S22");
        routeBase.attachRoute("W25S23",undefined,orderw25s23,5,"W25S23");
        return true;
    },

    draftNewPolicyId: function(oldPolicy) {
        //return null;
        if (undefined === Game.rooms[oldPolicy.id]) {
            return null;
        }
        return oldPolicy;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
        var creeps = _.filter(Game.creeps, function(creep) {
            return creep.memory.policyId == currentPolicy.id
        });
        if (creeps.length < 3)
        {
            for ( var i = 0 ; i < creeps.length ; i++ ) {
                if (!creep[i].memory.tasksAdded1) {
                    creep[i].memory.tasks.taskList = [];
                    creep[i].memory.tasks.taskList.push(new TaskMoveXY(25,25,5));
                    creep[i].memory.tasksAdded1 = true;
                }
            }
        } else {
            for ( var j = 0 ; j < creeps.length ; j++ ) {
                if (!creep[j].memory.tasksAdded2) {
                    creep[j].memory.tasks.taskList = this.taskList1();
                    creep[j].memory.tasksAdded2 = true;
                }
            }
        }
    },

    taskList1: function() {
        var taskList = [];
        var room1 = new TaskMoveRoom("W27S24");
        var room2 = new TaskMoveRoom("W27S24");
        var room3 = new TaskMoveRoom("W27S26");
        var room4 = new TaskMoveRoom("W29S26");
        var room5 = new TaskMoveRoom("W28S26");
        taskList.push(room1);
        taskList.push(room2);
        taskList.push(room3);
        taskList.push(room4);
        taskList.push(room5);
        return taskList;
    }
};

module.exports = policyCoordinateAttack;

