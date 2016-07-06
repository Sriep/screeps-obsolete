/**
 * Created by Piers on 05/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Task base object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var TaskActions = require("task.actions")
/**
 * Task base object.
 * @module tasks
 */
var tasks = {
    
    Type: {
        HARVEST: gc.TASK_HARVEST,
        MOVE_FIND: gc.TASK_MOVE_FIND,
        OFFLOAD: gc.TASK_OFFLOAD,
        MOVE_POS: gc.TASK_MOVE_POS
    },

    Result: {
        Finished: "finished",
        Unfinished: "unfinished",
        Failed: "failed"
    },
    
    
    doTasks: function(creep) {
        var taskList = creep.memory.tasks.tasklist;
        result = this.Result.Finished;
        var actions = new TaskActions(gc.CREEP);
        while (result == this.Result.Finished || result == this.Result.Failed  || taskList.length == 0) {

            var task = taskList[0];
            var moduleName = "task." + task.task;
            console.log(creep," module", taskModule, moduleName,"and task i2", JSON.stringify(task));
            var taskModule = require(moduleName);
         //   );
            var result = taskModule.prototype.doTask(creep, task, actions);
            if (result == this.Result.Finished || result == this.Result.Failed) {
                if (taskList.length > 1) {
                    taskList[1].lastTask = task;
                }
                if (task.nextTask) {
                    taskList.unshift(task.nextTask);
                } else {
                    var doneTask = taskList.shift();
                    if (task.loop) {
                        taskList.push(doneTask);
                    }
                }
            }
        } //while
        
        if (result == this.Result.Unfinished) {

        } else if (0 == taskList.length) {
            emptyTaskList(creep);
        }
    },
    
    showTasks: function (creep) {
        var taskList = creep.memory.tasks.tasklist;
        for ( var i in taskList)  {
            console.log(creep,"task",i,"is", JSON.stringify(taskList[i]));
        }
    },

        

    
    unshiftTask: function (creep,task) {
        creep.memory.tasks.tasklist.unshift(task);
    },

    getTargetId: function (creep) {
        return creep.memory.tasks.targetId;
    },
    
    setTargetId: function (creep, targetId) {
        //console.log("in settarget id,", creep, targetId)
        creep.memory.tasks.targetId = targetId;
    },


    emptyTaskList: function(creep) {

    }

}

module.exports = tasks;












































