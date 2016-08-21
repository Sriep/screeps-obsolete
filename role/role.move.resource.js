/**
 * Created by Piers on 21/08/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var TaskMovePos = require("task.move.pos");
var TaskLoadup = require("task.loadup");
var TaskOffload = require("task.offload");
var gc = require("gc");
/**
 * Task harvest object.
 * @module roleMoveResource
 */

var roleMoveResource = {

    getTaskList: function(creep, from, to, resourceId) {
        var moveToFrom = new TaskMovePos(from.pos,1);
        var loadup = new  TaskLoadup (resourceId, from.id);
        var moveToTo = new TaskMovePos(to.pos,1);
        var offload = new TaskOffload(
            gc.TRANSFER,
            resourceId,
            undefined,
            undefined,
            to.id
        );

        var taskList = [];
        taskList.push(moveToFrom);
        taskList.push(loadup);
        taskList.push(moveToTo);
        taskList.push(offload);
        return taskList;
    }

};

module.exports = roleMoveResource;