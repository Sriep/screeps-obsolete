/**
 * Created by Piers on 21/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var policyFramework = require("policy.frameworks");
var roomBase = require("room.base");

/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagKeeperLair
 */
var flagKeeperLair = {

    run: function (flag) {
    //       TODO Keeper lair flag.
        if (!Game.rooms[flag.pos.roomName]) return;

        var myRooms = _.filter(Memory.policies, function (policy) {
            return policy.keeperRoom && policy.keeperRoom == flag.pos.roomName;
        });
        if (myRooms.length == 0) {
            console.log("Flag keeper lair room", flag);
            var adjacentRooms = roomBase.findAdjacentOwnedRooms(flag.pos.roomName);
            var marshalingPoint = roomBase.justInsideNextRoom(flag.pos.roomName, adjacentRooms[0]);
            var keeperPolicy = policyFramework.policyKeeperSectorMarshal(
                flag.pos.roomName,
                marshalingPoint,
                false,
                undefined
            );
            flag.memory.attackKeeperFrom = adjacentRooms[0];
            flag.memory.policyId = keeperPolicy.id;
        }
        console.log("End of Flag keeper lair room", flag);
    }

};

module.exports = flagKeeperLair;

































