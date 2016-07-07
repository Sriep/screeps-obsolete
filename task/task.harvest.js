/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var TaskActions = require("task.actions");
var tasks = require("tasks");
var TaskMoveFind = require("task.move.find");

/**
 * Task harvest object.
 * @module tasksHarvest
 */


function TaskHarvest () {
    this.taskType = gc.TASK_HARVEST;
    this.conflicts = gc.HARVEST;
    this.pickup = true;
    this.loop = true;
}

TaskHarvest.prototype.doTask = function(creep, task, tasksActions) {
    if (creep.carry.energy == creep.carryCapacity)  {
        tasks.setTargetId(creep, undefined);
        return gc.RESULT_FINISHED;
    }
    var source =  Game.getObjectById(tasks.getTargetId(creep));
    if (!source) {
        console.log(creep,"Trying to harvest with invalid source", source, "id",tasks.getTargetId(creep));
        if (creep.carry.energy == creep.carryCapacity)
            return gc.RESULT_FINISHED;
        else {
           // task.nextTask = task.lastTask;
            return gc.RESULT_FAILED;
        }
    }

    switch (creep.harvest(source)) {
        case    OK:                         // 0	The operation has been scheduled successfully.;
           // tasksActions.done(gc.HARVEST);
            if (creep.carry.energy == creep.carryCapacity) {
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
            }  else
                return gc.RESULT_UNFINSHED;

        case    ERR_NOT_ENOUGH_RESOURCES:    //	-6	The target source does not contain any harvestable energy.
            if (creep.carry.energy == 0) {
                return gc.RESULT_UNFINSHED;
            }  else {
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
            }

        case    ERR_NOT_IN_RANGE:           //	-9	The target is too far away.
        case    ERR_NOT_OWNER:              //	-1	You are not the owner of this creep, or the room controller is
                                            // owned or reserved by another player.
        case    ERR_BUSY:                    //	-4	The creep is still being spawned.
        case    ERR_NOT_FOUND:               //	-5	Extractor not found. You must build an extractor structure to
                                                // harvest minerals. Learn more
        case    ERR_INVALID_TARGET:         //	-7	The target is not a valid source object.
        case    ERR_NO_BODYPART:	        // -12	There are no WORK body parts in this creep’s body.
                                          //   console.log("failed harvest with some other error");
            return gc.RESULT_FAILED;
    }
    console.log("End of taskharves do not sue how got here");
};



module.exports = TaskHarvest;



















