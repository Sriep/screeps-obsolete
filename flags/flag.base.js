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
var policyFrameworks = require("policy.frameworks");

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
                module.run(Game.flags[flagName]);
            }
        }
    },

    getModuleFromType: function (flagType) {
        if (undefined === flagType)
            return;
        return require("flag." + flagType);
    }

};

module.exports = flagBase;





