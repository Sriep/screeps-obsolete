/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var roleBase = require("role.base");

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {    
        roleBase.checkCarryState(creep);   
        
        // moving towards construction site
        if(creep.memory.carrying) {   
        	var target = creep.room.controller;
        	if (0 != target) {
                if(stats.upgradeController(creep,target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        	} //if (0 != target)
        } // if(creep.memory.building)        
        // moving towards source
        else {
            roleBase.fillUpEnergy(creep);
        } //else    
 
    }
};

module.exports = roleUpgrader;
