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
    this.waitForRespawn = false;
}

TaskHarvest.prototype.doTask = function(creep, task) {
    if (creep.carry.energy == creep.carryCapacity)  {
        tasks.setTargetId(creep, undefined);
        //console.log(creep, "harvest at start RESULT_FINISHED full up")
        return gc.RESULT_FINISHED;
    }
    var source =  Game.getObjectById(tasks.getTargetId(creep));
    if (!source) {
     //   console.log(creep,"Trying to harvest with invalid source", source, "id",tasks.getTargetId(creep));
        if (creep.carry.energy == creep.carryCapacity) {
            console.log(creep, "harvet RESULT_FINISHED full up no source");
            return gc.RESULT_FINISHED;
        }  else {
           /// keep trying to get to source
          //  creep.say("Help source");
            console.log(creep, "harvet RESULT_ROLLBACK no source")
            return gc.RESULT_ROLLBACK;
        }
    }
    var rtv = creep.harvest(source);
    console.log(creep,"TaskHarvest result",rtv);
    switch (rtv) {
        case    OK:                         // 0	The operation has been scheduled successfully.;
           // tasksActions.done(gc.HARVEST);
            if (creep.carry.energy == creep.carryCapacity) {
                tasks.setTargetId(creep, undefined);
                console.log(creep, "harvest RESULT_FINISHED ok full up")
                return gc.RESULT_FINISHED;
            }  else {
                console.log(creep, "harvest RESULT_UNFINISHED ok cary enegy and capacity"
                    ,creep.carry.energy,"capacity",creep.carryCapacity)
                return gc.RESULT_UNFINISHED;
            }
        case    ERR_NOT_ENOUGH_RESOURCES:    //	-6	The target source does not contain any harvestable energy.
            if (creep.carry.energy == 0) {
                console.log(creep, "harvet RESULT_UNFINISHED not eough resouces")
                return gc.RESULT_UNFINISHED;
            }  else {
                console.log(creep, "harvet RESULT_FINISHED full up not eough resouces")
                if (creep.carry.energy == creep.carryCapacity || !this.waitForRespawn) {
                    tasks.setTargetId(creep, undefined);
                    return gc.RESULT_FINISHED;                
                } else {
                    return gc.RESULT_UNFINISHED;
                }

            }
        case    ERR_NOT_IN_RANGE:           //	-9	The target is too far away.
        case    ERR_NOT_FOUND:               //	-5	Extractor not found. You must build an extractor structure to
                                                // harvest minerals. Learn more
        case    ERR_INVALID_TARGET:         //	-7	The target is not a valid source object.
            return gc.RESULT_FINISHED;
        case    ERR_NOT_OWNER:              //	-1	You are not the owner of this creep, or the room controller is
                                            // owned or reserved by another player.
        case    ERR_BUSY:                    //	-4	The creep is still being spawned.
        case    ERR_NO_BODYPART:	        // -12	There are no WORK body parts in this creep’s body.
                                          //   console.log("failed harvest with some other error");
        default:
           // console.log("Something wrong harvest error");
            return gc.RESULT_FINISHED;

    }
    console.log("End of taskharves do not sue how got here");
};



module.exports = TaskHarvest;



















