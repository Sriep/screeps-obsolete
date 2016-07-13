/**
 * Created by Piers on 12/07/2016.
 */
/**
 * Created by Piers on 05/07/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var gc = require("gc");

/**
 * Task harvest object.
 * @module tasksHarvest
 */


function TaskAttackTarget (findTargetFunction, moduelName) {
    this.taskType = gc.TASK_ATTACK_TARGET;
    this.conflicts = gc.ATTACK;
    this.moduelName = moduelName
    this.findTarget = findTargetFunction;
    if (undefined == this.findTarget) {
        this.findTarget = function(creep) {
            return creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        };
    }
    //console.log(TaskAttackTarget,"in TaskAttackTarget",this.findTarget);
    this.pickup = false;
    this.loop = true;
}

TaskAttackTarget.prototype.doTask = function(creep, task) {
    console.log(creep,"TaskAttackTarget task.findTarget", task.findTarget);
    
    var target;
    if (module != undefined) {
        module = require(task.moduelName);
        if (typeof module[task.findTarget] != "function")
            target =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        else
            target =  module[task.findTarget] (creep);
    } else {
        target =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }

    if (!target)
        return gc.RESULT_UNFINISHED;
    switch (creep.attack(target))
    {
        case OK:	//0	The operation has been scheduled successfully.
            return gc.RESULT_UNFINISHED; // THUMP! take that!
        case ERR_NOT_IN_RANGE:	//-9	The target is too far away.
            return gc.RESULT_FINISHED; // Probably run away, coward!
        case ERR_INVALID_TARGET:	//-7	The target is not a valid attackable object.
            this.loop = false;
            return gc.RESULT_FINISHED; // Probably I killed it. Hurrah!
        case ERR_NOT_OWNER:	//-1	You are not the owner of this creep.
        case ERR_BUSY:	//-4	The creep is still being spawned.
        case ERR_NO_BODYPART:	//-12	There are no ATTACK body parts in this creep’s body.
        default:
            return gc.RESULT_ROLLBACK; // Huh!
    }
};



module.exports = TaskAttackTarget;



















