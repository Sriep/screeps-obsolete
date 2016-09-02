/**
 * Created by Piers on 21/08/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
"use strict";
var TaskMovePos = require("task.move.pos");
var TaskLoadup = require("task.loadup");
var TaskOffload = require("task.offload");
var gc = require("gc");
var gf = require("gf");
var labColours = require("lab.colours");
/**
 * Task harvest object.
 * @module roleMoveResource
 */

var roleMoveResource = {

    getTaskList: function(creep, fromId, toId, resourceId) {
        var from = Game.getObjectById(fromId);
        var to = Game.getObjectById(toId);
        var moveToFrom = new TaskMovePos(from.pos,1);
        var loadup = new  TaskLoadup (resourceId, from.id);
        var moveToTo = new TaskMovePos(to.pos,1);
        var offload = new TaskOffload(
            gc.TRANSFER,
            resourceId,
            undefined,
            undefined,
            to.id
        );

        var taskList = [];
        taskList.push(moveToFrom);
        taskList.push(loadup);
        taskList.push(moveToTo);
        taskList.push(offload);
        return taskList;
    },

    findLabAndStorage: function (room) {
        var labs = room.find(FIND_STRUCTURES, {
            filter: function(l) {
                return l.structureType == STRUCTURE_LAB
                    && Game.flags[l.id].secondaryColor == COLOR_WHITE
                    && Game.flags[l.id].color != COLOR_WHITE
                    && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
            }
        });
        if (labs.length == 0) return undefined;
        var i = 0, targetStorage, mineralType;
        while ( i++ < labs.length && targetStorage) {
            var flag = Game.flags[lab[i].id]
            mineralType = labColours.resource(flag.color, flag.secondaryColor);
            if (room.storage && room.storage.store[labs[i].mineralType] > 0) {
                targetStorage = room.storage;
            } else if (room.terminal && room.terminal.store[labs[i].mineralType] > 0) {
                targetStorage = room.terminal;
            }
        }
        if ( i >= labs.length || !targetStorage ) return undefined;
        return { from : targetStorage.id, to : lab[i].id, resourceId : mineralType }
    },

    requireMoveMineralsFrom: function(room) {
        var resourceId;
        if (room.terminal && _.sum(room.terminal.store) > gc.TERMINAL_FULL_THRESHOLD) {
            resourceId =  gf.mostAbundantNonEnergyStore(room.terminal.store);
            if (resourceId) return { from : room.terminal, resourceId : resourceId};
        }
        if (room.storage && _.sum(room.storage.store) > gc.STORAGE_FULL_THRESHOLD)
        {
            resourceId =  gf.mostAbundantNonEnergyStore(room.storage.store);
            if (resourceId) return { from : room.storage, resourceId : resourceId};
        }

        var labs = room.find(FIND_STRUCTURES, {
            filter: function(l) {
                return l.structureType == STRUCTURE_LAB
                    && l.mineralAmount > 0
                    && Game.flags[l.id]
                    && l.mineralType != labColours.resource(Game.flags[l.id].color , Game.flags[l.id].secondaryColor);
            }
        });
        if (labs.length > 0)
            return { from : labs[0], resourceId : labs[0].mineralType };
   /*
        var containers = room.find(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER
                    && _.sum(c.store) > c.store[RESOURCE_ENERGY];
            }
        });
        if (containers.length > 0)
            return { from : containers[0], resourceId : gf.mostAbundantNonEnergyStore(containers[0].store)};
    */
    },

    requireMoveMineralsTo: function(room) {
        var labs = room.find(FIND_STRUCTURES, {
            filter: function(l) {
                return l.structureType == STRUCTURE_LAB
                    && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
                    && Game.flags[l.id]
                    && Game.flags[l.id].secondaryColor == COLOR_WHITE
                    && Game.flags[l.id].color != COLOR_WHITE

            }
        });
        if (labs.length > 0)
            return { to : labs[0], resourceId : labColours.resource(Game.flags[labs[0].id].color
                                                            , Game.flags[labs[0].id].secondaryColor) };
    },

    findLoadTarget: function (room, resourceId) {
        if (room.storage && room.storage.store[resourceId] > 0)
            return  room.storage;
        if (room.terminal && room.terminal.store[resourceId] > 0)
            return  room.terminal;
    },

    findOffloadTarget: function(room, resourceId) {
        //console.log(room,"rolemoveresouce findOffloadTarget ",resourceId);
        var labs = room.find(FIND_STRUCTURES, {
            filter: function(l) {
                return l.structureType == STRUCTURE_LAB
                    && l.mineralType == resourceId
                    && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
                    && Game.flags[l.id]
                    && resourceId == labColours.resource(Game.flags[l.id].color , Game.flags[l.id].secondaryColor);
            }
        });
        if (labs.length > 0) {
            return  labs[0];
        }
        if (room.terminal && _.sum(room.terminal.store) < gc.TERMINAL_RESTOCK_THRESHOLD)
            return room.terminal;
        if (room.storage &&  _.sum(room.storage.store) < gc.STORAGE_RESTOCK_THRESHOLD) {
            //console.log(room,"rolemoveresouce findofflaodtarget storage",room.storage);
            return room.storage;
        }

    }

};

module.exports = roleMoveResource;




















