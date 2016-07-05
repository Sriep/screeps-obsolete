/**
 * @fileOverview Screeps module. Pool of workers.
 * @author Piers Shepperson
 */

var policy = require("policy");
var policyDeclarations = require("policy.declarations");
var poolRequisition = requier("pool.requisition");
var poolSupply = requier("pool.supply");

var requisitions = Memory.policies[0].requisitions;
var supplyCentres = Memory.policies[0].supplyCentres;
THE_POOL = policy.THE_POOL;

/**
 * Pool of workers.
 * @module policyThePool
 */
var thePool = {
    
    enactPolicy: function (currentPolicy) {
        var orders =   .values(supplyCentres).sort(function (a, b) {
            return b.priority - a.priority ;
        });
        for ( var index in orders) {
            var centerId = poolSupply.findMatchFor(orders[index]);
            if (null !== match) {
                if (poolSupply.completeOrder(centerId, orders[index]))
                    delete orders[index];
            }
        }
    },
 
    returnOrder:function (order) {
        requisitions[order.id] = order;
    },

    cancelOrder: function (orderId) {
        
    },

    freeCreeps: function () {

    },

    draftNewPolicyId: function (oldPolicy) {
        return oldPolicy;
    },

    initilisePolicy: function (newPolicy) {
        Memory.policies[THE_POOL].requisitions = {};
        Memory.policies[THE_POOL].supplyCenters = {};
        Memory.nextRequisitionsId = 0;
        Memory.nextSupplyCenterId = 0;
        return true;
    },

};

var completeOrder = function(orders, supply) {
    for (var i in orders) {
      //  Memory.policies[supply[i]].buildqueue.push(orders[i]);
    }
};






module.exports = thePool;
























