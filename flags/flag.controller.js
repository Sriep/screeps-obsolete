/**
 * Created by Piers on 21/07/2016.
 */
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
var roomBase = require("room.base");
/**
/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagController
 */
var flagController = {

    run: function (flag) {
        console.log(flag,"flagController run",JSON.stringify(flag));
        if (!flag.room)
            return;
        if ( roomBase.isMyRoom(flag.pos.roomName)) {
            //flag.memory.claimerFrom = { room : flag.pos.roomName, distance : 0 };
        } else if ( roomBase.isNeutralRoom(flag.pos.roomName)) {
          //  console.log("flagController flag", flag);
            flag.memory.claimerFrom = this.claimerSuppyRoom(flag);
        }
    },

    claimerSuppyRoom : function (flag) {
        return roomBase.findClosest(flag.pos, FIND_MY_SPAWNS);
    },

};

module.exports = flagController;