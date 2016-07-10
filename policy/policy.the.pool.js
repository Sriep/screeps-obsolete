/**
 * @fileOverview Screeps module. Pool of workers.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var gc = require("gc");
var poolSupply = require("pool.supply");
var TaskMoveRoom = require("task.move.room");

/**
 * Pool of workers.
 * @module policyThePool
 */
var policyThePool = {
    
    enactPolicy: function (currentPolicy) {
        var orders = poolSupply.getValuesFromHash(this.getRequisitions());
        orders.sort(function (a, b) { return b.priority - a.priority ; });

        for ( var index in orders) {
            var centerId = poolSupply.findMatchFor(orders[index]);
            if (null !== centerId) {
                if (poolSupply.attachOrder(centerId, orders[index]))
                    delete orders[index];
            }
        }
    },

    getRequisitions: function() {
        if (Memory.policies === undefined )
            return undefined;
        if (Memory.policies[0] == undefined)
            return undefined;
        return  Memory.policies[0].requisitions;
    },
 
    returnOrder:function (order) {
        this.getRequisitions()[order.id] = order;
    },

    cancelOrder: function (orderId) {
        this.getRequisitions()[orderId] = undefined;
    },
    
    completedOrder: function (order, creepName) {
        var creep = Game.creeps[creepName];
        var tasks = [];
        if (order.locationToDeliver !== undefined &&
            undefined !== Game.rooms[order.locationToDeliver]) {
            var deliverTo = new TaskMoveRoom(order.locationToDeliver);
            tasks.push(deliverTo);
        }
        tasks.concat(order.taskList);
        creep.memory.tasks.tasklist = tasks;
        creep.memory.policyId = order.requesterId;
        creep.memory.policyId = order.role;
    },

    returnToPool: function (name) {
        var creep = Game.creeps[name];
        if (undefined !== creep){
         //  return to nearest spawn
            var spawns = _.filter(Game.spawns);
            spawns.sort(function(a,b){
                return Game.map.getRoomLinearDistance(a.room.name, creep.room.name)
                    - Game.map.getRoomLinearDistance(b.room.name, creep.room.name);
            });
            creep.memory.policyId = 0;
            var tasks = [];
            var moveToSpawn = new TaskMovePos(spawns[0].pos);
            tasks.push(moveToSpawn);
            creep.memory.tasks.tasklist  = tasks;
            creep.memory.role = gc.ROLE_UNASSIGNED;
        }
    },

    draftNewPolicyId: function (oldPolicy) {
        return oldPolicy;
    },

    initialisePolicy: function (newPolicy) {
        //Memory.policies[THE_POOL].requisitions = {};
        //Memory.policies[THE_POOL].supplyCenters = {};
        //Memory.nextRequisitionsId = 0;
        //Memory.nextSupplyCenterId = 0;
        return true;
    },
};

var completeOrder = function(orders, supply) {
    for (var i in orders) {
        Memory.policies[supply[i]].buildqueue.push(orders[i]);
    }
};






module.exports = policyThePool;
























