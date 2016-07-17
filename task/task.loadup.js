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
 //   console.log(creep,"task loadup")
    var storage =  Game.getObjectById(tasks.getTargetId(creep));
  //  console.log(creep,"TaskLoadUp, storage",storage,"targetId",tasks.getTargetId(creep));
    if (!storage) {
      //  console.log(creep,"Cant find storage");
        tasks.setTargetId(creep,undefined);
      //  creep.say("help storage");
        return gc.RESULT_ROLLBACK;
    } else {
        //storage.transfer(creep, task.resourceId);
        var result = creep.withdraw(storage,task.resourceId);
  //     console.log(creep, "result of withrewal storage", storage, task.resourceId, "result",result);
        switch (result) {
            case OK:                //	0	The operation has been scheduled successfully.
                if (creep.carry.energy == 0) {
                    return gc.RESULT_UNFINISHED;
                } else {
                    tasks.setTargetId(creep, undefined);
                    return gc.RESULT_FINISHED;
                }
            case ERR_NOT_ENOUGH_RESOURCES:  //	-6	The target does not have the given amount of resources.
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
            case ERR_FULL:                   //	-8	The creep's carry is full.
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
            case ERR_NOT_IN_RANGE:          //-9	The target is too far away.
                return gc.RESULT_ROLLBACK;
            case ERR_NOT_OWNER:           //	-1	You are not the owner of this creep, or there is a hostile rampart on top of the target.
            case ERR_BUSY:                   //	-4	The creep is still being spawned.
            case ERR_INVALID_TARGET:         //	-7	The target is not a valid object which can contain the specified resource.
            case ERR_INVALID_ARGS:           //-10	The resource amount or type is incorrect.
            default:
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
        }
    }
};

module.exports = TaskLoadup;



































