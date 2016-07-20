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
 * @module TaskHeal
 */

function TaskHeal () {
    this.taskType = gc.TASK_HEAL;
    this.conflicts = gc.HEAL;
    this.pickup = false;
    this.loop = true;
}

TaskHeal.prototype.doTask = function(creep, task) {
    var target;
    target = tasks.getTargetId(creep);
    if (!target) {
        target = creep.pos.findInRange(FIND_MY_CREEPS, gc.RANGE_HEAL, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.hits < creep.hitsMax
        });
    }
    if (target)
        creep.heal(target);
    return gc.RESULT_FINISHED;
};



module.exports = TaskHeal;















