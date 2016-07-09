/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var gc = require("gc");
var stats = require("stats");
var roleBase = require("role.base");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");

var roleBuilder = {
    
	findTarget: function(creep) {
        //console.log("getting construction site");
        return creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
	},

    action: function(creep, target) {
        return stats.build(creep, target);
    },

    getTaskList: function() {
        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_HARVEST
                                                , "findTargetSource","role.base");
        var harvest = new TaskHarvest();
        var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
                                                        ,FIND_MY_CONSTRUCTION_SITES);
        var offload = new TaskOffload(gc.BUILD);
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(moveToConstructionSite);
        tasks.push(offload);
        return tasks;
    },


    
    
};

module.exports = roleBuilder;

























