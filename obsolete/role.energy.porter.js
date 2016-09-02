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
        var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity * gc.TOWER_REFILL_THRESHOLD);
            }
        });
       // console.log(creep,"nextEnergyContainer towers",tower);
        if (tower) {
            return tower;
        }

        var extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure)  {
                return (structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_SPAWN )
                        && structure.energy < structure.energyCapacity;
            }
        });
    //    console.log(creep,"nextEnergyContainer first extension",extension);
        if (extension) {
            return extension;
        }
        return undefined;
    },

    getTaskList: function(creep) {
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

        var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
            ,FIND_CONSTRUCTION_SITES);
        var offloadBuild = new TaskOffload(gc.BUILD);
        
        taskList.push(moveToStorage);
        taskList.push(louadupEnergy);
        taskList.push(moveToEnergyContainer);
        taskList.push(offloadEnergy);

        taskList.push(moveToConstructionSite);
        taskList.push(offloadBuild);

        taskList.push(moveToController);
        taskList.push(upgradeContoller);
        return taskList;
    },

};


module.exports = roleEnergyPorter;



































