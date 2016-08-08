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
    this.state = gc.SWITCH_STATE_FILLUP;
    this.pickup = true;
    this.loop = true;
}

TaskFlexiLoadup.prototype.doTask = function(creep, task) {
    tasks.setTargetId(creep, undefined);
    if (undefined === creep)
        return gc.RESULT_FINISHED;

    console.log(creep,"TaskFlexiLoadup creep.carryCapacity ",creep.carryCapacity
       ,"carry",_.sum(creep.carry),"state",task.state);

    if ( creep.carry.energy == 0
        && gc.SWITCH_STATE_REPAIR == task.state ) {
        task.state = gc.SWITCH_STATE_FILLUP;
    }
    if (creep.carryCapacity <= _.sum(creep.carry)
        && gc.SWITCH_STATE_FILLUP == task.state ) {
        task.state = gc.SWITCH_STATE_REPAIR;
    }

    console.log(creep,"TaskFlexiLoadup creep.carryCapacity ",creep.carryCapacity
        ,"carry",_.sum(creep.carry),"state",task.state);

    if ( task.state == gc.SWITCH_STATE_REPAIR) {
        console.log(creep,"TaskFlexiLoadup before",task.oldTaskList);
        if (task.oldTaskList) {
            console.log(creep,"TaskFlexiLoadup oldTaskList",  JSON.stringify(task.oldTaskList));
            creep.memory.tasks.tasklist = task.oldTaskList;
            task.oldTaskList = undefined;
        }
        return gc.RESULT_FINISHED;
    } else {
        var oldTaskList = creep.memory.tasks.tasklist;
        this.switchToFillUp(creep, oldTaskList, task);
        console.log(creep,"TaskFlexiLoadup newtasklist len", creep.memory.tasks.tasklist.length);
        return gc.RESULT_FINISHED
    }
};

TaskFlexiLoadup.prototype.switchToFillUp = function (creep, oldTaskList, task) {
    var moveToStorage  = TaskOffloadSwitch.prototype.moveToStorage(creep);
    var loadupEnergy;
    if (moveToStorage.mode == gc.FLEXIMODE_HARVEST) {
        loadupEnergy = new TaskHarvest();
    } else {
        loadupEnergy = new TaskLoadup(RESOURCE_ENERGY);
    }
    var switchTaskLists = new TaskFlexiLoadup(task.resourceId);
    switchTaskLists.oldTaskList = oldTaskList;
    var newTaskList = [];
    newTaskList.push(moveToStorage);
    newTaskList.push(loadupEnergy);
    newTaskList.push(switchTaskLists);
    creep.memory.tasks.tasklist = newTaskList;
};

module.exports = TaskFlexiLoadup;

























