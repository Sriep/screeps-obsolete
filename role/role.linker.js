/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var TaskMoveRoom = require("task.move.room");
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module roleLinker
 */

var roleLinker = {


        getTaskList: function(creep, flagName) {
            var flag = Game.flags[flagName];
            var taskList = [];
            var moveToRoom = new TaskMoveRoom(flag.pos.roomName);
            var findAndMoveLinkPos = new TaskFindMoveLinkerPos(flagName);
            var flexiLink = new TaskFlexiLink(flagName);

            taskList.push(moveToRoom);
            taskList.push(findAndMoveLinkPos);
            taskList.push(flexiLink);
            return taskList;
        },


};

module.exports = roleLinker;