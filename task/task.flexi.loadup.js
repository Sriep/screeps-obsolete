/**
 * Created by Piers on 08/08/2016.
 */
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
var TaskOffloadSwitch = require("task.offload.switch");
/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module TaskFlexiLoadup
 */
"use strict";

function TaskFlexiLoadup (resourceId) {
    this.taskType = gc.TASK_FLEXI_LOADUP;
    this.conflicts = gc.TRANSFER;
    this.resourceId = resourceId;
    this.oldTaskList = undefined;
    //this.state = gc.SWITCH_STATE_FILLUP;
    this.pickup = true;
    this.loop = true;
}

TaskFlexiLoadup.prototype.doTask = function(creep, task) {
   // console.log(creep, "TaskFlexiLoadup start",JSON.stringify(creep.memory.tasks.tasklist));
    tasks.setTargetId(creep, undefined);
    if (undefined === creep)
        return gc.RESULT_FINISHED;
    if ( undefined == task.state) {
        task.state = gc.SWITCH_STATE_FILLUP;
    }

    //console.log(creep,"TaskFlexiLoadup creep.carryCapacity ",creep.carryCapacity
    //   ,"carry",_.sum(creep.carry),"state",task.state);

    if ( creep.carry.energy == 0
        && gc.SWITCH_STATE_REPAIR == task.state ) {
        task.state = gc.SWITCH_STATE_FILLUP;
    }
    if (creep.carryCapacity <= _.sum(creep.carry)
        && gc.SWITCH_STATE_FILLUP == task.state ) {
        task.state = gc.SWITCH_STATE_REPAIR
    }

    if ( task.state == gc.SWITCH_STATE_REPAIR) {
        //console.log("switch to offload");
        this.switchToOffload(creep, task);
        return gc.RESULT_FINISHED;

    } else { // task.state == gc.SWITCH_STATE_FILLUP)
        //console.log("switchToFillUp");
        this.switchToFillUp(creep, task);
        return gc.RESULT_FINISHED
    }
};

TaskFlexiLoadup.prototype.switchToOffload = function (creep, task) {
    //console.log(creep, "somehow got into switchToOffload");
    var findWall = new TaskMoveFind(
        gc.FIND_FUNCTION,
        gc.RANGE_REPAIR,
        "findTarget",
        "role.wall.builder",
        undefined,
        undefined,
        "moveAndRepair",
        "role.repairer"
    );
    var offload = new TaskOffload(gc.REPAIR);
    var newTaskList = [];
    newTaskList.push(findWall);
    newTaskList.push(offload);
    newTaskList.push(task);
    creep.memory.tasks.tasklist = newTaskList;
};

TaskFlexiLoadup.prototype.switchToFillUp = function (creep, task) {
    var moveToStorage  = TaskOffloadSwitch.prototype.moveToStorage(creep);
    var loadupEnergy;
    if (moveToStorage.mode == gc.FLEXIMODE_HARVEST) {
        loadupEnergy = new TaskHarvest();
    } else {
        loadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
    }
    var newTaskList = [];
    newTaskList.push(moveToStorage);
    newTaskList.push(loadupEnergy);
    newTaskList.push(task);
    creep.memory.tasks.tasklist = newTaskList;
    //console.log(creep, "switchToFillUp end",JSON.stringify(creep.memory.tasks.tasklist));
};

module.exports = TaskFlexiLoadup;

/*
TaskFlexiLoadup.prototype.doTask = function(creep, task) {
    return;
    tasks.setTargetId(creep, undefined);
    if (undefined === creep)
        return gc.RESULT_FINISHED;
    if ( undefined == creep.memory.tasks.state) {
        creep.memory.tasks.state = gc.SWITCH_STATE_FILLUP;
    }

    console.log(creep,"TaskFlexiLoadup creep.carryCapacity ",creep.carryCapacity
        ,"carry",_.sum(creep.carry),"state",creep.memory.tasks.state);


    if ( creep.carry.energy == 0
        && gc.SWITCH_STATE_REPAIR == creep.memory.tasks.state ) {

        task.oldTaskList = creep.memory.tasks.tasklist;
        creep.memory.tasks.tasklist = undefined;
        tasks.setTargetId(creep, undefined);
        creep.memory.tasks.state = gc.SWITCH_STATE_FILLUP;

    }
    if (creep.carryCapacity <= _.sum(creep.carry)
        && gc.SWITCH_STATE_FILLUP == creep.memory.tasks.state ) {

        creep.memory.tasks.tasklist = task.oldTaskList;
        task.oldTaskList = undefined;
        tasks.setTargetId(creep, undefined);
        creep.memory.tasks.state = gc.SWITCH_STATE_REPAIR
    }
    if ( gc.SWITCH_STATE_FILLUP == creep.memory.tasks.state
        && undefined === task.oldTaskList ) {

        task.oldTaskList = creep.memory.tasks.tasklist;
    }

    console.log(creep,"TaskFlexiLoadup state", creep.memory.tasks.state);

    console.log(creep,"TaskFlexiLoadup creep.carryCapacity ",creep.carryCapacity
        ,"carry",_.sum(creep.carry),"state",creep.memory.tasks.state);

    if ( creep.memory.tasks.state == gc.SWITCH_STATE_REPAIR) {
        tasks.setTargetId(creep, undefined);
        return gc.RESULT_FINISHED;
    } else { // creep.memory.tasks.state == gc.SWITCH_STATE_FILLUP)
        var oldTaskList = task.oldTaskList;
        this.switchToFillUp(creep, oldTaskList, task);
        console.log(creep,"TaskFlexiLoadup newtasklist len", creep.memory.tasks.tasklist.length);
        return gc.RESULT_FINISHED
    }
};*/

























