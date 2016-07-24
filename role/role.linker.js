/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var TaskMoveRoom = require("task.move.room");
var TaskFlexiLink = require("task.flexi.link");
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module roleLinker
 */

var roleLinker = {

        getTaskList: function(creep, flagName) {
            var TaskFindMoveLinkerPos = require("task.find.move.linker.pos");
            console.log(creep,"In roleLinker getTaskList",flagName);
            var flag = Game.flags[flagName];
            console.log(creep,flagName,"getTaskList flag",flag);
            var taskList = [];
            var moveToRoom = new TaskMoveRoom(flag.pos.roomName);
            moveToRoom.loop = false;
            var findAndMoveLinkPos = new TaskFindMoveLinkerPos(flagName);
            var flexiLink = new TaskFlexiLink(flagName);

            taskList.push(moveToRoom);
            taskList.push(findAndMoveLinkPos);
            taskList.push(flexiLink);
            return taskList;
        }
};

module.exports = roleLinker;