/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Task to transfer resouce to creep
 * @author Piers Shepperson
 */
var gc = require("gc");
var tasks = require("tasks");
/**
 * Abstract  Race of creeps that transport energy around.
 * units.
 * @module TaskLoadup
 */


function TaskLoadup (resourceId) {
    this.taskType = gc.TASK_LOADUP;
    this.conflicts = gc.TRANSFER;
    this.resourceId = resourceId;
    this.pickup = true;
    this.loop = true;
}

TaskLoadup.prototype.doTask = function(creep, task) {
    var storage =  Game.getObjectById(tasks.getTargetId(creep));
    if (!storage) {
      //  console.log(creep,"Cant find storage");
      //  creep.say("help storage");
        return gc.RESULT_ROLLBACK;
    } else {
        storage.transfer(creep, task.resourceId);
        if (creep.carry.energy == 0) {
            return gc.RESULT_UNFINISHED;
        } else {
            tasks.setTargetId(creep, undefined);
            return gc.RESULT_FINISHED;
        }
    }
};

module.exports = TaskLoadup;



































