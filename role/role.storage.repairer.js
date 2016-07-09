/**
 * Created by Piers on 09/07/2016.
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

/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module policy
 */

var roleStorageRepairer = {

    moveTaskList: function(creep) {
        var taskList = [];

        var storages = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });
        if (0 == storages.length) {
            return taskList;
        }
        var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storages[0].id);
        var loadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
        var findSomethingToRepair = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_REPAIR,"findTarget"
            ,"role.repairer");
        var offload = new TaskOffload(gc.REPAIR);

        taskList.push(moveToStorage);
        taskList.push(loadupEnergy);
        taskList.push(findSomethingToRepair);
        taskList.push(offload);
        return taskList;
    },

};


module.exports = roleStorageRepairer;

































