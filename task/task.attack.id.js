/**
 * Created by Piers on 12/07/2016.
 */
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
var tasks = require("tasks");
/**
 * Task harvest object.
 * @module tasksHarvest
 */

function TaskAttackId (targetId) {
    this.taskType = gc.TASK_ATTACK_ID;
    this.conflicts = gc.ATTACK;
    this.targetId = targetId;
    this.pickup = false;
    this.loop = true;
}

TaskAttackId.prototype.doTask = function(creep, task) {
    //console.log(creep,"InAttackID target", tasks.getTargetId(creep));
    var target;
    if (undefined === task.targetId) {
        target = tasks.getTargetId(creep);
    } else {
        target = Game.getObjectById(task.targetId);
    }
    creep.rangedAttack(target);
    var result = creep.attack(target);
   // console.log(creep,"at",creep.pos,"attack",tasks.getTargetId(creep),"result",result);
    switch (result)
    {
        case OK:	//0	The operation has been scheduled successfully.
            creep.say("Thump!");
            return gc.RESULT_UNFINISHED; // THUMP! take that!
        case ERR_NOT_IN_RANGE:	//-9	The target is too far away.
            creep.say("coward");
            return gc.RESULT_ROLLBACK; // Move closer.
        case ERR_INVALID_TARGET:	//-7	The target is not a valid attackable object.
            this.loop = false;
            tasks.setTargetId(creep, undefined);
            creep.say("Gotya!");
            return gc.RESULT_FINISHED; // Probably I killed it. Hurrah!
        case ERR_NOT_OWNER:	//-1	You are not the owner of this creep.
        case ERR_BUSY:	//-4	The creep is still being spawned.
        case ERR_NO_BODYPART:	//-12	There are no ATTACK body parts in this creep’s body.
        default:
            creep.say("Huh!");
            return gc.RESULT_FINISHED; //  Huh! Whats up!
    }
};



module.exports = TaskAttackId;




















