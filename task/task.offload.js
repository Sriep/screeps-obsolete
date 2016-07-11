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
    this.taskType = gc.TASK_OFFLOAD;
    this.conflicts = offloadMethod;
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
    var tasks = require("tasks");
  //  console.log(creep,"In task Offload target id", tasks.getTargetId(creep));

    if (creep.carry[task.resource] == 0) {
      //  console.log("tried Offloading witih no enrgy");
        tasks.setTargetId(creep, undefined);
        return tasks.Result.Finished;
    }

    var target = Game.getObjectById(tasks.getTargetId(creep));
    if (!target) {
        console.log(creep,"Offload, No target Id found",task.offloadMethod);
        tasks.setTargetId(creep, undefined);
        if (creep.carry.energy == 0)
            return gc.RESULT_FINISHED;
        else {
            switch (task.offloadMethod) {
                case gc.BUILD:
                case gc.REPAIR:
                case gc.TRANSFER:
                //    console.log(creep, "rolllback first switch");
                //    creep.say("no target");
                    return gc.RESULT_FINISHED;
                  //  return gc.RESULT_ROLLBACK;
                case gc.UPGRADE_CONTROLLER:
                case gc.DROP:
                default:
                    return gc.RESULT_FINISHED;
            }
        }
    }

    switch ( stats[task.offloadMethod](creep, target, task.resource, task.amount)) {
        case OK:
            if (creep.carry.energy == 0
                || task.offlaodType == gc.DROP
                || task.offlaodType == gc.TRANSFER ) {

           //     console.log(creep,"offloaded all energy - FINSIHED",task.offloadMethod);
           //     creep.say("empty");
                tasks.setTargetId(creep, undefined);
                return gc.RESULT_FINISHED;
            }
            else {
                switch (task.offloadMethod) {
                    case gc.BUILD:
                        if (Game.getObjectById(target.id)) {
                   //         creep.say("build same");
                           // console.log(creep, "Build object still three, result unfinished");
                            return gc.RESULT_UNFINISHED;                          
                        }
                    case gc.REPAIR:
                    case gc.TRANSFER:
                        tasks.setTargetId(creep, undefined);
                  //      creep.say("next target");
                        ///  console.log("Built object need rollback for nest siet");
                        return gc.RESULT_ROLLBACK;
                    case gc.UPGRADE_CONTROLLER:
                   //     creep.say("upgrade");
                        return gc.RESULT_UNFINISHED;
                    case gc.DROP:
                    default:
                        tasks.setTargetId(creep, undefined);
                        return gc.RESULT_FINISHED;
                }
            }
            break;
        case ERR_FULL:
            tasks.setTargetId(creep, undefined);
            if (creep.carry.energy == 0)     {
            //    console.log(creep,"offloaded all energy - FINSIHED");
             //  creep.say("empty");
                return gc.RESULT_FINISHED;
            } else {
              //     creep.say("built");
            //    console.log("transfer full go somewere else");
                return gc.RESULT_ROLLBACK;
            }
        case ERR_NOT_IN_RANGE:
        case ERR_NOT_OWNER:
        case ERR_BUSY:
        case ERR_NOT_ENOUGH_RESOURCES:
        case ERR_INVALID_TARGET:
        case ERR_NO_BODYPART:
        case ERR_RCL_NOT_ENOUGH:
        case ERR_INVALID_ARGS:
         //   console.log(creep,"Offload, some other error unfinished");
            tasks.setTargetId(creep, undefined);
            return gc.RESULT_UNFINISHED;
    }
};






module.exports = TaskOffload;
/**
 * Created by Piers on 05/07/2016.
 */
































