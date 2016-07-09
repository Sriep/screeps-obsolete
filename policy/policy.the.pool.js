/**
 * @fileOverview Screeps module. Pool of workers.
 * @author Piers Shepperson
 */

var policy = require("policy");
//var policyFrameworks = require("policy.frameworks");
//var poolRequisition = require("pool.requisition");
var poolSupply = require("pool.supply");

/**
 * Pool of workers.
 * @module policyThePool
 */

THE_POOL = policy.THE_POOL;

var thePool = {
    
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
        
    },

    freeCreeps: function () {

    },

    draftNewPolicyId: function (oldPolicy) {
        return oldPolicy;
    },

    initilisePolicy: function (newPolicy) {
        //Memory.policies[THE_POOL].requisitions = {};
        //Memory.policies[THE_POOL].supplyCenters = {};
        //Memory.nextRequisitionsId = 0;
        //Memory.nextSupplyCenterId = 0;
        return true;
    },

};

var completeOrder = function(orders, supply) {
    for (var i in orders) {
      //  Memory.policies[supply[i]].buildqueue.push(orders[i]);
    }
};






module.exports = thePool;
























