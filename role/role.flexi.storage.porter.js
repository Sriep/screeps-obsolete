/**
 * Created by Piers on 11/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Race of creeps that transport energy around
 * @author Piers Shepperson
 */
var gc = require("gc");
var TaskOffloadSwitch = require("task.offload.switch");
/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module roleFlexiStoragePorter
 */

var roleFlexiStoragePorter = {

    getTaskList: function(creep) {
       // console.log(creep,"In roleFlexiStoragePorter getTaskList");
        var taskList = [];
        var taskSwitcher =  new TaskOffloadSwitch();
        taskList.push(taskSwitcher);
        return taskList;
    },

    nextLab: function(creep) {
        if (creep.room.terminal
            && creep.room.terminal.store[RESOURCE_ENERGY] < gc.TERMINAL_ENERGY_REFILL_THRESHOLD)
            return creep.room.terminal;
        var labs = creep.room.find(FIND_STRUCTURES, {
            filter: function(l) {
                return l.structureType == STRUCTURE_LAB
                    && l.energy < gc.LAB_REFILL_ENERGY_THRESHOLD
                    && Game.flags[l.id]
                    && Game.flags[l.id].secondaryColor != COLOR_WHITE;
            }
        });
        if (labs) {
            labs.sort(function(l1,l2) { return l1.energy - l2.energy; });
            return labs[0];
        }
    },

    nextEnergyContainer: function(creep) {
        //Defence first!
        var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_TOWER
                && structure.energy <= structure.energyCapacity * 0.5);
            }
        });
        if (tower) {
            return tower;
        }
        var extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER)
                    && structure.energy < structure.energyCapacity;
            }
        });
        if (extension) {
            return extension;
        }
        return undefined;
    }
};



module.exports = roleFlexiStoragePorter;



































