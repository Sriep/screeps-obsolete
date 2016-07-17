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

    getTaskList: function(creep) {
        var taskList = [];

        var moveToStorage
        if (undefined !== creep.room.storage ) {
            moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER, creep.room.storage.id);
        } else {
            moveToStorage = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
                , "findContainer","role.storage.repairer");
        }
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

    findContainer: function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_CONTAINER}
        });
        if (containers.length > 0) {
            containers.sort(function (a, b) {
                return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY];
            });
            return containers[0]
        } else {
            return undefined;
        }
    }
};


module.exports = roleStorageRepairer;

































