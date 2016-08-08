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

function TaskSwitchRole (role,para1,para2,para3,para4,para5,para6,para7,para8,para9,para10) {
    this.taskType = gc.TASK_SWITCH_ROLE;
    this.role = role;
    this.para1 = para1;
    this.para2 = para2;
    this.para3 = para3;
    this.para4 = para4;
}

TaskSwitchRole.prototype.doTask = function(creep, task) {
    roleBase.switchRoles(creep, task.role,task.para1, task.para2,task.para3,task.para4,task.para4);
    return gc.RESULT_RESET
};

module.exports = TaskSwitchRole;
