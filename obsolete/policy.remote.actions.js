/**
 * Created by Piers on 14/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var PoolRequisition = require("pool.requisition");
var TaskMoveFind = require("task.move.find");
var TaskMoveRoom = require("task.move.room");
var TaskActionTarget = require("task.action.target");
var policyThePool = require("policy.the.pool");
var gc = require("gc");
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module policy
 */
var policyClaim = {


    initialisePolicy: function (newPolicy) {
        console.log("policyClaim initialisePolicy");
        if (!Array.isArray(newPolicy.rooms)) {
            newPolicy.rooms = [newPolicy.rooms];
        }
        if (!Array.isArray(newPolicy.actions)) {
            newPolicy.actions = [newPolicy.actions];
        }
        if (!Array.isArray(newPolicy.findFunctions)) {
            newPolicy.findFunctions = [newPolicy.findFunctions];
        }
        if (!Array.isArray(newPolicy.findFunctionsModules)) {
            newPolicy.findFunctionsModules = [newPolicy.findFunctionsModules];
        }
        if (newPolicy.rooms.length != newPolicy.actions.length
            || newPolicy.rooms.length != newPolicy.findFunctions.length
            || newPolicy.rooms.length != newPolicy.findFunctionsModules.length ) {
          //  console.log("policyClaim bad array lengths",newPolicy.rooms
          //      ,  newPolicy.actions,newPolicy.findFunctions,newPolicy.findFunctionsModules);
            return false;
        }

        var taskList = this.getTaskList(newPolicy);
        console.log("taskList",taskList);
        var order = new PoolRequisition(
            newPolicy.id
            , newPolicy.body
            , taskList
            , undefined //newPolicy.marshallingPoint
            , undefined
        );
       // console.log("this is order",JSON.stringify(order));
        PoolRequisition.prototype.placeRequisition(order);
        return true;
    },
    
    getTaskList: function(policy){
        var taskList = [];
        var moveToRoom, moveFindTarget, actOnTarget;
        for (var i = 0 ; i < policy.rooms.length ; i++ ) {
            moveToRoom = new TaskMoveRoom(policy.rooms[i]);
            moveFindTarget =  new TaskMoveFind(gc.FIND_FUNCTION,gc.RANGE_TRANSFER
                , policy.findFunctions[i],policy.findFunctionsModules[i]);
            actOnTarget = new TaskActionTarget(policy.actions[i]);

            taskList.push(moveToRoom);
            taskList.push(moveFindTarget);
            taskList.push(actOnTarget);
        }
        return taskList;
        //taskList.push(policyThePool.returnToPoolTask(rooms[policy.rooms.length-1]));
    },

    findController: function (creep) {
        return creep.room.controller;
    },


    draftNewPolicyId: function (oldPolicy) {
        return null;
    },


    enactPolicy: function (currentPolicy) { //CLAIMER_BODY
    },


};

module.exports = policyClaim;
























