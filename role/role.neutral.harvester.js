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

    getTaskList: function(creep, homeRoomName, targetRoomName, sourceId, resourceId) {
        if (!resourceId) resourceId = RESOURCE_ENERGY;

        var tasks = [];
        var moveToSourceRoom = new TaskMoveRoom(targetRoomName);
        var moveToSource= new TaskMoveFind(
            gc.FIND_ID,
            gc.RANGE_HARVEST,
            sourceId,
            undefined,
            undefined,
            undefined,
            "defensiveMoveTo",
            "tasks"
         );
        var harvest = new TaskHarvest();
        var moveHomeRoom = new TaskMoveRoom(
            homeRoomName,
            undefined,
            "defensiveMoveTo",
            "tasks"
        );
        var moveToOffload = new TaskMoveFind(
            gc.FIND_FUNCTION,
            gc.RANGE_TRANSFER,
            "findTargetOffload",
            "role.neutral.porter"
        );
        var offload = new TaskOffload (gc.TRANSFER, resourceId,  undefined, true);

        tasks.push(moveToSourceRoom);
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(moveHomeRoom);
        tasks.push(moveToOffload);
        tasks.push(offload);
        return tasks;
    }
};

module.exports = roleNeutralHarvester;





















