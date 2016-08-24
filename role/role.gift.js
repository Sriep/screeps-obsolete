/**
 * Created by Piers on 18/07/2016.
 */
var gc = require("gc");
var TaskMoveRoom = require("task.move.room");
var TaskSwitchOwner = require("task.switch.owner");
var TaskSwitchRole = require("task.switch.role");

var roleGift = {

    getTaskList: function(creep,room, policyId, role, preDefiendTaskList) {
        if (preDefiendTaskList) return preDefiendTaskList;
        var taskList = [];
        if (!room && policyId)
            room = Memory.policies[policyId].room;
        if (room) {
            var moveToRoom = new TaskMoveRoom(room);
            taskList.push(moveToRoom);
        }
        if (policyId) {
            var give = new TaskSwitchOwner(policyId, room);
            taskList.push(give);
        }
        if (role) {
            var switchRole = new TaskSwitchRole(role);
            taskList.push(switchRole);
        }
        return taskList;
    }

};

module.exports = roleGift;
