/**
 * Created by Piers on 08/08/2016.
 */
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
 * @module TaskSwitchRole
 */

function TaskSwitchRole (role, parameters) {
    this.taskType = gc.TASK_SWITCH_ROLE;
    this.role = role;
    this.parameters = parameters ? parameters : [];
}

TaskSwitchRole.prototype.doTask = function(creep, task) {
    console.log(creep,"TaskSwitchRole");
    roleBase.switchRoles(
        creep,
        task.role,
        task.parameters[0],
        task.parameters[1],
        task.parameters[2],
        task.parameters[3],
        task.parameters[4],
        task.parameters[5],
        task.parameters[6],
        task.parameters[7],
        task.parameters[8],
        task.parameters[9]
    );
    return gc.RESULT_RESET
};

module.exports = TaskSwitchRole;
