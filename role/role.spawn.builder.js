/**
 * Created by Piers on 02/07/2016.
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleSpawnBuilder = require("role.base");

var roleSpawnBuilder = {

    findTarget: function(creep) {
        return creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType:  STRUCTURE_SPAWN }
        });
    },

    action: function(creep, target) {
        return creep.build(target);
    },

};

module.exports = roleSpawnBuilder;