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
var TaskOffload = require("task.offload");
var TaskLoadup = require("task.loadup");
var gc = require("gc");
var gf= require("gf");
var tasks = require("tasks");
/**
 * Abstract role object for creeps building in a neutral room
 * @module roleNeutralPorter
 */
var roleNeutralPorter = {

    getTaskList: function(creep, homeRoom, flag) {
        var tasks = [];
        //var collectionId = flag.name;
        //console.log(creep,"getTaskList neutral porter role", homeRoom, flag);
        if (!flag) return undefined;

        //if (!collectionId) return undefined;


        // Use ConstructionSite.progress to see if its a construction site
        // as only this structure has a progress field
        //if (!collectionObj || collectionObj.progress !== undefined) {
           // console.log(creep, flag, "roleNeutralPorter.getTaskList  cannot find collection object");
            //return undefined;
        //}

        var moveToCollectionRoom = new TaskMoveRoom(flag.pos.roomName);

        var moveToCollectionObj;
        var collectionObj = Game.getObjectById(flag.memory.mainDumpId);
        // Use ConstructionSite.progress to see if its a construction site
        // as only this structure has a progress field
        if (collectionObj && collectionObj.progress !== undefined) {
            moveToCollectionObj = new TaskMoveFind(
                gc.FIND_ID,
                gc.RANGE_TRANSFER,
                flag.memory.mainDumpId,
                undefined,
                undefined,
                undefined,
                "defensiveMoveTo",
                "tasks"
            );
        } else {
            moveToCollectionObj = new TaskMoveFind(
                gc.FIND_FUNCTION ,
                gc.RANGE_TRANSFER,
                "findPickup",
                "role.neutral.porter",
                undefined,
                undefined,
                "defensiveMoveTo",
                "tasks"
            );
        }

        //var loadUp = new TaskLoadup(flag.memory.resourceType, collectionId);
        var loadUp = new TaskLoadup(flag.memory.resourceType);
        //var moveHomeRoom = new TaskMoveRoom(homeRoom);
        var moveHomeRoom = new TaskMoveRoom(
            homeRoom,
            undefined,
            "defensiveMoveTo",
            "tasks"
        );
        var moveToOffload = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER,
                            "findTargetOffload", "role.neutral.porter");
        var offload = new TaskOffload (gc.TRANSFER, flag.memory.resourceType,  undefined, true);

        tasks.push(moveToCollectionRoom);
        tasks.push(moveToCollectionObj);
        tasks.push(loadUp);
        tasks.push(moveHomeRoom);
        tasks.push(moveToOffload);
        tasks.push(offload);
        return tasks;
    },

    findPickup: function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: function (struc) {
                return (struc.structureType == STRUCTURE_CONTAINER
                && struc.store[RESOURCE_ENERGY] > 0);
            }
        });

        if (containers.length > 0) {
            containers.sort(function (c1, c2) {
                return c2.store[RESOURCE_ENERGY] - c1.store[RESOURCE_ENERGY];
            });
            //console.log(creep,"findPickup", containers);
            return containers[0];
        } else {
           // console.log(creep,"findPickup no containers found target", tasks.getTargetId(creep));
            return Game.getObjectById(tasks.getTargetId(creep));
        }
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
























































