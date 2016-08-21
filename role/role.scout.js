/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var TaskMoveRoom = require("task.move.room");
var TaskMoveXY = require("task.move.xy")
/**
 * Task harvest object.
 * @module roleScout
 */

var roleScout = {

    getTaskList: function(creep, roomName) {
        var taskList = [];
        var moveToRoom = new TaskMoveRoom(roomName);
        var moveCenter = new TaskMoveXY(25,25,5);
        taskList.push(moveToRoom);
        taskList.push(moveCenter);
        return taskList;
    }

};

module.exports = roleScout;
