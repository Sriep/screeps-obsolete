/**
 * Created by Piers on 10/08/2016.
 */
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

var roleMiner = {
    findStorage: function(creep) {
        var storages = creep.room(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_STORAGE
                    || struc.structureType == STRUCTURE_TERMINAL            }
        });
        if (storages) {
            if (1 < storage.length) {
                storages.sort(function (s1, s2) {
                    return (s2.storeCapacity() - _.sum(s2)) - (s1.storeCapacity() - _.sum(s1));
                });
            }
            if (storages[0].storeCapacity() - _.sum(storages[0])  > gc.KEEP_FREE_STORAGE_SPACE) {
                return storages[0];
            }
        }
        return undefined;
    },

    getTaskList: function(creep, mineId, resourceId) {
        var tasks = [];
        var moveToMineral = new TaskMoveFind(gc.FIND_ID ,gc.RANGE_HARVEST, mineId);
        var harvest = new TaskHarvest();
        var moveToStorage = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
            , "findStorage","role.miner");
        var offload = new TaskOffload(gc.TRANSFER, resourceId);

        tasks.push(moveToMineral);
        tasks.push(harvest);
        tasks.push(moveToStorage);
        tasks.push(offload);

        return tasks;
    },

};


module.exports = roleMiner;





























