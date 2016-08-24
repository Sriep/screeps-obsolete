/**
 * Created by Piers on 23/08/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var TaskMoveFind = require("task.move.find");
var TaskBoost = require("task.boost");
var TaskSwitchRole = require("task.switch.role");
var gc = require("gc");
/**
 * Task harvest object.
 * @module roleBoostAndSwitch
 */

var roleBoostAndSwitch = {

    getTaskList: function(creep, labIds, role, roleParameters) {
        var taskList = [];
        if (labIds) {
            for ( var i = 0 ; i < labIds.length ; i++ ) {
                var moveToLab = new TaskMoveFind(gc.FIND_ID, 1, labIds[i]);
                var boost = new TaskBoost(labIds[i]);
                taskList.push(moveToLab);
                taskList.push(boost);
            }
        }
        if (role) {
            var switchRole = new TaskSwitchRole(role, roleParameters);
            taskList.push(switchRole);
        }
        return taskList;
    }
};

module.exports = roleBoostAndSwitch;