/**
 * Created by Piers on 22/08/2016.
 */
/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var TaskFollow = require("task.follow")
/**
 * Task harvest object.
 * @module roleFollow
 */

var roleFollow = {

    getTaskList: function(creep, target, customMoveToFunction, functionModule ) {
        if (!target) return {};
        var taskList = [];
        var follow = new TaskFollow(target.id, customMoveToFunction, functionModule ) ;
        taskList.push(follow);
        return taskList;
    }

};

module.exports = roleFollow;
