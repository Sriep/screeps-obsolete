/**
 * Created by Piers on 11/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Task to transfer resouce to creep
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var roleEnergyPorter = require("role.energy.porter");
var TaskMoveFind = require("task.move.find");
var TaskLoadup = require("task.loadup");
var TaskOffload = require("task.offload");
var TaskHarvest = require("task.harvest");
var TaskMovePos = require("task.move.pos");
var roomOwened = require("room.owned");
/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module TaskFlxiOffload
 */
"use strict";
TaskOffloadSwitch.prototype.State = {
    SWITCH_STATE_PRODUCTION:  gc.SWITCH_STATE_PRODUCTION,
    SWITCH_STATE_CONSTRUCTION:  gc.SWITCH_STATE_CONSTRUCTION,
    SWITCH_STATE_FILLUP:  gc.SWITCH_STATE_FILLUP,
    SWITCH_STATE_UPGRADE:  gc.SWITCH_STATE_UPGRADE,
    SWITCH_STATE_MINERAL_TRANSPORT: gc.SWITCH_STATE_MINERAL_TRANSPORT
};


function TaskOffloadSwitch (resourceId, storageIds) {
    this.taskType = gc.TASK_OFFLOAD_SWITCH;
    this.conflicts = gc.TRANSFER;
    this.resourceId = resourceId;
    this.pickup = true;
    this.loop = true;
}

TaskOffloadSwitch.prototype.doTask = function(creep) {
   // console.log(creep,"TaskOffloadSwitch energy",creep.carry.energy);
    tasks.setTargetId(creep, undefined);
    this.changeState(creep,undefined);
    if (undefined === creep)
        return gc.RESULT_UNFINISHED;
    if (creep.carry.energy == 0) {
        //console.log(creep,"TaskOffloadSwitch switchToFillUp");
        if (this.needMineralTransport(creep)) {
            console.log(creep,"needMineralTransport");
            this.switchToMineralTransport(creep);
        } else {
            //console.log(creep,"switchToFillUp");
            this.switchToFillUp(creep);
        }
        return gc.RESULT_RESET
    }
    
    if (this.needEmergencyUpgrade(creep)) {
        this.switchToUpgradeing(creep);
       // console.log(creep,"TaskOffloadSwitch needEmergencyUpgrade");
        return gc.RESULT_RESET
    }

    if (roleEnergyPorter.nextEnergyContainer(creep)){
        this.switchToProduction(creep);
       // console.log(creep,"TaskOffloadSwitch switchToProduction");
        return gc.RESULT_RESET
    }

    var labs = creep.room.find(FIND_STRUCTURES, {
        filter: function(l) {
            return l.structureType == STRUCTURE_LAB
                && l.energy < l.energyCapacity * gc.LAB_REFILL_ENERGY_THRESHOLD
                && Game.flags[l.id].secondaryColor != COLOR_WHITE;
        }
    });
    if (labs.length > 0
        || ( (creep.room.terminal)
            && creep.room.terminal.store[RESOURCE_ENERGY]
                < gc.TERMINAL_ENERGY_REFILL_THRESHOLD) ) {
        this.switchToStockLab(creep);
        return gc.RESULT_RESET
    }


    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (constructionSites.length > 0) {
        this.switchToConstruction(creep);
       //console.log(creep,"TaskOffloadSwitch switchToConstruction");
        return gc.RESULT_RESET
    }

   // console.log(creep,"TaskOffloadSwitch switchToUpgradeing");
    this.switchToUpgradeing(creep);
    return gc.RESULT_RESET;
};

TaskOffloadSwitch.prototype.needEmergencyUpgrade = function (creep) {
    if (!creep.room.controller) return false;
    return creep.room.controller.ticksToDowngrade < gc.EMERGENCY_DOWNGRADING_THRESHOLD;
           // || creep.room.controller.level < 2;
};

TaskOffloadSwitch.prototype.changeState = function (creep, state) {
    creep.memory.tasks.state = state;
};

