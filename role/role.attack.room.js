/**
 * Created by Piers on 15/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var TaskMoveRoom = require("task.move.room");
var TaskMoveFind = require("task.move.find");
var TaskAttackId = require("task.attack.id");
var policy = require("policy");
var tasks = require("tasks");
var gc = require("gc");
/**
 * Abstract role object for creeps building in a neutral room
 * @module attackRoom
 */
var attackRoom = {

    getTaskList: function(creep, roomName, targetList) {
        var tasks = [];
        var moveToRoom = new TaskMoveRoom(roomName);

        var findFunction = targetList ? "findNextInList" : "findNextTarget";
        var moveToTarget = new TaskMoveFind(
            gc.FIND_FUNCTION ,
            gc.RANGE_TRANSFER,
            findFunction,
            "role.attack.room",
            undefined,
            undefined,
            "moveAndAttack",
            "tasks"
        );
        moveToTarget.findList = targetList;
        var attackRoom = new TaskAttackId();

        tasks.push(moveToRoom);
        tasks.push(moveToTarget);
        tasks.push(attackRoom);
        return tasks;
    },

    findNextInList: function(creep, targetList) {
        if (!targetList || targetList.length == 0) return this.findNextTarget(creep);
        tasks.setTargetId(creep,undefined);
        var target;
        for ( var i = 0 ; i < targetList ; i++ ) {
            switch (targetList[i].type) {
                case gc.TARGET_ID:
                    target = Game.getObjectById(targetList[i].target);
                    console.log("findNextInList ID",target);
                    if (target !== null) return target;
                    break;
                case gc.TARGET_FIND_TYPE:
                    target = creep.pos.findClosestByPath(targetList[i].target);
                    console.log("findNextInList TARGET_FIND_TYPE",target);
                    if (target != null) return target;
                    break;
                case gc.TARGET_STRUCTURE:
                    target = creep.pos.findClosestByPath(targetList[i].target, {
                        filter: function(struc) {
                            return struc.structureType == targetType;
                        }
                    });
                    console.log("findNextInList TARGET_STRUCTURE",target);
                    if (target != null) return target;
                    break;
                default:
            }
        }
    },


    findNextTarget: function(creep) {
        var target;
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_TOWER
            }
        });
      //  console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
      //  console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
       // console.log(creep,"findNextTarget",target);
        if (target != null) return target;

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_EXTENSION
            }
        });
      //  console.log(creep,"findNextTarget",target);
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
      //  console.log(creep,"findNextTarget",target);
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
      //  console.log(creep,"findNextTarget",target);
        return target;
    },

};


module.exports = attackRoom;