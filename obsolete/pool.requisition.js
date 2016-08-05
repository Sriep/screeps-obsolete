/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
//var policyThePool = require("policy.the.pool");
var raceBase = require("race.base");
/**
 * Requisition object for using the pool
 * @module policy
 */

function PoolRequisition (requesterId
                            ,creepBody
                            ,taskList
                            ,orderRoom
                            ,role
                            ,expires
                            ,forceBuildRoom
                            ,priorityLevel
) {
    this.id = getNextRequisitionId();
    this.requester = requesterId;
    this.body = creepBody;
    this.taskList = taskList;
    this.role = role;
    this.energy = raceBase.getEnergyFromBody(creepBody);
  //  console.log("In requisition constuctor energy", this.energy, "body",this.body);
    if (this.energy == 0) {
        this.body = undefined;
        this.energy = undefined;
    }    
    this.priority = priorityLevel;
    this.orderRoom = orderRoom;
    this.expires = expires;
    this.forceBuildRoom = forceBuildRoom;
    this.tick = undefined;
}

PoolRequisition.prototype.isValid = function() {
    if (!this.body) return false;
    if (!this.energy || this.energy == 0) return false;
    if (!this.id) return false;
    if (!this.requester) return false;

    return true;
};

function getNextRequisitionId() {
    if (Memory.nextRequisitionId === undefined) {
        Memory.nextRequisitionId = 1;
    }
    var latestId = Memory.nextRequisitionId;
    Memory.nextRequisitionId = Memory.nextRequisitionId +1;
    return latestId;   
}

PoolRequisition.prototype.getMyRequisition = function (policyId) {
    var orders = _.filter(policyThePool.getRequisitions(), function (order) {
        return (order !== undefined && order.id == policyId.id);
    });
    console.log("PoolRequisition policyid",policyId);
    return orders;
};

PoolRequisition.prototype.returnToPool = function (creepName) {
    return policyThePool.returnToPool(creepName);
};

PoolRequisition.prototype.placeRequisition = function(order) {
    order.tick = Game.time;
    if (order.isValid())
        policyThePool.getRequisitions()[order.id] = order;
};

PoolRequisition.prototype.getMaxYardSize = function () {
    return policyThePool.getMaxYardSize();
},


/*
PoolRequisition.prototype.createCopy = function(requisition) {
    var newCopy = new PoolRequisition();
    newCopy.id = requisition.id;
    newCopy.requester = requisition.requester;
    newCopy.body = requisition.body;
    newCopy.energyRequested = requisition.energyRequested;
    newCopy.taskList = requisition.taskList;
    newCopy.priority = requisition.priority;
    newCopy.location = requisition.location;
    newCopy.tick = requisition.tick;
    return newCopy;
};*/

module.exports = PoolRequisition;
































