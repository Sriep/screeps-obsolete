/**
 * Created by Piers on 19/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var labColours = require("lab.colours");

/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module buildingTerminal
 */
var buildingTerminal = {

    move: function(terminal) {
        for ( var flagName in Game.flags) {
            if (Game.flags[flagName].memory.type == gc.FLAG_LAB
                && Game.flags[flagName].secondaryColor == COLOR_WHITE
                && Game.flags[flagName].color != COLOR_WHITE) {

                var resourceId = labColours.resource(Game.flags[flagName].color, COLOR_WHITE);
                //console.log(terminal,"fond lab resource",resourceId,terminal.store[resourceId]);
                if (terminal.store[resourceId] > 5000) {
                    var lab = Game.getObjectById(flagName);
                    if (lab.mineralAmount < gc.LAB_REFILL_MINERAL_THRESHOLD) {
                        console.log(terminal,"fond lab resource",resourceId,"has resouce",terminal.store[resourceId]);
                        if (!this.roomHasResource(lab.room, resourceId)) {
                            var result = terminal.send(resourceId, 2000, lab.room.name);
                            console.log(terminal,"send resourceId",resourceId,"result",result);
                        }
                    }
                }
            }
        }
    },


    roomHasResource(room, resourceId) {
        if (room.storage.store[resourceId] > 0) return true;
        if (room.terminal.store[resourceId] > 0) return true;
        for ( var i = 0 ; i < Game.market.incomingTransactions.length ; i++ ) {
            var order = Game.market.incomingTransactions[i];
            if ( order.to = room.name
                    && order.resourceType == resourceId
                    && order.time > Game.time - 5)
                return true;
        }
        var creepsCarryingResource = room.find(FIND_MY_CREEPS, {
            filter: function(c) {
                return c.carry[resourceId] > 100;
            }
        });
        return creepsCarryingResource.length > 0;
    }

};

module.exports = buildingTerminal;