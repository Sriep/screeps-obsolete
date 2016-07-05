/**
 * @fileOverview Supply object for using the pool
 * @author Piers Shepperson
 */

/**
 * Supply object for using the pool
 * @module policy
 */
var supplyCentres = Memory.policies[0].supplyCentres;

var supplyCenter = {
    updateSupplyLevel: function(room, energy, yardCapacity)
    {
        if (Game.rooms[room] !== undefined) {
            var centre = supplyCentres[room];
            if (undefined != centre) {
                centre[room].energyToTrade = energy;
                centre[room].yardCapacity = yardCapacity;
            } else {
                this.newSupplyCenter(room, energy, yardCapacity);
            }
            return true;
        } else {
            return false
        }
    },

    findMatchFor: function (order) {
        var orderedcentres = .values(supplyCentres).sort( function (a,b) {
           return Game.map.getRoomLinearDistance(a.room, order.room) 
               - Game.map.getRoomLinearDistance(b.room, order.room);
        });
        for (var i in orderedcentres) {
            if (this.canSupply(orderedcentres[i].room, order))
                return orderedcentres[i].room;
        }
        return null;
    },

    canSupply: function (centerId, order) {
        return supplyCentres[centerId].energyToTrade > order.energyRequested
            && supplyCentres[centerId].yardCapacity > order.energyRequested.;
    },

    completeOrder: function(centerId, order) {
        supplyCentres[centerId].buildqueue.push(order);
        return true;
    },

    newSupplyCenter: function(room, energy, yardCapacity) {
        supplyCentres[room] = {};
        supplyCentres[room].room = room;
        supplyCentres[room].energyToTrade = energy;
        supplyCentres[room].yardCapacity = yardCapacity;
        supplyCentres[room].buildQueue = [];
    }

}



module.exports = supplyCenter;





