TaskOffloadSwitch.prototype.moveToStorage = function (creep) {
    var moveToStorage;
    var energyDumps = creep.room.find(FIND_STRUCTURES, {
                        filter: function(object) {
                            return (object.structureType == STRUCTURE_CONTAINER
                            || object.structureType == STRUCTURE_STORAGE
                            || object.structureType == STRUCTURE_TERMINAL
                            || object.structureType == STRUCTURE_LINK) ;
                        }
    });
    var energy = 0;
    for ( var i = 0 ; i < energyDumps.length ; i++ ) {
        if (energyDumps[i].structureType == STRUCTURE_LINK) {
            energy += energyDumps[i].energy;
        } else {
            energy = energy + energyDumps[i].store[RESOURCE_ENERGY];
        }
    }
    if (energy > 0) {
        energyDumps.sort(this.energyDumpSortOrder);
        moveToStorage = new TaskMoveFind(gc.FIND_ID, gc.RANGE_TRANSFER, energyDumps[0].id);
        moveToStorage.mode = gc.FLEXIMODE_CONTAINER;
    } else {
        moveToStorage = new TaskMoveFind(gc.FIND_FUNCTION, gc.RANGE_HARVEST
            , "findTargetSource", "role.base");
        moveToStorage.mode = gc.FLEXIMODE_HARVEST;
    }
    return moveToStorage;
};

// todo could alter to take account of portors heading to container and their capacity.
TaskOffloadSwitch.prototype.energyDumpSortOrder = function(a, b) {
    if (a.structureType == STRUCTURE_CONTAINER
        && b.structureType != STRUCTURE_CONTAINER
        && a.store[RESOURCE_ENERGY]/a.storeCapacity > gc.LOAD_FROM_CONTAINER_RATIO)
        return -1;
    if (b.structureType == STRUCTURE_CONTAINER
        && a.structureType != STRUCTURE_CONTAINER
        && b.store[RESOURCE_ENERGY]/b.storeCapacity > gc.LOAD_FROM_CONTAINER_RATIO)
        return 1;
    var bEnergy, aEnergy;
    if (a.structureType == STRUCTURE_LINK) {
        aEnergy = a.energy;
    } else {
        aEnergy = a.store[RESOURCE_ENERGY];
    }
    if (b.structureType == STRUCTURE_LINK) {
        bEnergy = b.energy;
    } else {
        bEnergy = b.store[RESOURCE_ENERGY];
    }
    return bEnergy - aEnergy;
};

TaskOffloadSwitch.prototype.switchToFillUp = function (creep) {
    var moveToStorage  = TaskOffloadSwitch.prototype.moveToStorage(creep);
    var loadupEnergy;
    if (moveToStorage.mode == gc.FLEXIMODE_HARVEST) {
        loadupEnergy = new TaskHarvest();
    } else {
        loadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
    }
    var switchTaskLists = new TaskOffloadSwitch();
    var newTaskList = [];
    newTaskList.push(moveToStorage);
    newTaskList.push(loadupEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep,this.State.SWITCH_STATE_FILLUP);
};

TaskOffloadSwitch.prototype.switchToMineralTransport = function (creep) {
    var labs = creep.room.find(FIND_STRUCTURES, {
        filter: function(l) {
            return l.structureType == STRUCTURE_LAB
                && l.secondaryColor == COLOR_WHITE
                && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
        }
    });
    var i = 0;
    while ( i < labs.length
        && (!creep.room.storage ||  creep.room.storage.store[labs[i].mineralType] == 0)
        && (!creep.room.terminal ||  creep.room.terminal.store[labs[i].mineralType] == 0) ) {
        i++;
    }
    if ( i == labs.length) return; // should never happen.
    var lab = labs[i];
    var targetStorage;
    if (creep.room.storage && creep.room.storage.store[labs[i].mineralType] == 0)
        targetStorage = creep.room.storage;
    else if (creep.room.terminal && creep.room.terminal.store[labs[i].mineralType] == 0)
        targetStorage = creep.room.storage;
    else
        return; // should never get here

    var moveToStorage = new TaskMovePos(targetStorage.pos,1);
    var loadup = new  TaskLoadup (lab.mineralType, targetStorage.id);
    var moveToLab = new TaskMovePos(lab.pos,1);
    var offload = new TaskOffload(
        gc.TRANSFER,
        lab.mineralType,
        undefined,
        undefined,
        lab.id
    );
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToStorage);
    newTaskList.push(loadup);
    newTaskList.push(moveToLab);
    newTaskList.push(offload);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep,this.State.SWITCH_STATE_MINERAL_TRANSPORT);
};

