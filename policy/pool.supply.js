/**
 * @fileOverview Supply object for using the pool
 * @author Piers Shepperson
 */

/**
 * Supply object for using the pool
 * @module policy
 */
var supplyCenters = Memory.policies[0].supplyCenters;



var public = {

    supplyId : undefined,
    energyToTrade : undefined,
    yardCapacity : undefined,
    buildQueue : undefined,

    updateCentre: function (Supplyid, energy, yardCapacity) {

    },

    pushNewRoom: function(Supplyid, energy, yardCapacity) {
        var i = supplyCenters.push({});
        supplyCenters[--i] = i;,
        supplyCenters[i].supplyId = roomName;
        supplyCenters[i].energyToTrade = energyToTrade;
        supplyCenters[i].yardCapacity = yardCapacity;
        supplyCenters[i].buildQueue = [];
    },

    findMatchFor: function (order) {
        var orderSupplyCenters = supplyCenters.sort( function (a,b) {
           return Game.map.getRoomLinearDistance(a.room, order.room) 
               - Game.map.getRoomLinearDistance(b.room, order.room);
        });
        for (var i in orderSupplyCenters) {
            if (poolSupply.canSupply(orderSupplyCenters[i], order))
                return orderSupplyCenters[i];
        }
        return null;
    },

    canSupply: function (centre, order) {
        return centre.energyToTrade > order.energyRequested
            && centre.yardCapacity > order.energyRequested.;
    },

    completeOrder: function(center, order) {
        center.buildqueue.push(order);
    },

    acessSupplyData: function (roomName)  {
        return supplyCenters.filter(function( obj ) {
            return obj.roomName == roomName;
        });
       // return supplyCenters.find(x=> x.roomName == roomName);
    },

    supplyOffer: function(policyId, room, energy, yardCapacity)
    {
        centre = supplyCenters.filter(function( obj ) {
            return obj.roomName == roomName;
        });
        if (null != centre) {
            centre.policyId = policyId;
            centre.eenergyToTrade = energy;
            centre.yardCapacity = yardCapacity;
        } else {
            this.pushNewCentre(policyId, room, energy, yardCapacity);
        }
    },


};



module.exports = public;





































