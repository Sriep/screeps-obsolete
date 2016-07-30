/**
 * Created by Piers on 08/07/2016.
 */
var gc = require("gc");
var TaskMoveFind = require("task.move.find");
var TaskLoadup = require("task.loadup");
var TaskOffload = require("task.offload");

var roleStorageBuilder = {

    getTaskList: function(creep) {
        var tasks = [];

        var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
            ,FIND_CONSTRUCTION_SITES);
        var offload = new TaskOffload(gc.BUILD);

        var storages = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });
        if (0 == storages.length) {
            return taskList;
        }
        var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storages[0].id);
        var louadupEnergy = new TaskLoadup(RESOURCE_ENERGY);

        tasks.push(moveToStorage);
        tasks.push(louadupEnergy);
        tasks.push(moveToConstructionSite);
        tasks.push(offload);
        return tasks;
    },

};

module.exports = roleStorageBuilder;