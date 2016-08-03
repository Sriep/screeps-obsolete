/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var TaskMoveRoom = require("task.move.room");
/**
 * Task harvest object.
 * @module roleScout
 */

var roleScout = {

    getTaskList: function(creep, roomName) {
        var taskList = [];
        var moveToRoom = new TaskMoveRoom(roomName);
        taskList.push(moveToRoom);
        return taskList;
    }

};

module.exports = roleScout;
