/**
 * Created by Piers on 09/08/2016.
 */
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

function TaskSuppressKeepers () {
    this.taskType = gc.TASK_SUPPRESS_KEEPERS;
    this.conflicts = gc.ATTACK;
    this.pickup = false;
    this.loop = true;
}

TaskSuppressKeepers.prototype.doTask = function(creep, task) {
    if (creep.hits < creep.hitsMax)
        creep.heal(creep);
    else {
        var injured = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if (creep.pos.getRangeTo(injured) < gc.KEEPER_SUPPRESSOR_HEAL_RANGE) {
            creep.moveTo(injured);
            creep.heal(injured);
        }

    }

    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    //console.log(creep,"TaskSuppressKeepers", target);
    if (target) {
        creep.moveTo(target);
        creep.attack(target);
    } else {
        var lairs = creep.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_KEEPER_LAIR }
        });
        if (!lairs || lairs.length == 0) return gc.RESULT_FINISHED;
        lairs.sort( function(l1,l2) { return l1.ticksToSpawn - l2.ticksToSpawn; });
        var result = creep.moveTo(lairs[0]);
        //console.log(creep,"TaskSuppressKeepers result",result,"lairs0",lairs[0]);
    }
    return gc.RESULT_UNFINISHED;
};



module.exports = TaskSuppressKeepers;




















