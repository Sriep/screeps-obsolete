/**
 * Created by Piers on 17/07/2016.
 */
/**
 * Created by Piers on 17/07/2016.
 */
/**
 * Created by Piers on 16/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * @fileOverview Screeps module. Task move object.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var stats = require("stats");
var roleBase = require("role.base");
var TaskMoveFind = require("task.move.find");
var TaskMoveRoom = require("task.move.room");
var TaskActionTarget = require("task.action.target");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RouteRemoteActions  (room, remoteActions, body, respawnRate) {
    this.type = gc.ROUTE_REMOTE_ACTIONS;
    this.owner = room;
    this.remoteActions = remoteActions;
    this.body = body
    this.respawnRate =respawnRate;
    if (undefined === respawnRate) {
        this.respawnRate = CREEP_LIFE_TIME;
    }
    this.due = 0;
}

RouteRemoteActions.prototype.spawn = function (build, spawn) {
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning",name);
        Game.creeps[name].memory.tasks = {};
        Game.creeps[name].memory.tasks.targetId = undefined;
        Game.creeps[name].memory.tasks.state = undefined;
        Game.creeps[name].memory.tasks.tasklist
            = RouteRemoteActions.prototype.getTaskList(Game.creeps[name], build.remoteActions);
    }
    return name;
};

RouteRemoteActions.prototype.getTaskList = function(creep, remoteActions) {
    var taskList = [];
    var moveToRoom, moveFindTarget, actOnTarget;
    for (var i = 0 ; i < remoteActions.length ; i++ ) {
        moveToRoom = new TaskMoveRoom(remoteActions.room[i]);
        moveFindTarget =  new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
            , remoteActions.findFunction[i],remoteActions.findFunctionsModule);
        actOnTarget = new TaskActionTarget(remoteActions[i].action);

        taskList.push(moveToRoom);
        taskList.push(moveFindTarget);
        taskList.push(actOnTarget);
    }
    return taskList;
}


/*
function RoutePatrolRoom.prototype.ActionList(room,action, findFunction, findFunctionsModule)   {
    this.room = room;
    this.action = action;
    this.findFunction = findFunction;
    this.findFunctionsModule = findFunctionsModule;
}*/

module.exports = RouteRemoteActions;


























