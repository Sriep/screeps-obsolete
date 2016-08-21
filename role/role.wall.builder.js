/**
 * Created by Piers on 08/08/2016.
 */
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
var TaskFlexiLoadup = require("task.flexi.loadup");
var _ = require('lodash');

var roleWallBuilder = {

    getTaskList: function(creep) {
        console.log(creep,"roleWallBuilder");
        var tasks = [];
        var loadup = new TaskFlexiLoadup(RESOURCE_ENERGY)
        var findWall = new TaskMoveFind(
            gc.FIND_FUNCTION,
            gc.RANGE_REPAIR,
            "findTarget",
            "role.wall.builder",
            undefined,
            undefined,
            "moveAndRepair",
            "role.repairer"
        );
        var offload = new TaskOffload(gc.REPAIR, RESOURCE_ENERGY);

        tasks.push(loadup);
        tasks.push(findWall);
        tasks.push(offload);
        return tasks;
    },

    findTarget: function(creep) {
        var walls = creep.room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.hits < object.hitsMax
                    && ( object.structureType == STRUCTURE_RAMPART
                        || object.structureType == STRUCTURE_WALL );
            }
        });
        walls.sort(function (a,b) {return (a.hits - b.hits)});
        //console.log(creep,"Walls",walls);
        if(walls.length > 0) {
            //console.log(creep,"found wall to build",walls[0]);
            return 	walls[0];
        }

        return undefined;
    },
/*
    findTargetInRange: function(creep) {
        var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, gc.RANGE_REPAIR, {
            filter: function(object) {
                return object.hits < object.hitsMax
                    && object.hitsMax - object.hits > REPAIR_POWER;
            }
        });
        repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
        if (repairTargets.length > 0)
            return repairTargets[0];
        else
            return undefined;
    },
*/
    moveAndRepair: function(creep, target) {
        var roleRepairer = require("role.repairer");
        return roleRepairer.moveAndRepair(creep, target);
        //var repairTarget = this.findTargetInRange(creep);
        //if(repairTarget) creep.repair(repairTarget);
        //return creep.moveTo(target);
    },

};

module.exports = roleWallBuilder;



























