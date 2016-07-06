/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task offload object.
 * @author Piers Shepperson
 */
var gc = require("gc");
//var taskActions = require("task.actions")
var tasks = require("tasks");
var stats = require("stats");

/**
 * Task base object.
 * @module tasksHarvest
 */

function TaskOffload (offloadMethod, resource,  amount) {
    this.task = gc.OFFLOAD;
    this.offloadMethod = offloadMethod;
    if (offloadMethod == TaskOffload.Build
        || offloadMethod == TaskOffload.Repair
        || offloadMethod == TaskOffload.Upgrade)
    {
        this.resource = RESOURCE_ENERGY;
        this.ammount = undefined;
    } else {
        this.resource = resource;
        this.ammount = amount;
    }
    this.loop = true;
    this.pickup = true;
}

TaskOffload.prototype.offloadMethod = {
    Build: "build",
    Drop: "drop",
    Repair: "repair",
    Transfer: "transfer",
    Upgrade: "upgrade"
};

TaskOffload.prototype.doTask = function(creep, task, actions) {
    console.log(creep,"In TaskOffload");
    var tasks = require("tasks");
    if (actions.isConflict(task.offloadMethod))
        return tasks.Result.Unfinished;
    if (creep.carry[task.resource] == 0)
        return tasks.Result.Finished;
    var target =  Game.getObjectById(tasks.getTargetId(creep));
    switch ( stats[task.offloadMethod](creep, target, task.resource, task.amount)) {
        case OK:
            actions.done(taskAcations.Creep[task.offloadMethod]);
            if (creep.carry.energy == 0
                || task.offlaodType == TaskOfflaod.Drop
                || task.offlaodType == TaskOfflaod.Transfer ) {
                return Task.Result.Finished;
            }
            else {
                // Check to see if target object still exists, if not we are finished.
                // For  when building and object changes from construction site to built object.
                if (null == Game.getObjectById(tasks.getTargetId(creep)))
                {
                    return tasks.Result.Finished;
                } else
                    return tasks.Result.Unfinished;
            }
        case ERR_NOT_IN_RANGE:
            task.nextTask = lastTask;
            return Task.Result.Failed;
        case ERR_NOT_OWNER:
        case ERR_BUSY:
        case ERR_NOT_ENOUGH_RESOURCES:
        case ERR_INVALID_TARGET:
        case ERR_FULL:
        case ERR_NO_BODYPART:
        case ERR_RCL_NOT_ENOUGH:
        case ERR_INVALID_ARGS:
            return tasks.Result.Failed;
    }
};






module.exports = TaskOffload;
/**
 * Created by Piers on 05/07/2016.
 */
































