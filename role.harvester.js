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
        oldTargetId = creep.memory.offloadTargetId;
        if (oldTargetId !== undefined)
        {           
            target = Game.getObjectById(oldTargetId);
            if (target.energy < target.energyCapacity)
            {
                return target;
            }
        }

        var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) 
                    && structure.energy < structure.energyCapacity * 0.5
                }
        });	
        if (towers.length >0) {
            return towers[0];    
        }
        
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) 
                    && structure.energy < structure.energyCapacity;
                }
        });	             
        if(target) {
            creep.memory.offloadTargetId = target.id;
			return 	target; 
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
