TaskOffloadSwitch.prototype.needMineralTransport = function (creep) {
    var labs = creep.room.find(FIND_STRUCTURES, {
        filter: function(l) {
            return l.structureType == STRUCTURE_LAB
                && l.secondaryColor == COLOR_WHITE
                && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
        }
    });
    if (labs.length > 0) {
        var transportCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: function(c) {
                return c.memory.tasks.state == gc.SWITCH_STATE_MINERAL_TRANSPORT;
            }
        });
        if (transportCreeps.length == 0) {
            for ( var i = 0 ; i < labs.length ; i++ ) {
                if (creep.room.storage && creep.room.storage.store[labs[i].mineralType] > 0
                     || creep.room.terminal && creep.room.terminal.store[labs[i].mineralType] > 0)
                    return true;
            }
        }
    }
};

TaskOffloadSwitch.prototype.switchToProduction = function (creep) {
    var moveToEnergyContainer = new TaskMoveFind(
        gc.FIND_FUNCTION,
        gc.RANGE_TRANSFER
        , "nextEnergyContainer",
        "role.flexi.storage.porter",
        undefined,
        undefined,
        "moveAndRepair",
        "role.repairer"
    );
    var offloadEnergy = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
    //offloadEnergy.canUseAlternative = true;
    var switchTaskLists = new TaskOffloadSwitch();
    
    var newTaskList = [];
    newTaskList.push(moveToEnergyContainer);
    newTaskList.push(offloadEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_PRODUCTION);
};

TaskOffloadSwitch.prototype.switchToStockLab = function (creep) {
    var moveToLab = new TaskMoveFind(
        gc.FIND_FUNCTION,
        gc.RANGE_TRANSFER,
        "nextLab",
        "role.flexi.storage.porter",
        undefined,
        undefined,
        "moveAndRepair",
        "role.repairer"
    );
    var offloadEnergy = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToLab);
    newTaskList.push(offloadEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_PRODUCTION);
};

TaskOffloadSwitch.prototype.switchToConstruction = function (creep) {
    var moveToConstructionSite = new TaskMoveFind(
        gc.FIND_ROOM_OBJECT,
        gc.RANGE_BUILD,
        FIND_CONSTRUCTION_SITES,
        undefined,
        undefined,
        undefined,
        "moveAndRepair",
        "role.repairer"
    );
    var offloadBuild = new TaskOffload(gc.BUILD);
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToConstructionSite);
    newTaskList.push(offloadBuild);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_CONSTRUCTION);
};

TaskOffloadSwitch.prototype.switchToUpgradeing = function (creep) {
    if (!creep.room.controller) return;
    var moveToController = new TaskMoveFind(
        gc.FIND_ID,
        gc.RANGE_UPGRADE,
        creep.room.controller.id,
        undefined,
        undefined,
        undefined,
        "moveAndRepair",
        "role.repairer"
    );
    var upgradeController = new TaskOffload(gc.UPGRADE_CONTROLLER);

    //var storage = creep.room.storage;
    //var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storage.id);
    var moveToStorage  = TaskOffloadSwitch.prototype.moveToStorage(creep);

    var loadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
    var switchTaskLists = new TaskOffloadSwitch();
    
    var newTaskList = [];
    newTaskList.push(moveToController);
    newTaskList.push(upgradeController);
    newTaskList.push(moveToStorage);
    newTaskList.push(loadupEnergy);    
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_UPGRADE);
};

module.exports = TaskOffloadSwitch;



























































