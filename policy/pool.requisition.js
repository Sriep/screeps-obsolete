/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
var policyThePool = require("policy.the.pool");
var raceBase = require("raceBase");
/**
 * Requisition object for using the pool
 * @module policy
 */

function PoolRequisition (requesterId
                        ,creepBody
                        ,taskList
                        ,locationToDeliver
                        ,role
                        ,priorityLevel
) {
    this.id = getNextRequisitionId();
    this.requester = requesterId;
    this.body = creepBody;
    this.taskList = taskList;
    this.role = role;
    this.energy = raceBase.getEnergyFromBody(creepBody);
    if (energy == 0) {
        this.body = undefined;
        this.energy = undefined;
    }    
    this.priority = priorityLevel;
    this.location = locationToDeliver;
    this.tick = undefined;
}

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
        return order.id == policyId.id
    });
    return orders;
};

PoolRequisition.prototype.returnToPool = function (creepName) {
    return policyThePool.returnToPool(creepName);
};

PoolRequisition.prototype.placeRequisition = function(order) {
    order.tick = Game.tick;
    if (order.isValid())
        policyThePool.getRequisitions()[order.id] = order;
};

PoolRequisition.prototype.isValid = function(requisition) {
    return requisition.id !== undefined;
};

PoolRequisition.ptototype.createCopy = function(requisition) {
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
};

module.exports = PoolRequisition;
































