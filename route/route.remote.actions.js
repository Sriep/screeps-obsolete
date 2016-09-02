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
var TaskMoveFind = require("task.move.find");
var TaskMoveRoom = require("task.move.room");
var TaskActionTarget = require("task.action.target");
var raceClaimer = require("race.claimer");
var raceBase = require("race.base");
/**
 * Task move object. Used when we need to find the object to move to.
 * @module NeutralHarvestRoute
 */

function  RouteRemoteActions  (remoteActions, body, respawnRate, policyId, reference) {
    this.type = gc.ROUTE_REMOTE_ACTIONS;
    //this.owner = room;
    if (Array.isArray(remoteActions)) {
        this.remoteActions = remoteActions;
    } else {
        this.remoteActions = [];
        this.remoteActions.push(remoteActions)
    }
    this.body = body;
    this.policyId = policyId;
    this.respawnRate =respawnRate;
    if (undefined === respawnRate) {
        this.respawnRate = CREEP_LIFE_TIME;
    }
    this.due = 0;
    this.reference = reference;
}

RouteRemoteActions.prototype.spawn = function (build, spawn) {
   // console.log("trying to spawn RouteRemoteActions");
    var name = stats.createCreep(spawn, build.body, undefined, undefined);
    if (_.isString(name)) {
        console.log("Spawning",name);
        Game.creeps[name].memory.tasks = {};
        Game.creeps[name].memory.tasks.targetId = undefined;
        Game.creeps[name].memory.tasks.state = undefined;
        Game.creeps[name].memory.tasks.tasklist
            = RouteRemoteActions.prototype.getTaskList(build.remoteActions);
        Game.creeps[name].memory.policy = build.policyId;
        Game.creeps[name].memory.buildReference = build.reference;
    }
    return name;
};

RouteRemoteActions.prototype.getTaskList = function(remoteActions) {
    var taskList = [];
    var moveToRoom, moveFindTarget, actOnTarget;
    for (var i = 0 ; i < remoteActions.length ; i++ ) {
        moveToRoom = new TaskMoveRoom(remoteActions[i].room);
        moveFindTarget =  new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
            , remoteActions[i].findFunction,remoteActions[i].findFunctionsModule);
        actOnTarget = new TaskActionTarget(remoteActions[i].action);

        taskList.push(moveToRoom);
        taskList.push(moveFindTarget);
        taskList.push(actOnTarget);
    }
    return taskList;
};

RouteRemoteActions.prototype.energyCost = function(build) {
    // Hack until raceBase.energyFromBody gets implemented
    if (raceBase.energyFromBody(build.body)) {
        return raceBase.energyFromBody(build.body)
    }
    return raceClaimer.energyFromSize(build.body.length/2);
};

RouteRemoteActions.prototype.parts = function(build) {
    return build.body.length;
};

/*
function RoutePatrolRoom.prototype.ActionList(room,action, findFunction, findFunctionsModule)   {
    this.room = room;
    this.action = action;
    this.findFunction = findFunction;
    this.findFunctionsModule = findFunctionsModule;
}*/

module.exports = RouteRemoteActions;


























