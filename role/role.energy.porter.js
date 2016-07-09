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

/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module policy
 */

var roleEnergyPorter = {

    nextEnergyContainer: function(creep) {
        //Defence first!
   //     console.log(creep,"looking for energy contaier");
        var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity);
            }
        });
        if (towers.length >0) {
            return towers[0];
        }
        console.log(creep,"nextEnergyContainer towers",towers[0]);
        /*
        var extensions = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN)
                    && structure.energy < structure.energyCapacity;
            }
        });
        */
        var extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN)
                    && structure.energy < structure.energyCapacity;
            }
        });
        console.log(creep,"nextEnergyContainer first extension",extension);
        if (extension) {
            return extension;
        }
/*
        var extensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION
                || structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
        }
        });
        console.log(creep,"nextEnergyContainer second extension",extensions[0]);
    //    console.log(creep,"has found extension or spawn", extensions[0]);
        if (extensions.length >0) {
            return extensions[0];
        }*/
   //     console.log(creep,"not found anything");
        return undefined;
    },

    moveTaskList: function(creep) {
        var taskList = [];
        var moveToEnergyContainer = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
                                                , "nextEnergyContainer","role.energy.porter");
        var offloadEnergy = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
        var moveToController = new TaskMoveFind(gc.FIND_ID,gc.RANGE_UPGRADE, creep.room.controller.id);
        var upgradeContoller = new TaskOffload(gc.UPGRADE_CONTROLLER);

        var storages = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });
        if (0 == storages.length) {
            return taskList;
        } 
        var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storages[0].id);
        var louadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
        
        taskList.push(moveToStorage);
        taskList.push(louadupEnergy);
        taskList.push(moveToEnergyContainer);
        taskList.push(offloadEnergy);
        taskList.push(moveToController);
        taskList.push(upgradeContoller);
        return taskList;
    },

};


module.exports = roleEnergyPorter;



































