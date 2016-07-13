/**
 * Created by Piers on 13/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var TaskMoveRoom = require("task.move.room");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var gc = require("gc");
/**
 * Abstract role object for creeps building in a neutral room
 * @module policy
 */
var roleNeutralHarvester = {

    getTaskList: function(sourceRoom, storageRoom, sourceId, offLoadId) {
        var tasks = [];
        
        var moveToSourceRoom = new TaskMoveRoom(sourceRoom);
        var moveToSource;
        if (undefined == sourceId) {
            moveToSource = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_HARVEST, FIND_SOURCES);
        } else {
            moveToSource = new TaskMoveFind(gc.FIND_ID,gc.RANGE_HARVEST, sourceId);
        }
        var harvest = new TaskHarvest();

        var moveToStorageRoom = new TaskMoveRoom(storageRoom);
        if (undefined === offLoadId) {
            offLoadId = Game.rooms[storageRoom].storage.id;
        }
        var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_HARVEST, offLoadId);
        var offload = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);

        tasks.push(moveToSourceRoom);
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(moveToStorageRoom);
        tasks.push(moveToStorage);
        tasks.push(offload);

        return tasks;
    }
};


module.exports = roleNeutralHarvester;
