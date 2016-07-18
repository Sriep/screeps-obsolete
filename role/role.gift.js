/**
 * Created by Piers on 18/07/2016.
 */
var gc = require("gc");
var TaskMoveRoom = require("task.move.room");
var TaskSwitchOwner = require("task.switch.owner");

var roleGift = {

    getTaskList: function(creep,policyId, role) {
        var taskList = [];
        var room = Memory.policies[policyId].room;
        var moveToRoom = new TaskMoveRoom(room);
        var give = new TaskSwitchOwner(policyId, room, role);
        taskList.push(moveToRoom);
        taskList.push(give);
        return taskList;
    },

};

//function TaskHarvestLinker (sourceId, homeLinkId, targetLinkId) {
module.exports = roleGift;
