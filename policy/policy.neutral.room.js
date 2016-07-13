/**
 * @fileOverview Screeps module. Apolicy object for neutral rooms. Kind of empty wrapper.
 * @author Piers Shepperson
 */
"use strict";
//Bace object
var policy = require("policy");
var policyFrameworks = require("policy.frameworks");

/**
 * Abstract policy object for neutral rooms. Kind of empty wrapper.
 * @module policyDefence
 */
var policyNeutralRoom = {

    /**
     * Determins what the new polciy of or the comming tick should be.
     * This will changed if all enemy units are removed.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick.
     */
    draftNewPolicyId: function(oldPolicy) {
        var room = Game.rooms[oldPolicy.room];
        if (undefined !== room) {
            if (undefined != room.controller && room.controller.my) {
                return  policyFrameworks.createBuildspawn(room.name);
            }
        }
        return oldPolicy;
    },

    initialisePolicy: function (newPolicy) {
        return true;
    },

    /**
     * Handles defence of the room.
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none}
     */
    enactPolicy: function(currentPolicy) {
       // console.log("neutral room", JSON.stringify(currentPolicy));
        var room = Game.rooms[currentPolicy.room];
        var roomMem = Memory.rooms[currentPolicy.room];
        var roomNeam  = currentPolicy.room;
        var storageRoom = "W26S21";
      //  var storageId = "577a8dd4b973e61c594592dc";
        if (room) {
            var sources = room.find(FIND_SOURCES);
            // if (currentPolicy.routeToStorageRoom === undefined){
                var mapTo = Game.map.findRoute(currentPolicy.room, storageRoom);
                var mapFrom = Game.map.findRoute(storageRoom, currentPolicy.room);
                currentPolicy.routeToStorageRoom = mapTo;
                 currentPolicy.routeFromStorageRoom = mapFrom;
               // for (var i = 0; i < map ; i++) {
                    //var nextRoom = map[i].room;


              //  }
          //  }
        }

    },

    switchPolicy: function(oldPolicyId, newPolicy)
    {
        switch(oldPolicyId) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.PEACE:
                policy.breakUpLinks(Game.rooms[oldPolicy.room]);
            default:
        }
        policy.reassignCreeps(oldPolicyId, newPolicy);
    },

    /**
     * Detects the presence of suspicious enemy units.
     * @function beingAttaced
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy.
     */
    isNeutralRoom: function(room) {
        return ture;
    },

}

module.exports = policyNeutralRoom;