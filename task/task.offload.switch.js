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
var roleMoveResource = require("role.move.resource");
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
    SWITCH_STATE_MINERAL_TRANSPORT: gc.SWITCH_STATE_MINERAL_TRANSPORT,
    SWITCH_STATE_NO_ACTION: gc.SWITCH_STATE_NO_ACTION
};


function TaskOffloadSwitch () {
    this.taskType = gc.TASK_OFFLOAD_SWITCH;
    this.conflicts = gc.TRANSFER;
    this.resourceId = undefined;
    this.pickup = true;
    this.loop = true;
}

TaskOffloadSwitch.prototype.doTask = function(creep) {
    if (creep.name == "Carter") console.log(creep,"start of TaskOffloadSwitch")
    if (!this.state(creep)) {
        if (creep.memory.tasks && creep.memory.tasks.state)
            this.changeState(creep, creep.memory.tasks.state);
        else
            this.changeState(creep, gc.SWITCH_STATE_NO_ACTION);
    }
    var roleFlexiStoragePorter = require("role.flexi.storage.porter");
    if (creep.name == "Carter") console.log(creep,"TaskOffloadSwitch energy",creep.carry.energy);
    tasks.setTargetId(creep, undefined);
    if (undefined === creep)
        return gc.RESULT_UNFINISHED;

    if (_.sum(creep.carry) > creep.carry.energy) {
        if (this.switchToOffloadMinerals(creep))
            return gc.RESULT_RESET;
    }

    if (this.checkSwitchTransportMinerals(creep)) {
        if (creep.name == "Carter") console.log(creep,"this.state creep", this.state(creep),"portersWithState",
            this.portersWithState(creep, gc.SWITCH_STATE_MINERAL_TRANSPORT))

        var requireMoveFrom = roleMoveResource.requireMoveMineralsFrom(creep.room);
        if(requireMoveFrom) {
            var plan = this.planMoveFrom(creep, requireMoveFrom);
            if (plan) {
          //      console.log(creep,"TaskOffloadSwitch from plan",JSON.stringify(plan));
                this.enactTrasportPlan(creep, plan);
                return gc.RESULT_RESET
            }
        }
        var requireMoveTo = roleMoveResource.requireMoveMineralsTo(creep.room);
        if(requireMoveTo) {
            plan = this.planMoveTo(creep, requireMoveTo);
            if (plan) {
             //   console.log(creep,"TaskOffloadSwitch to plan",JSON.stringify(plan));
                this.enactTrasportPlan(creep, plan);
                return gc.RESULT_RESET
            }
        }
    }

    if (creep.carry.energy == 0 ) {
        if (creep.name == "Carter") console.log(creep,"switch to fill up");
        this.switchToFillUp(creep);
        return gc.RESULT_RESET
    }
    
    if (this.needEmergencyUpgrade(creep)) {
        if (creep.name == "Carter") console.log(creep,"switchToUpgradeing emergancy");
        this.switchToUpgradeing(creep);
        //console.log(creep,"TaskOffloadSwitch needEmergencyUpgrade");
        return gc.RESULT_RESET
    }

    if (roleEnergyPorter.nextEnergyContainer(creep)){
        this.switchToProduction(creep);
        if (creep.name == "Carter") console.log(creep,"TaskOffloadSwitch switchToProduction");
        return gc.RESULT_RESET
    }

    if (creep.room.controller && creep.room.controller.level >= 6 && roleFlexiStoragePorter.nextLab(creep)) {
        if (creep.name == "Carter") console.log(creep,"TaskOffloadSwitch switchToStockLab");
        this.switchToStockLab(creep);
        return gc.RESULT_RESET
    }


    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (constructionSites.length > 0) {
        this.switchToConstruction(creep);
        if (creep.name == "Carter") console.log(creep,"TaskOffloadSwitch switchToConstruction");
        return gc.RESULT_RESET
    }

    if (creep.name == "Carter") console.log(creep,"TaskOffloadSwitch switchToUpgradeing");
    this.switchToUpgradeing(creep);
    return gc.RESULT_RESET;
};

TaskOffloadSwitch.prototype.needEmergencyUpgrade = function (creep) {
    if (!creep.room.controller) return false;
    return creep.room.controller.ticksToDowngrade < gc.EMERGENCY_DOWNGRADING_THRESHOLD;
           // || creep.room.controller.level < 2;
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
    if (creep.name == "Carter") console.log(creep, "in move to storage offload swithc energy", energy)
        if (energy > 0) {
        energyDumps.sort(this.energyDumpSortOrder);
        moveToStorage = new TaskMoveFind(gc.FIND_ID, gc.RANGE_TRANSFER, energyDumps[0].id);
        moveToStorage.mode = gc.FLEXIMODE_CONTAINER;
    } else {
        moveToStorage = new TaskMoveFind(
            gc.FIND_FUNCTION,
            gc.RANGE_HARVEST,
            "findTargetSource",
            "role.base"
        );
        moveToStorage.mode = gc.FLEXIMODE_HARVEST;
    }
    //if (creep.name == "Carter") console.log("moveToStorage  taskmoveToStorage",JSON.stringify(moveToStorage));
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
    if (creep.name == "Carter") console.log(creep, "end of TAskOFfloadSwithc mode",
        moveToStorage.mode, "tasks" ,JSON.stringify(newTaskList));

    this.changeState(creep,this.State.SWITCH_STATE_FILLUP);
};

