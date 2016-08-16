/**
 * Created by Piers on 05/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Task base object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var gf = require("gc");
var TaskActions = require("task.actions");
var roleRepairer = require("role.repairer");
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
        Unfinished: gc.RESULT_UNFINISHED,
        //Failed: gc.RESULT_FAILED,
        Rollback: gc.RESULT_ROLLBACK,
        Reset: gc.RESULT_RESET
    },
    
    //MAX_TASK_ACTIONS: gc.MAX_TASK_ACTIONS,
    
    
    doTasks: function(creep) {
        var taskList = creep.memory.tasks.tasklist;
        result = this.Result.Finished;
        var doneActions = new TaskActions(gc.CREEP);
        var actionCount = 0;
        while ((result == this.Result.Finished || result == this.Result.Rollback)
                            && taskList.length > 0 && actionCount++ < gc.MAX_TASK_ACTIONS) {
            var task = taskList[0];
            while (task !== undefined && task === null) {
                taskList.shift();
                task = taskList[0];
            }
            if (undefined ===  task.taskType) {
                return;
            }

            if (task.pickup) {
                this.pickUpLooseEnergy(creep);
                doneActions.actions.add(gc.PICKUP);
            }
            if (creep.getActiveBodyparts(HEAL) > 0) {
                this.heal(creep);
            }

          //  if (creep.name == "Jack")
          //      console.log(creep ,"about to do task", task.taskType,"Length of task list is", taskList.length);
           // creep.say(task.taskType);

            var result;
            if (!TaskActions.prototype.isConflict(doneActions, task.conflicts)) {
                if (task.taskType == "task.switch.role") return;
                var moduleName = "task." + task.taskType;
                var taskModule = require(moduleName);
                result = taskModule.prototype.doTask(creep, task, doneActions);

              //  if (creep.name == "Jack")
              //     console.log(creep, "done", task.taskType,"Task, return", result);

                if (this.Result.Finished == result) {
                    doneActions.actions.add(task.conflicts);
                }
            } else {
          //      console.log(creep,"conflict found",task.conflicts);
                result = this.Result.Unfinished;
            }
            if (this.Result.RESULT_RESET == result) {
                taskList = creep.memory.tasks.tasklist;
            }

            if (this.Result.Rollback == result && task.loop) {
                if (2 <= taskList.length) {
                    var topTask = taskList.pop();
                    topTask.lastTask = task;
             //       console.log(creep,"rollback after",task.taskType,"got",topTask.taskType);
                    taskList.unshift(topTask);
                } else {
           //         console.log(creep,"trying to rollback on too short tasklist");
                }
            }  else  {
             //   console.log(creep,"check finresult", result,"this.Result.Finished"
             //       ,this.Result.Finished,"this.Result.Finished" ,this.Result.Failed);
                if (result == this.Result.Finished
                    || result == this.Result.Reset) {
                    if (taskList.length > 0){
                        var doneTask = taskList.shift();
                        if (task.loop) {
                            taskList.push(doneTask);
                        }
                    }
                }
            }
        //    console.log("end while result", result, "tasklist length", taskList.length
        //        , "actionCount", actionCount);
          //  return;
        } //while

        if (creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES))

        if (result == this.Result.Unfinished) {

        } else if (0 == taskList.length) {
            this.emptyTaskList(creep);
        }
   //     console.log(creep,"finsihed doTasks tasks left", taskList.length);
    },
    
    showTasks: function (creep) {
        var taskList = creep.memory.tasks.tasklist;
        for ( var i in taskList)  {
            console.log(creep,"task",i,"is", JSON.stringify(taskList[i]));
        }
    },


    pickUpLooseEnergy: function(creep){
        //var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        var target = creep.pos.findInRange(FIND_DROPPED_ENERGY,1)[0];
        if(target) {
         //   console.log(creep,"about ot pick up loose energy",target);
            var rtv = creep.pickup(target);
          //  console.log(creep,"result",rtv);
        }
    },
    
    unshiftTask: function (creep,task) {
        creep.memory.tasks.tasklist.unshift(task);
    },

    getTargetId: function (creep) {
        return creep.memory.tasks.targetId;
    },

    setTargetId: function (creep, targetId) {
       // console.log(creep, " setTargetId in task",targetId, JSON.stringify(targetId));
        if (undefined === targetId) {
            creep.memory.tasks.targetId = undefined
        } else if (typeof targetId == "string") {
            creep.memory.tasks.targetId = targetId;
        } else {
            creep.memory.tasks.targetId = targetId.id;
        }
    },

    heal: function (creep) {
        //if (creep.getActiveBodyparts(HEAL) > 0 && creep.hits < creep.hitsMax)
        //    creep.heal(creep);
        if (creep.getActiveBodyparts(HEAL) > 0) {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            } else {
                var injured = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: function(c) {
                        return c.hits < c.hitsMax && c.pos.inRangeTo(creep,gc.RANGE_HEAL);
                    }
                });
                if (injured) {
                    if (creep.pos.isNearTo(injured))
                        creep.heal(injured);
                    else
                        creep.rangedHeal(injured)
                }
            }
        }
    },

    defensiveRetreat: function (creep, pos, heal) {
        var danger = creep.pos.findInRange(FIND_HOSTILE_CREEPS, gc.RANGE_RANGED_ATTACK+1,{
            filter: function(object) {
                return object.getActiveBodyparts(ATTACK) > 0
                    || object.getActiveBodyparts(RANGED_ATTACK) > 0;
            }
        });
        if (danger.length > 0) {
            //console.log(creep,"defensiveRetreat");
            var direction = creep.pos.getDirectionTo(danger[0]);
            var moveDirection;
            var bestTerrain;
          //  console.log(creep,creep.pos.roomName,"defensiveRetreat enemy direction", direction);
            for ( var i = 0 ; i < gc.OPPOSITE_DIRECTION[direction].length ; i++ ) {

                var x = creep.pos.x + gc.DELTA_DIRECTION[gc.OPPOSITE_DIRECTION[direction][i]].x;
                var y = creep.pos.y + gc.DELTA_DIRECTION[gc.OPPOSITE_DIRECTION[direction][i]].y;
                var  terrain  = Game.map.getTerrainAt(x, y, creep.room.name);
                //console.log(creep,"i",i,"x",x,"y",y,"terrain",terrain);
                if (gc.PLAIN == terrain
                    || (gc.SWAMP == terrain && bestTerrain != gc.PLAIN) ) {
                    moveDirection = gc.OPPOSITE_DIRECTION[direction][i];
                    bestTerrain = terrain;
                }
            }
            if (!moveDirection) {
                for ( var k = 0 ; k < gc.SIDEWAYS_DIRECTION[direction].length ; k++ ) {
                    x = creep.pos.x + gc.DELTA_DIRECTION[gc.SIDEWAYS_DIRECTION[direction][k]].x;
                    y = creep.pos.y + gc.DELTA_DIRECTION[gc.SIDEWAYS_DIRECTION[direction][k]].y;
                    terrain  = Game.map.getTerrainAt(x, y, creep.room.name);
                   // console.log(creep,"k",k,"x",x,"y",y,"terrain",terrain);
                    if (gc.PLAIN == terrain
                        || (gc.SWAMP == terrain && bestTerrain != gc.PLAIN) ) {
                        moveDirection = gc.OPPOSITE_DIRECTION[direction][k];
                        bestTerrain = terrain;
                    }
                }
            }
            if (moveDirection) return creep.move(moveDirection);
        }
        if (pos) return roleRepairer.moveAndRepair(creep,pos);
        else return undefined;
    },

    defensiveMoveTo: function (creep, pos) {
        var result = this.defensiveRetreat(creep, pos);
        if (undefined === result)
            return creep.moveTo(pos);
        else
            return result;
    },

    moveAndAttack: function (creep, pos) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        creep.attack(target);
        creep.rangedAttack(target);
        return creep.moveTo(pos);
    },

    attackClosest(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (creep.pos.isNearTo(target)) {
            var result = creep.attack(target);
            creep.rangedAttack(target);
            console.log(creep,"attack",target,"result,result");
        }
    },

    emptyTaskList: function(creep) {
        console.log(creep,"empty task list");
        creep.say("What to do?")
    }

};

module.exports = tasks;












































