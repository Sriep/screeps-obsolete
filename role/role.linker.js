/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var stats = require("stats");

var roleLinker = {

    findTarget: function(creep) {
        return creep.room.controller;
    },

    action: function(creep, target) {
        return stats.upgradeController(creep,target);
    },
};

module.exports = roleLinker;