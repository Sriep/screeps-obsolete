/**
 * @fileOverview Screeps module. Pool of workers.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var gc = require("gc");
var poolSupply = require("pool.supply");
var TaskMoveRoom = require("task.move.room");
var TaskMovePos = require("task.move.pos");

/**
 * Pool of workers.
 * @module policyThePool
 */
var policyThePool = {
    
    enactPolicy: function (currentPolicy) {
      //  console.log("In pool requsionts", JSON.stringify(this.getRequisitions()));
        var orders = poolSupply.getValuesFromHash(this.getRequisitions());
      //  this.cleanupRequisionts(orders);
        orders.sort(function (a, b) { return b.priority - a.priority ; });
        for ( var index in orders) {
            var centreId = poolSupply.findMatchFor(orders[index]);
            console.log("enact the pool lookingfor match",orders[index].id,"found",centreId);
            if (null !== centreId) {
                if (poolSupply.attachOrder(centreId, orders[index])) {
                    this.getRequisitions()[orders[index].id] = undefined;
                }
            }
        } // for
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
        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        console.log(creep,"pool completedOrder here is the order", JSON.stringify(order[0]) );
        creep.memory.tasks.tasklist = order[0].taskList;
        creep.memory.policyId = order[0].requester;
        creep.memory.role = order[0].role;
        console.log(creep,"pool complteedOrder requester", order[0].requester);
        if (order[0].posDeliver !== undefined &&
            undefined !== Game.rooms[order[0].posDeliver]) {
            var deliverTo = new TaskMovePos(order[0].posDeliver,1);
            deliverTo.loop = false;
            deliverTo.pickup =false;
            creep.memory.tasks.tasklist.unshift(deliverTo);
        }
        console.log("pool completedorder[0] creep",creep,"role"
            ,creep.memory.role,"policy id", creep.memory.policyId );
        console.log("completedorder[0] new tasklist"  ,JSON.stringify(creep.memory.tasks.tasklist));
    },

    returnToPool: function (name) {
        var creep = Game.creeps[name];
        if (undefined !== creep){
         //  return to nearest spawn
            var tasks = [];
            /*
            var spawns = _.filter(Game.spawns);
            spawns.sort(function(a,b){
                return Game.map.getRoomLinearDistance(a.room.name, creep.room.name)
                    - Game.map.getRoomLinearDistance(b.room.name, creep.room.name);
            });            
            var moveToSpawn = new TaskMovePos(spawns[0].pos,1);
            */
            tasks.push(this.returnToPoolTask(creep.room.name));
            creep.memory.policyId = 0;          
            creep.memory.tasks.tasklist  = tasks;
            creep.memory.role = gc.ROLE_UNASSIGNED;
        }
    },
    
    returnToPoolTask: function (room) {
        var spawns = _.filter(Game.spawns);
        spawns.sort(function(a,b){
            return Game.map.getRoomLinearDistance(a.room.name, room)
                - Game.map.getRoomLinearDistance(b.room.name, room);
        });
        return new TaskMovePos(spawns[0].pos,1);
    },

    getMaxYardSize: function () {
        //console.log("getMaxYardSize in pool maxYardSize",poolSupply.getMaxYardSize());
        return poolSupply.getMaxYardSize();
    },

    draftNewPolicyId: function (oldPolicy) {
        return oldPolicy;
    },

    initialisePolicy: function (newPolicy) {
        Memory.policies[THE_POOL].requisitions = {};
        Memory.policies[THE_POOL].supplyCenters = {};
        Memory.nextRequisitionsId = 0;
        Memory.nextSupplyCenterId = 0;
        return true;
    },
};
/*
var completeOrders = function(orders, supply) {
    for (var i in orders) {
        Memory.policies[supply[i]].buildqueue.push(orders[i]);
    }
};*/






module.exports = policyThePool;
