TaskOffloadSwitch.prototype.switchOffLoadMinerals = function (creep) {


};

TaskOffloadSwitch.prototype.switchToMineralTransport = function (creep) {
    var plan = roleMoveResource.findLabAndStorage(creep.room);
    if (!plan) return;
    console.log(creep,"switchToMineralTransport",JSON.stringify(plan));
    var moveToStorage = new TaskMovePos(plan.from.pos,1);
    var loadup = new  TaskLoadup (plan.resource, plan.from.id);
    var moveToLab = new TaskMovePos(plan.to.pos,1);
    var offload = new TaskOffload(
        gc.TRANSFER,
        plan.resource,
        undefined,
        undefined,
        plan.to.id
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
/*
TaskOffloadSwitch.prototype.needMineralTransport = function (creep) {
    var labs = creep.room.find(FIND_STRUCTURES, {
        filter: function(l) {
            return l.structureType == STRUCTURE_LAB
                && l.secondaryColor == COLOR_WHITE
                && l.color != COLOR_WHITE
                && l.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD
        }
    });
    if (labs.length > 0) {
        var transportCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: function(c) {
                return this.state(c) == gc.SWITCH_STATE_MINERAL_TRANSPORT
                        && c.name != creep.name;
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
*/
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

TaskOffloadSwitch.prototype.planMoveFrom = function(creep, requireMoveFrom) {
    var plan = requireMoveFrom;
    plan.to = roleMoveResource.findOffloadTarget(creep.room, requireMoveFrom.resourceId);
    if (plan.to)
        return plan;
};

TaskOffloadSwitch.prototype.planMoveTo = function(creep, requireMoveTo) {
    var plan = requireMoveTo;
    plan.from = roleMoveResource.findLoadTarget(creep.room, requireMoveTo.resourceId);
    if (plan.from)
        return plan;
};

TaskOffloadSwitch.prototype.enactTrasportPlan = function(creep, plan) {
    var moveToFrom = new TaskMovePos(plan.from.pos,1);
    var loadup = new  TaskLoadup (plan.resourceId, plan.from.id);
    var moveToTo = new TaskMovePos(plan.to.pos,1);
    var offload = new TaskOffload(
        gc.TRANSFER,
        plan.resourceId,
        undefined,
        undefined,
        plan.to.id
    );
    offload.dropOnFull = true;
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToFrom);
    newTaskList.push(loadup);
    newTaskList.push(moveToTo);
    newTaskList.push(offload);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, gc.SWITCH_STATE_MINERAL_TRANSPORT);
    console.log(creep,"enactTrasportPlan set steate",creep.memory.tasks.switchState )
};

TaskOffloadSwitch.prototype.switchToOffloadMinerals = function (creep) {
    var resource;// = _.max(creep.carry)
    for ( var r in creep.carry ) {
        if (r != RESOURCE_ENERGY && (!resource || creep.carry[r] > creep.carry[resource] ))
            resource = r;
    }
    if (!resource) return false;

    var offloadTarget = roleMoveResource.findOffloadTarget(creep.room, resource);
    var moveToTo = new TaskMovePos(offloadTarget.pos,1);
    var offload = new TaskOffload(
        gc.TRANSFER,
        resource,
        undefined,
        undefined,
        offloadTarget.id
    );
    offload.dropOnFull = true;
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToTo);
    newTaskList.push(offload);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, gc.SWITCH_STATE_MINERAL_TRANSPORT);
    return true;
};

TaskOffloadSwitch.prototype.changeState = function (creep, switchState) {
    if (!switchState) debugger;
    if (!creep.memory.tasks) creep.memory.tasks = {};
    creep.memory.tasks.switchState = switchState;
};

TaskOffloadSwitch.prototype.state = function (creep) {
    if (creep.memory && creep.memory.tasks) {
        return creep.memory.tasks.switchState;
    }
};

TaskOffloadSwitch.prototype.portersWithState = function (creep, switchState) {
    var creeps = creep.room.find(FIND_MY_CREEPS, {
        filter: function(c) {
            return c.memory.role == gc.ROLE_FLEXI_STORAGE_PORTER
                    && creep.memory
                    && creep.memory.tasks
                    && creep.memory.tasks.switchState == switchState;
        }
    });
    //console.log(creep,switchState, "portersWithState",JSON.stringify(creeps));
    return creeps;
};

TaskOffloadSwitch.prototype.checkSwitchTransportMinerals = function (creep) {
    //console.log(creep, "switchTransportMinerals creep.carry.energy",creep.carry.energy);
    if (creep.carry.energy != 0) return false;
    if (!creep.room.controller || creep.room.controller.level < 6) return false;
    //console.log(creep, "switchTransportMinerals this.state(creep)",this.state(creep));
    if ( this.state(creep) == gc.SWITCH_STATE_MINERAL_TRANSPORT) return true;
    var mineralTransporters = this.portersWithState(creep, gc.SWITCH_STATE_MINERAL_TRANSPORT);
    //console.log(creep, "switchTransportMinerals mineralTransporters",JSON.stringify(mineralTransporters));
   // console.log(creep, "(!mineralTransporters || mineralTransporters.length == 0)"
   //     ,(!mineralTransporters || mineralTransporters.length == 0));
    if (!mineralTransporters || mineralTransporters.length == 0) return true;
    return false;
};


module.exports = TaskOffloadSwitch;



























































