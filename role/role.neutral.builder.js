/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var roleBase = require("role.base");
var TaskMoveRoom = require("task.move.room");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var policy = require("policy");
var gc = require("gc");
/**
 * Abstract role object for creeps building in a neutral room
 * @module policy
 */
var roleNeutralBuilder = {

    getTaskList: function(creep, buildRoom, sourceRoom) {
        var tasks = [];
        var moveToSourceRoom = new TaskMoveRoom(sourceRoom);

        var moveToSource = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_HARVEST
                                             , FIND_SOURCES);
        //var moveToSource = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
       //     , "findTargetSource","role.base");

        var harvest = new TaskHarvest();
        var moveToBuildRooom = new TaskMoveRoom(buildRoom);
        var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
                                             ,FIND_CONSTRUCTION_SITES);
        var offload = new TaskOffload(gc.BUILD);

        tasks.push(moveToSourceRoom);
        tasks.push(moveToSource);
        tasks.push(harvest);
        tasks.push(moveToBuildRooom);
        tasks.push(moveToConstructionSite);
        tasks.push(offload);

        return tasks;
    },
    

    findTarget: function(creep) {
        //console.log("getting construction site");
        return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    },

    action: function(creep, target) {
        return stats.build(creep, target);
    },
};


module.exports = roleNeutralBuilder;























