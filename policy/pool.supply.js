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
      //  console.log("start of getEnergyInBuildQueue",room);
        if (room === undefined) {
           // console.log(room, "in getEnergyInBuildQueue")
            return 0;
        }
        var centre = this.getCentre(room);
        if (centre === undefined) {
            return 0;
        }
        var buildQueue = centre.buildqueue;
        var energy = 0;
       // console.log("getEnergyInBuildQueue build queue",buildQueue);
        for (var i in buildQueue) {
            energy = energy + buildQueue[i].energy;
        }
        return energy;
    },

    getCentre: function (room) {
        if (room === undefined) {
      //      console.log(room, "in getCentre")
            return 0;
        }
        if (room in this.getsupplyCentres()) {
      //      console.log(room, "is in ", this.getsupplyCentres())
            return this.getsupplyCentres()[room];
        } else {
      //      console.log(room ,"is not in",this.getsupplyCentres(),"returning undefeind");
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
        if (undefined !== order.orderRoom && order.forceBuildRoom) {
           if (this.canSupply(order.orderRoom, order)) {
               return order.orderRoom;
           } else {
               return null;
           }
        }

        var orderedCentres = this.getValuesFromHash(this.getsupplyCentres());
        if (undefined !== order.orderRoom && undefined !== order.orderRoom.roomName){
             orderedCentres.sort(function (a, b) {
                 return Game.map.getRoomLinearDistance(a.roomName, order.orderRoom.roomName)
                         - Game.map.getRoomLinearDistance(b.roomName, order.orderRoom.roomName) ;
            });
        }
        for (var i in orderedCentres) {
            if (this.canSupply(orderedCentres[i].roomName, order))
                return orderedCentres[i].roomName;
        }
        return null;
    },

    nextRequisition: function (roomName) {
        return this.getCentre(roomName).buildqueue[0];
    },

    canSupply: function (centreId, order) {
       return (this.getsupplyCentres()[centreId].energyToTrade > order.energy
                 && this.getsupplyCentres()[centreId].yardCapacity > order.energy);
    },

    attachOrder: function(centreId, order) {
        this.getsupplyCentres()[centreId].buildqueue.push(order);
        return true;
    },
    
   // policySupply.completedOrder(currentPolicy.id, build, buildName);
    completedOrder: function (centreId, order, creepName) {
        var creep = Game.creeps[creepName];
        if (undefined === creep) {
            return false;
        }
        var policyThePool = require("policy.the.pool");
        var queue = this.getsupplyCentres()[centreId].buildqueue;
        var index = queue.indexOf(order);
       // console.log("completedOrder",index, "queue",queue);
        if (index > -1) {
            order = queue.splice(index,1);
            policyThePool.completedOrder(order, creepName);
            return true;
        }
        //console.log("completedOrder Failed");
        policyThePool.returnToPool(creepName);
        return false;
    },

    getMaxYardSize: function () {
        var maxYardSize = 0;
        for ( var i in Memory.policies[0].supplyCentres) {
            maxYardSize = Math.max(maxYardSize,Memory.policies[0].supplyCentres[i].yardCapacity);
        }
       // console.log("getMaxYardSize in pool supply maxYardSize",maxYardSize);
        return maxYardSize;
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

};



module.exports = supplyCenter;





































