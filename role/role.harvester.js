/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var gc = require("gc");
var roleBase = require("role.base");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var _ = require('lodash');

var roleHarvester = {
	findTarget: function(creep) {
        var oldTargetId = creep.memory.offloadTargetId;
        if (oldTargetId == 0) {oldTargetId = undefined;}
        if (oldTargetId !== undefined)
        {           
            target = Game.getObjectById(oldTargetId);
            if (target.energy < target.energyCapacity)
            {
                return target;
            }
        }

        var towers = creep.room.find(FIND_STRUCTURES, {
                filter: function(structure)  {
                    return (structure.structureType == STRUCTURE_TOWER)
                    && structure.energy < structure.energyCapacity * 0.5
                }
        });
        if (towers.length >0) {
            return towers[0];
        }
        
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure)  {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) 
                    && structure.energy < structure.energyCapacity;
                }
        });
        if(target) {
            //creep.memory.offloadTargetId = target.id;
			return 	target; 
		}

        return 0;
	},

    action: function(creep, target) {
        return creep.transfer(target, RESOURCE_ENERGY);
    },

    getTaskList: function(creep) {
        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
                                             , "findTargetSource","role.base");
        var harvest = new TaskHarvest();
        var moveToEnergyContainer = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
                                                        , "findTarget","role.harvester");
        var offload = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
        moveToSource.loop = true;
        harvest.loop = true;
        moveToEnergyContainer.loop = true;
        offload.loop = true;
        tasks.push(moveToEnergyContainer);
        tasks.push(offload);
        tasks.push(moveToSource);
        tasks.push(harvest);

        return tasks;
    },
    
};


module.exports = roleHarvester;
















