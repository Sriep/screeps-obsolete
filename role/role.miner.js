/**
 * Created by Piers on 10/08/2016.
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var gc = require("gc");
var gf = require("gf");
var TaskMoveFind = require("task.move.find");
var TaskHarvest = require("task.harvest");
var TaskOffload = require("task.offload");
var TaskMovePos = require("task.move.pos");
var TaskMoveRoom = require("task.move.room");
var roleMoveResource = require("role.move.resource");
var _ = require('lodash');

var roleMiner = {
    getTaskList: function (creep, homeRoom, mineId, resourceId, minePos, defensive) {
        var tasks = [];
        //var moveToMineral = new TaskMoveFind(gc.FIND_ID ,gc.RANGE_HARVEST, mineId);
        //function TaskMovePos (roomPos, range, pathOps, customMoveToFunction, functionModule)
        if (!minePos) {
            minePos = Game.getObjectById(mineId).pos
        }

        var moveToStorage = new TaskMoveFind(gc.FIND_FUNCTION, gc.RANGE_TRANSFER
            , "findStorage", "role.miner");
        var offload = new TaskOffload(gc.TRANSFER, resourceId);
        if (defensive) {
            var moveToMineral = new TaskMovePos(
                minePos,
                1,
                undefined,
                "defensiveMoveTo",
                "tasks"
            );
            var harvest = new TaskHarvest(mineId);
            harvest.defensive = true;
            var moveToStorageRoom = new TaskMoveRoom(
                homeRoom,
                undefined,
                "defensiveMoveTo",
                "tasks"
            );
        } else {
            moveToMineral = new TaskMovePos(minePos, 1);
            harvest = new TaskHarvest(mineId);
            moveToStorageRoom = new TaskMoveRoom(homeRoom);
        }
        moveToMineral.pickup = false;
        harvest.pickup = false;
        moveToStorageRoom.pickup = false;
        moveToStorage.pickup = false;
        offload.pickup = false;

        tasks.push(moveToMineral);
        tasks.push(harvest);
        if (homeRoom != minePos.roomName) {
            tasks.push(moveToStorageRoom);
        }
        tasks.push(moveToStorage);
        tasks.push(offload);
        //console.log(creep,"roleminer tasks",JSON.stringify(tasks));
        return tasks;
    },

    findStorage: function (creep) {
        var resourceId = gf.mostAbundantNonEnergyStore(creep.carry);
        //console.log(creep,"findStorage resourceId",resourceId);
        return roleMoveResource.findOffloadTarget(creep.room, resourceId);
        /*
         var labs = creep.room.find(FIND_STRUCTURES, {
         filter: function(l) {
         return l.structureType == STRUCTURE_LAB
         && creep.carry[l.mineralType] > 0
         && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
         }
         });
         if (labs) {
         labs.sort(function(l1,l2) { return l1.energy - l2.energy; });
         return labs[0];
         }


         var storages = creep.room.find(FIND_STRUCTURES, {
         filter: function(s) {
         return ( s.structureType == STRUCTURE_STORAGE
         || s.structureType == STRUCTURE_TERMINAL )
         && s.storeCapacity - _.sum(s.store) > gc.KEEP_FREE_STORAGE_SPACE
         }
         });
         cnosole.log(creep,"findStorage",storages);
         if (storages) {
         if (1 < storages.length) {
         return creep.pos.findClosestByPath(storages);
         }

         return storages[0];
         }
         return undefined;
         */
    }
};


module.exports = roleMiner;





























