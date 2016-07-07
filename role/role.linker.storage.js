/**
 * Created by Piers on 07/07/2016.
 */
var gc = require("gc");
var roleBase = require("role.base");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var _ = require('lodash');

var roleLinkerStorage = {

    getTaskList: function() {
        var tasks = [];
        var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findTargetSource","role.base");
        var harvest = new TaskHarvest();
        var moveToSourceContainer = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSGER
            , "findTarget","role.harvester");
        var offload = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
        moveToSource.loop = true;
        harvest.loop = true;
        moveToSourceContainer.loop = true;
        offload.loop = true;
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(moveToSourceContainer);
        tasks.push(offload);
        return tasks;
    },

};


module.exports = roleLinkerStorage;
/**
 * Created by Piers on 07/07/2016.
 */