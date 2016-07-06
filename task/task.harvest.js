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
    this.type = gc.HARVEST;
    this.pickup = true;
    this.loop = true;
}

TaskHarvest.prototype.doTask = function(creep, task, actions) {
    console.log(creep,"In TaskHarvest");
    if (actions.isConflict(TaskActions.Creep.Harvest))
        return tasks.Result.Unfinished;
    if (creep.carry.energy == creep.carryCapacity)  {
        return task.Result.Finished;
    }
    var source =  Game.getObjectById(tasks.getTargetId(creep));
    switch (creep.harvest(source)) {
        case    OK:                         // 0	The operation has been scheduled successfully.
            actions.done(TaskActions.Creep.Harvest);
            if (creep.carry.energy == creep.carryCapacity)
                return Task.Result.Finished;
            else
                return tasks.Result.Unfinished;
        case    ERR_NOT_IN_RANGE:           //	-9	The target is too far away.
            var nextTask = new TaskMoveFind(TaskMoveFind.FindMethod.FindType, FIND_SOURCES,1);
            task.nextTask = nextTask;
            return Task.Result.Finished;           
            
        case    ERR_NOT_OWNER:              //	-1	You are not the owner of this creep, or the room controller is
                                            // owned or reserved by another player.
        case    ERR_BUSY:                    //	-4	The creep is still being spawned.
        case    ERR_NOT_FOUND:               //	-5	Extractor not found. You must build an extractor structure to
        // harvest minerals. Learn more
        case    ERR_NOT_ENOUGH_RESOURCES:    //	-6	The target source does not contain any harvestable energy.
        case    ERR_INVALID_TARGET:         //	-7	The target is not a valid source object.

        case    ERR_NO_BODYPART:	        // -12	There are no WORK body parts in this creep’s body.
            return Task.Result.Failed;
    }
};



module.exports = TaskHarvest;



















