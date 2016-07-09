/**
 * @fileOverview Screeps module. Role for claiming a foreign contoller.
 * @author Piers Shepperson
 */
var roleBase = require("role.base");
var policy = require("policy");
/**
 *  Role for claiming a foreign contoller.
 * @module policy
 */
var roleNeutralBuilder = {


    findTarget: function(creep) {
        return creep.room.controller;
    },

    action: function(creep, target) {
        return creep.claimController(target);
    },

}

module.exports = roleNeutralBuilder;