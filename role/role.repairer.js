/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var gc = require("gc");
var roleBase = require("role.base");
var stats = require("stats");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var _ = require('lodash');

var roleRepairer = {
	findTarget: function(creep) {
		var damagedStructures = creep.room.find(FIND_STRUCTURES, {
            		filter: function(object) {return object.hits < object.hitsMax}
        });
        //console.log(Creep,"length of damaged structures", damagedStructures.length);
        damagedStructures.sort(function (a,b) {return (a.hits - b.hits)});
        if(damagedStructures.length > 0) {
        	return 	damagedStructures[0];
        }
        console.log(creep,"Repairer cant find target");
        return 0;
	},

    action: function(creep, target) {
        return stats.repair(creep,target);
    },

    getTaskList: function(creep) {
        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_HARVEST,"findTargetSource"
                                            ,"role.base");
        var harvest = new TaskHarvest();
        var findSomethingToRepair = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_REPAIR,"findTarget"
                                                  ,"role.repairer");
        var offload = new TaskOffload(gc.REPAIR);
        moveToSource.loop = true;
        harvest.loop = true;
        findSomethingToRepair.loop = true;
        offload.loop = true;
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(findSomethingToRepair);
        tasks.push(offload);
        return tasks;
    },
    
}

module.exports = roleRepairer;



























