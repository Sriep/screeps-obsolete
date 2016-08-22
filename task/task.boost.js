/**
 * Created by Piers on 22/08/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var tasks = require("tasks");
/**
 * Task harvest object.
 * @module TaskBoost
 */

function TaskBoost (labId, amount, resource) {
    this.taskType = gc.TASK_BOOST;
    this.conflicts = undefined;
    this.labId = labId;
    this.amount = amount;
    this.resource = resource;
    this.pickup = false;
    this.loop = true;
}

TaskBoost.prototype.doTask = function(creep, task) {
    var lab = Game.getObjectById(task.labId);

    if (task.resource && lab.resourceType
        && lab.resourceType != task.resource)
        return gc.RESULT_FINISHED;

    var result = lab.boostCreep(creep, task.amount);
    creep.say("result");
    console.log(creep,"result of boost",result,"lab mineral",lab.mineralType);
    switch (result) {
        case OK:                        //	0	The operation has been scheduled successfully.
            return gc.RESULT_FINISHED;
        case ERR_NOT_OWNER:	            // -1	You are not the owner of this lab.
        case ERR_NOT_FOUND:	            // -5	The mineral containing in the lab cannot boost any of the creep's body parts.
        case ERR_INVALID_TARGET:	    // -7	The targets is not valid creep object.
            return gc.RESULT_FINISHED;
        case ERR_NOT_ENOUGH_RESOURCES:	// -6	The lab does not have enough energy or minerals.
            return gc.RESULT_UNFINISHED;
        case ERR_NOT_IN_RANGE:	        // -9	The targets are too far away.
            return gc.RESULT_ROLLBACK;
    }

    return gc.RESULT_FINISHED;
};



module.exports = TaskBoost;