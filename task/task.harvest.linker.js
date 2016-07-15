/**
 * Created by Piers on 07/07/2016.
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


function TaskHarvestLinker (sourceId, homeLinkId, targetLinkId) {
    this.taskType = gc.TASK_HARVEST_LINK;
    this.conflicts = gc.HARVEST;
    this.sourceId = sourceId;
    this.homeLinkId = homeLinkId;
    this.targetLinkId = targetLinkId;
    this.pickup = true;
    this.loop = true;
}

TaskHarvestLinker.prototype.doTask = function(creep, task) {
    //console.log(creep,"TaskHarvestLinker")
    var source =  Game.getObjectById(task.sourceId);
    if (!source) {
      //  console.log(creep,"no source")
      //  creep.say("help source");
        return gc.RESULT_FINISHED;
    }
    creep.harvest(source)

    var sourceLink = Game.getObjectById(task.homeLinkId);
    if (!sourceLink) {
    /////    console.log(creep,"no from link")
     //   creep.say("help link");
        return gc.RESULT_FINISHED;
    }

    var rtv = creep.transfer(sourceLink, RESOURCE_ENERGY);
  //  console.log(creep,"TaskHarvestLinker result  to  linkn",rtv);
    if (undefined !== task.targetLinkId){
        var targetLink = Game.getObjectById(task.targetLinkId);
        if (!targetLink) {
          //  console.log(creep,"no to link")
          //  creep.say("help link");
            return gc.RESULT_UNFINISHED;
        }
        var result = sourceLink.transferEnergy(targetLink);
      //  console.log(creep,"TaskHarvestLinker result link to link",result);
    }

    return gc.RESULT_UNFINISHED;
};

module.exports = TaskHarvestLinker;



















