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
        Finished: gc.RESULT_FINISHED,
        Unfinished: gc.RESULT_UNFINSHED,
        Failed: gc.RESULT_FAILED,
        Rollback: gc.RESULT_ROLLBACK
    },
    
    MAX_TASK_ACTIONS: 5,
    
    
    doTasks: function(creep) {
        var taskList = creep.memory.tasks.tasklist;
        result = this.Result.Finished;
        var doneActions = new TaskActions(gc.CREEP);
        var actionCount = 0;

        while ((result == this.Result.Finished || result == this.Result.Failed  || result == this.Result.Rollback)
                            && taskList.length > 0 && actionCount++ < this.MAX_TASK_ACTIONS) {

            var task = taskList[0];
            var moduleName = "task." + task.taskType;
            var taskModule = require(moduleName);
            if (task.pickup) {
                this.pickUpLooseEnergy(creep);
                doneActions.actions.add(gc.PICKUP);
            }
         //   console.log(creep ,"about to do task", task.taskType
         //       ,"actions", JSON.stringify(doneActions.actions),"conflicts", task.conflicts);
            
            var result;
            if (!TaskActions.prototype.isConflict(doneActions, task.conflicts)) {
                result = taskModule.prototype.doTask(creep, task, doneActions);
                console.log(creep, "done", task.taskType,"Task, return", result);
                //creep.say(task.conflicts);
                if (this.Result.Finished == result) {
                    doneActions.actions.add(task.conflicts);
                   // console.log(creep, "after is move in",doneActions.actions.has(gc.MOVE),
                   //     "is build in",doneActions.actions.has(gc.BUILD),
                   // "is PICKUP IN",doneActions.actions.has(gc.PICKUP),
                   // "is harvest iin", doneActions.actions.has(gc.HARVEST),
                   // "is repaier in",  doneActions.actions.has(gc.REPAIR));
                }
            } else {
                //console.log(creep,"conflict found",task.conflicts);
                result = this.Result.Unfinished;
            }
            if (this.Result.Rollback == result && task.loop) {
                if (2 <= taskList.length) {
                    var topTask = taskList.pop();
                    topTask.lastTask = task;
                    console.log(creep,"rollback after",task.taskType,"got",topTask.taskType);
                    taskList.unshift(topTask);
                }
            }  else  if (result == this.Result.Finished || result == this.Result.Failed) {
              //  if (taskList.length > 1) {
              //      taskList[1].lastTask = task;
             //   }
                var doneTask = taskList.shift();
                if (task.loop) {
                    taskList.push(doneTask);
                }
            }
            //console.log("end while result", result, "len", taskList.length, "actionCount", actionCount);
           // return;
        } //while

        if (result == this.Result.Unfinished) {

        } else if (0 == taskList.length) {
            emptyTaskList(creep);
        }
       // console.log(creep,"finsihed doTasks");
    },
    
    showTasks: function (creep) {
        var taskList = creep.memory.tasks.tasklist;
        for ( var i in taskList)  {
            console.log(creep,"task",i,"is", JSON.stringify(taskList[i]));
        }
    },


    pickUpLooseEnergy: function(creep){
        var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if(target) {
            creep.pickup(target)
        }
    },
    
    unshiftTask: function (creep,task) {
        creep.memory.tasks.tasklist.unshift(task);
    },

    getTargetId: function (creep) {
        return creep.memory.tasks.targetId;
    },
    
    setTargetId: function (creep, targetId) {
       // console.log("Changed target id from", creep.memory.tasks.targetId, "to", targetId);
        creep.memory.tasks.targetId = targetId;
    },


    emptyTaskList: function(creep) {

    }

}

module.exports = tasks;












































