/**
 * @fileOverview Screeps module. Apolicy object for neutral rooms. Kind of empty wrapper.
 * @author Piers Shepperson
 */
"use strict";
//Bace object
var policy = require("policy");
var gc = require("gc");

/**
 * Abstract policy object for neutral rooms. Kind of empty wrapper.
 * @module policyDefence
 */
function  PolicyNeutralRoom (roomName) {
    this.type = gc.POLICY_NEUTRAL_ROOM;
    this.roomName = roomName;
}

PolicyNeutralRoom.prototype.draftNewPolicyId = function(oldPolicy) {
    var room = Game.rooms[oldPolicy.roomName];
    if (undefined !== room) {
        if (undefined != room.controller && room.controller.my) {
            var spawnSites = room.find(FIND_CONSTRUCTION_SITES, {
                filter: {structureType: STRUCTURE_SPAWN}
            });
            if (spawnSites.length > 0){
                var PolicyBuildSpawn = require("policy.build.spawn");
                return new PolicyBuildSpawn(oldPolicy.roomName);
            }
        }
    }
    return oldPolicy;
};

PolicyNeutralRoom.prototype.initialisePolicy = function (newPolicy) {
    return true;
};

PolicyNeutralRoom.prototype.enactPolicy = function(currentPolicy) {
};

PolicyNeutralRoom.prototype.switchPolicy = function(oldPolicyId, newPolicy)
{
    policy.reassignCreeps(oldPolicyId, newPolicy);
};

module.exports = PolicyNeutralRoom;