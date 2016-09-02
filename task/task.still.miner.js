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


function TaskHarvest (mineralId) {
    this.taskType = gc.TASK_HARVEST;
    this.conflicts = gc.HARVEST;
    this.mineralId = mineralId;
    this.pickup = true;
    this.loop = true;
}

TaskHarvest.prototype.doTask = function(creep, task, tasksActions) {
    var minieral =  Game.getObjectById(mineralId);
    if (!minieral) {
        creep.say("help source");
        return gc.RESULT_FAILED;
    }
    creep.harvest(minieral);
    return gc.RESULT_UNFINISHED;
};



module.exports = TaskHarvest;/**
 * Created by Piers on 07/07/2016.
 */
