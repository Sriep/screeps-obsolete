/**
 * @fileOverview Screeps module. Pool of workers.
 * @author Piers Shepperson
 */

var policy = require("policy");
var policyDeclarations = require("policy.declarations");
var poolRequisition = requier("pool.requisition");
var poolSupply = requier("pool.supply");

var requisitions = Memory.policies[0].requisitions;
var supplyCenters = Memory.policies[0].supplyCenters;
THE_POOL_INDEX = policy.THE_POOL_INDEX,

/**
 * Pool of workers.
 * @module policyThePool
 */
var public = {


    requisition: function (order) {
        order.tick = Game.tick;
        requisitions.push(order);
    },

    supply: function (id, items, location) {
        supply.push({id: id, items: items, location: location, tick: tick});
    },

    enactPolicy: function (currentPolicy) {
        var orders = requisitions.sort(function (a, b) {
            return a.priority - b.priority ;
        });
        var index = orders.length
        while (--orders) {
            var center = poolSupply.findMatchFor(orders[index]);
            if (null !== match) {
                poolSupply.completeOrder(center, orders[index]);
                orders.splice(index);
            }
        }
    },
 
    returnOrder:function (order) {
        requisitions.push(order);
    },

    cancelOrder: function (orderId) {
        
    },

    freeCreeps: function () {

    },

    draftNewPolicyId: function (oldPolicy) {
        return oldPolicy;
    },

    initilisePolicy: function (newPolicy) {
        Memory.policies[THE_POOL_INDEX].requisitions = [];
        Memory.policies[THE_POOL_INDEX].supplyCenters = [];
        return true;
    },

};

var completeOrder = function(orders, supply) {
    for (var i in orders) {
        Memory.policies[supply[i]].buildqueue.push(orders[i]);
    }
};






module.exports = public;
























