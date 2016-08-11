/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
"use strict";

var roleBase = require("role.base");
var gc = require("gc");
var stats = require("stats");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var _ = require('lodash');

var roleRepairer = {

    getTaskList: function(creep) {
        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_HARVEST,"findTargetSource"
                                            ,"role.base");
        var harvest = new TaskHarvest();
        var findSomethingToRepair = new TaskMoveFind(
            gc.FIND_FUNCTION,
            gc.RANGE_REPAIR,
            "findTarget",
            "role.repairer",
            undefined,
            undefined,
            "moveAndRepair",
            "role.repairer"
        );
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

    findTarget: function(creep) {
        var damagedStructures = creep.room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.hits < object.hitsMax
                    && object.hitsMax - object.hits > REPAIR_POWER;
            }
        });
        //console.log(Creep,"length of damaged structures", damagedStructures.length);
        damagedStructures.sort(function (a,b) {return (a.hits - b.hits)});
        if(damagedStructures.length > 0) {
            return 	damagedStructures[0];
        }
        console.log(creep,"Repairer can't find target!");
        return undefined;
    },

    findTargetInRange: function(creep) {
       // console.log("findTargetInRange", creep)
        var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, gc.RANGE_REPAIR, {
            filter: function(object) {
                return object.hits < object.hitsMax
                    && object.hitsMax - object.hits > REPAIR_POWER;
            }
        });
        repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
        //console.log(creep,"find repaire target in range",repairTargets);
        if (repairTargets.length > 0)
            return repairTargets[0];
        else
            return undefined;
    },

    moveAndRepair: function(creep, target) {
        //console.log(creep, "moveAndRepair", target);
        var repairTarget = this.findTargetInRange(creep);
        if(repairTarget) creep.repair(repairTarget);
        return creep.moveTo(target);
        //console.log(creep,"")
    },


    action: function(creep, target) {
        return stats.repair(creep,target);
    }
    
};

module.exports = roleRepairer;



























