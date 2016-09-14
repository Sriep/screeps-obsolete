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

function TaskSwitchRole (role, parameters, switchCondition, module) {
    this.taskType = gc.TASK_SWITCH_ROLE;
    this.role = role;
    this.parameters = parameters ? parameters : [];
    this.switchCondition = switchCondition;
    this.module = module;
    this.loop = true;
}

TaskSwitchRole.prototype.doTask = function(creep, task) {
    //console.log(creep,"TaskSwitchRole");
    var switchNow = true;
    if (task.module && task.switchCondition) {
        var module = require(task.module);
        switchNow = module[task.switchCondition](creep);
    } else if (!task.module && task.switchCondition) {
        switchNow = task.switchCondition(creep);
    }

    if (switchNow)
    {
        roleBase.switchRolesA(
            creep,
            task.role,
            task.parameters
        );
        creep.memory.InTaskSwitchRoleRoleIS = task.role;
        creep.memory.InTaskSwitchRoleParametersARE = task.parameters;
        return gc.RESULT_RESET
    } else {
        return gc.RESULT_FINISHED;
    }

};

module.exports = TaskSwitchRole;
