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
      //  console.log(flag,"flagController run");
        if (!flag.room)
            return;
        if ( roomBase.isMyRoom(flag.room.name)) {
            //flag.memory.claimerFrom = { room : flag.room.name, distance : 0 };
        } else if ( roomBase.isNeutralRoom(flag.room.name)) {
          //  console.log("flagController flag", flag);
            flag.memory.claimerFrom = this.claimerSuppyRoom(flag);
        }
    },

    claimerSuppyRoom : function (flag) {
        return roomBase.findClosest(flag.pos, FIND_MY_SPAWNS);
    },

};

module.exports = flagController;