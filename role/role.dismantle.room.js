/**
 * Created by Piers on 15/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
"use strict";
var TaskMoveRoom = require("task.move.room");
var TaskMoveFind = require("task.move.find");
var TaskDismantle = require("task.dismantle");
var tasks = require("tasks");
var policy = require("policy");
var gc = require("gc");
/**
 * Abstract role object for creeps building in a neutral room
 * @module dismantleRoom
 */
var dismantleRoom = {

    getTaskList: function(creep, roomName, targetList) {
        var tasks = [];
        var moveToRoom = new TaskMoveRoom(roomName);

        var findFunction = targetList ? "findNextInList" : "findNextTarget";
        var findModule = targetList ? "role.attack.room" : "role.dismantle.room";
        var moveToTarget = new TaskMoveFind(
            gc.FIND_FUNCTION ,
            gc.RANGE_TRANSFER,
            findFunction,
            findModule,
            undefined,
            undefined,
            "defensiveMoveTo",
            "tasks"
        );
        moveToTarget.findList = targetList;
        var dismantle = new TaskDismantle();

        tasks.push(moveToRoom);
        tasks.push(moveToTarget);
        tasks.push(dismantle);
        return tasks;
    },

    findNextTarget: function(creep) {
        //tasks.setTargetId(creep,undefined);
        var target;
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_TOWER
            }
        });
        console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_EXTENSION
            }
        });
        console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_EXTENSION
                    || struc.structureType == STRUCTURE_STORAGE
                    || struc.structureType == STRUCTURE_TERMINAL
                    || struc.structureType == STRUCTURE_LINK
                    || struc.structureType == STRUCTURE_LAB
            }
        });
        console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        var walls = creep.room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return  struc.structureType == STRUCTURE_RAMPART
                        || struc.structureType == STRUCTURE_WALL
            }
        });
        if (walls.length > 0)
        {
            walls.sort( function(t1,t2) { return t1.hits - t2.hits; });
            return walls[0];
        }

        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        console.log(creep,"findNextTarget",target);
        return target;
    },

};


module.exports = dismantleRoom;























