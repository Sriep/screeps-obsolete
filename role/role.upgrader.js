/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
"use strict";
var gc = require("gc");
var stats = require("stats");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");

var roleUpgrader = {

    findTarget: function(creep) {
        return creep.room.controller;
    },


    action: function(creep, target) {
        return stats.upgradeController(creep,target);
    },
    
    getTaskList: function(creep) {

        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_HARVEST
                                            , "findTargetSource","role.base");
        var harvest = new TaskHarvest();
        var moveToController = new TaskMoveFind(gc.FIND_ID,gc.RANGE_UPGRADE, creep.room.controller.id);
        var offload = new TaskOffload(gc.UPGRADE_CONTROLLER);
        moveToSource.loop = true;
        harvest.loop = true;
        moveToController.loop = true;
        offload.loop = true;
        tasks.push(moveToController);
        tasks.push(offload);       
        tasks.push(moveToSource);
        tasks.push(harvest);

       // console.log("tet upgrader task list", JSON.stringify(tasks));
        return tasks;
    },
    



};

module.exports = roleUpgrader;
