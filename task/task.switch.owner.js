/**
 * Created by Piers on 16/07/2016.
 */
/**
 * Created by Piers on 06/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var tasks = require("tasks");
var roleBase = require("role.base");

/**
 * Task move object. Used when we need to find the object to move to.
 * @module TaskSwitchOwner
 */

function TaskSwitchOwner (newPolicyId, newRoom) {
    this.taskType = gc.TASK_SWITCH_OWNER;
    this.newPolicyId = newPolicyId;
    this.newRoom = newRoom;
}

TaskSwitchOwner.prototype.doTask = function(creep, task) {
    if (undefined !== task.newRoom) {
        if (undefined !== Game.rooms[task.newRoom]) {
            creep.policyId = Game.rooms[task.newRoom].policyId;
            return gc.RESULT_FINISHED;
        }
    }
    creep.policyId = task.newPolicyId;
    if (undefined === role) {
        roleBase.switchRoles(creep,role);
        return gc.RESULT_RESET;
    }
    return gc.RESULT_FINISHED;
};

module.exports = TaskSwitchOwner;

























