/**
 * @fileOverview Supply object for using the pool
 * @author Piers Shepperson
 */
"use strict";
/**
 * Supply object for using the pool
 * @module policy
 */


var supplyCenter = {
    updateSupplyLevel: function(roomName, energy, yardCapacity)
    {
        if (Game.rooms[roomName] !== undefined) {
            var supplycenter = Memory.policies[0].supplyCentres;
       //     console.log("updateSupplyLevel supplycenter", supplycenter,Memory.policies[0].supplyCenters );
           // return;
            if (roomName in this.getsupplyCentres())  {
                this.getsupplyCentres()[roomName].roomName = roomName;
                this.getsupplyCentres()[roomName].energyToTrade = energy;
                this.getsupplyCentres()[roomName].yardCapacity = yardCapacity;
            } else {
                this.newSupplyCenter(roomName, energy, yardCapacity);
            }
            return true;
        } else {
            return false
        }
    },

    getEnergyInBuildQueue: function (room) {
        var buildQueue = this.getCentre().buildqueue;
        var energy = 0
        for (var i in buildQueue) {
            energy = energy + buildQueue[i].energy;
        }
        return energy;
    },

    getCentre: function (room) {
        if (room in this.getsupplyCentres()) {
            return this.getsupplyCentres()[room];
        } else {
            return undefined;
        }
    },

    getsupplyCentres: function() {
        if (Memory.policies === undefined )
            return undefined;
        if (Memory.policies[0] == undefined)
            return undefined;
        return Memory.policies[0].supplyCentres;
    },

    getValuesFromHash: function(hash) {
        var values = [];
        for ( var k in hash ) {
           values.push(hash[k]);
        }
        return values;
    },

    findMatchFor: function (order) {
        console.log("waht is orde find mat for ",JSON.stringify(order));
        var orderedCentres = this.getValuesFromHash(this.getsupplyCentres());
    //    console.log("poolsupply, orderedCentres", JSON.stringify(orderedCentres));
        orderedCentres.sort(function (a, b) {
            return Game.map.getRoomLinearDistance(a.roomName, order.roomName)
                    - Game.map.getRoomLinearDistance(b.roomName, order.roomName) ;
        });

        for (var i in orderedCentres) {
            if (this.canSupply(orderedCentres[i].room, order))
                return orderedCentres[i].room;
        }
        return null;
    },

    nextRequisition: function (room) {
        return getCentre(room).buildqueue[0];
    },

    canSupply: function (centreId, order) {
        return false;
      //  return this.getsupplyCentres()[centreId].energyToTrade > order.energyRequested
       //     && this.getsupplyCentres()[centreId].yardCapacity > order.energyRequested;
    },

    completeOrder: function(centreId, order) {
        this.getsupplyCentres()[centreId].buildqueue.push(order);
        return true;
    },

    newSupplyCenter: function(roomName, energy, yardCapacity) {
        if (this.getsupplyCentres() === undefined)
            return;
        this.getsupplyCentres()[roomName] = {};
        this.getCentre(roomName).room = roomName;
        this.getCentre(roomName).energyToTrade = energy;
        this.getCentre(roomName).yardCapacity = yardCapacity;
        this.getCentre(roomName).buildQueue = [];
    }

}



module.exports = supplyCenter;





































