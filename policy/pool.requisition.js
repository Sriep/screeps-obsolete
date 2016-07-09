/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
var policyThePool = require("policy.the.pool");
var raceBase = require("raceBase");
/**
 * Requisition object for using the pool
 * @module policy
 */

function Requisition (requesterId
                        ,creepBody
                        ,priorityLevel
                        ,locationToDeliver) {
    this.energy = getEnergyFromBody(creepBody);
    this.location = Game.rooms[locationToDeliver];
    if (energy == 0 || undefined === location) {
        this.id = undefined;
        this.requester = undefined;
        this.body = undefined
        this.energy = undefined;
        this.priority = undefined;
        this.location = undefined;
        this.tick = undefined;
    }
    this.id = getNextRequisitionId();
    this.requester = requesterId;
    this.body = creepBody;
    this.energy = raceBase.getEnergyFromBody(creepBody);
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
};

Requisition.prototype.paceRequisition = function(order) {
    order.tick = Game.tick;
    if (order.isValid())
        policyThePool.getRequisitions()[order.id] = order;
};

Requisition.prototype.isValid = function() {
    return id !== undefined;
};

Requisition.ptototype.createCopy = function(requisition) {
    id = requisition.id;
    requester = requisition.requester;
    creepRequested = requisition.creepRequested;
    energyRequested = requisition.energyRequested;
    priority = requisition.priority;
    location = requisition.location;
    tick = requisition.tick;
};

module.exports = Requisition;
































