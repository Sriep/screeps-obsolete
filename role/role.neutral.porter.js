/**
 * Created by Piers on 23/07/2016.
 */
/**
 * Created by Piers on 13/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var TaskMoveRoom = require("task.move.room");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var TaskLoadup = require("task.loadup");
var gc = require("gc");
var gf= require("gf");
/**
 * Abstract role object for creeps building in a neutral room
 * @module roleNeutralPorter
 */
var roleNeutralPorter = {

    getTaskList: function(creep, homeRoom, flag) {
        var tasks = [];
        var collectionId = flag.name;
        if (!collectionId) return invalidId(creep, homeRoom);
        var collectionObj = Game.getObjectById(collectionId);

        // Use ConstructionSite.progress to see if its a construction site
        // as only this structure has a progress field
        if (!collectionObj
            || collectionObj.progress !== undefined)
            return invalidId(creep, homeRoom);

        var moveToCollectionRoom = new TaskMoveRoom(flag.pos.roomName);
        var moveToCollectonObj = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER, collectionId);
        var loadUp = new TaskLoadup(flag.memory.resourceType, collectionId);
        var moveHomeRoom = new TaskMoveRoom(homeRoom);
        var moveToOffload = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER,
                            "findTargetOffload", "role.neutral.porter");
        var offload = new TaskOffload (gc.TRANSFER, flag.memory.resourceType,  undefined, true);
        tasks.push(moveToCollectionRoom);
        tasks.push(moveToCollectonObj);
        tasks.push(loadUp);
        tasks.push(moveHomeRoom);
        tasks.push(moveToOffload);
        tasks.push(offload);
        return tasks;
    },

    findTargetOffload: function(creep) {
        // todo Handle non energy resources, but we might not need this. Wait and see.
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(struc) {
                return (struc.structureType == STRUCTURE_CONTAINER
                    || struc.structureType == STRUCTURE_EXTENSION
                    || struc.structureType == STRUCTURE_STORAGE
                    || struc.structureType == STRUCTURE_LINK)
                    &&  !gf.isFull(struc);
            }
        });
        return target;
    }

};


module.exports = roleNeutralPorter;

var moveToEnergyContainer = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
    , "findTarget","role.harvester");
























































