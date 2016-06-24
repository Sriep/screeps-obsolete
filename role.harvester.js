/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleBase = require("role.base");
 
var roleHarvester = {
	findTarget: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) 
                    && structure.energy < structure.energyCapacity;
                }
        });	    
		if(targets.length) {
			return 	targets[0]; 
		}
        return 0;
	},	

    run: function(creep) {
        roleBase.checkCarryState(creep);   
        // moving towards construction site
        if(creep.memory.carrying) {   
        	var target = this.findTarget(creep);
        	if (0 != target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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

module.exports = roleHarvester;
















