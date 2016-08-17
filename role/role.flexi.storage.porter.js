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
//roleBase = require("role.base");
var gc = require("gc");
var TaskMoveFind = require("task.move.find");
var TaskOffload = require("task.offload");
var TaskLoadup = require("task.loadup");
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
        var taskSwitcher =  new TaskOffloadSwitch(creep);
        taskList.push(taskSwitcher);
        return taskList;
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



































