/**
 * Created by Piers on 07/07/2016.
 */
var gc = require("gc");
var TaskMoveXY = require("task.move.xy");
var TaskHarvestLinker = require("task.harvest.linker");


var roleLinkerSource = {

    moveTaskList: function(creep, x,y,sourceId, homeLinkId, targetLinkId) {
        var taskList = [];
        var moveToSource = new TaskMoveXY(x,y);
        var harvestLink = new TaskHarvestLinker(sourceId, homeLinkId, targetLinkId)
        taskList.push(moveToSource);
        taskList.push(harvestLink);
        return taskList;
    },

};

//function TaskHarvestLinker (sourceId, homeLinkId, targetLinkId) {
module.exports = roleLinkerSource;

