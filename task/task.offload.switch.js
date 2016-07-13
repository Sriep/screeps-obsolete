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
var gc = require("gc");
var tasks = require("tasks");
var roleEnergyPorter = require("role.energy.porter");
var TaskMoveFind = require("task.move.find");
var TaskLoadup = require("task.loadup");
var TaskOffload = require("task.offload");
var TaskHarvest = require("task.harvest");
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
    SWITCH_STATE_UPGRADE:  gc.SWITCH_STATE_UPGRADE
};


function TaskOffloadSwitch (resourceId) {
    this.taskType = gc.TASK_OFFLOAD_SWITCH;
    this.conflicts = gc.TRANSFER;
   // this.state = this.State.SWITCH_STATE_FILLUP;
    this.resourceId = resourceId;
    this.pickup = true;
    this.loop = true;
}

TaskOffloadSwitch.prototype.doTask = function(creep) {
  //  console.log(creep,"0TaskOffloadSwitch");
    tasks.setTargetId(creep, undefined);
    if (undefined === creep)
        return gc.RESULT_UNFINISHED
    if (creep.carry.energy == 0) {
        var storage =  creep.room.storage;
        if (!storage) {
            //  console.log(creep,"Cant find storage");
            //  creep.say("help storage");
            return gc.RESULT_RESET;
        } else {
            this.switchToFillUp(creep);
            return gc.RESULT_RESET
        }
    }
    
    if (this.needEmergencyUpgrade(creep)) {
        this.switchToUpgradeing(creep);
        return gc.RESULT_RESET
    }

    if (roleEnergyPorter.nextEnergyContainer(creep)){
        this.switchToProduction(creep);
        return gc.RESULT_RESET
    }

    var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSites.length > 0) {
        this.switchToConstruction(creep);
        return gc.RESULT_RESET
    }
    
    this.switchToUpgradeing(creep);
    return gc.RESULT_RESET
};

TaskOffloadSwitch.prototype.needEmergencyUpgrade = function (creep) {
    return creep.room.controller.ticksToDowngrade < gc.EMERGENCY_DOWNGRADING_THRESHOLD
            || creep.room.controller.level < 2;
};

TaskOffloadSwitch.prototype.changeState = function (creep, state) {
    //this.state = state;
    creep.memory.tasks.state = state;
};

TaskOffloadSwitch.prototype.switchToFillUp = function (creep) {
    
    var storage = creep.room.storage;
    var moveToStorage, louadupEnergy;
    if (undefined !== storage && storage.store[RESOURCE_ENERGY] > 0) {
        moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storage.id);
        louadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
    } else {
        //moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storage.id);
        //louadupEnergy = new TaskLoadup(RESOURCE_ENERGY);

        moveToStorage = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findTargetSource","role.base");
        louadupEnergy = new TaskHarvest();
    }

    var switchTaskLists = new TaskOffloadSwitch();
    var newTaskList = [];
    newTaskList.push(moveToStorage);
    newTaskList.push(louadupEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep,this.State.SWITCH_STATE_FILLUP);
};

TaskOffloadSwitch.prototype.switchToProduction = function (creep) {
    var moveToEnergyContainer = new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
        , "nextEnergyContainer","role.flexi.storage.porter");
    var offloadEnergy = new TaskOffload(gc.TRANSFER, RESOURCE_ENERGY);
    var switchTaskLists = new TaskOffloadSwitch();
    
    var newTaskList = [];
    newTaskList.push(moveToEnergyContainer);
    newTaskList.push(offloadEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_PRODUCTION);
};

TaskOffloadSwitch.prototype.switchToConstruction = function (creep) {
    var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
        ,FIND_MY_CONSTRUCTION_SITES);
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
    var moveToController = new TaskMoveFind(gc.FIND_ID,gc.RANGE_UPGRADE, creep.room.controller.id);
    var upgradeController = new TaskOffload(gc.UPGRADE_CONTROLLER);
    var storage = creep.room.storage;
    var moveToStorage = new TaskMoveFind(gc.FIND_ID,gc.RANGE_TRANSFER,storage.id);
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
/*
TaskOffloadSwitch.prototype.switchToConstruction = function (creep) {
    var moveToConstructionSite = new TaskMoveFind(gc.FIND_ROOM_OBJECT,gc.RANGE_BUILD
        ,FIND_MY_CONSTRUCTION_SITES);
    var offloadBuild = new TaskOffload(gc.BUILD);
    var switchTaskLists = new TaskOffloadSwitch();

    var newTaskList = [];
    newTaskList.push(moveToConstructionSite);
    newTaskList.push(offloadBuild);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
    this.changeState(creep, this.State.SWITCH_STATE_CONSTRUCTION);
};*/

module.exports = TaskOffloadSwitch;

























