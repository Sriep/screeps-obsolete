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

/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagBase
 */
var flagBase = {

    run: function () {
        for ( var flagName in Game.flags) {
            if (Game.flags[flagName].memory.type) {
                var module = this.getModuleFromType(Game.flags[flagName].memory.type);
                if (module)
                    module.run(Game.flags[flagName]);
            }
        }
    },

    getModuleFromType: function (flagType) {
        if (undefined === flagType)
            return;
        return require("flag." + flagType);
    },

    roomNamesFromFlags: function (flags) {
        var rooms = [];
        for ( var i = 0 ; i < flags.length; i++ ) {
            if (rooms.indexOf(flags[i].pos.roomName) == -1) {
                rooms.push(flags[i].pos.roomName);
            }
        }
        return rooms;
    },

    linkerFrom: function (flag, roomName) {
        if (!flag.memory.linkerFrom ) return false;
        //console.log(flag.memory.linkerFrom.room ,"linkerFrom",roomName);
        return flag.memory.linkerFrom
            && flag.memory.linkerFrom.room == roomName;
    },

    porterFrom: function (flag, roomName) {
        //console.log("porterfrom",flag,room);
        if (!flag.memory.porterFrom ) return false;
        return flag.memory.porterFrom
            && flag.memory.porterFrom.room == roomName;
    },

    reverseControllerFrom: function(flag, roomName) {
        if (!flag.memory.claimerFrom ) return false;
        return flag.memory.claimerFrom
            && flag.memory.claimerFrom.room == roomName
            && flag.memory.upgradeController;
    },
};

module.exports = flagBase;





