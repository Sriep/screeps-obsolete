/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleBase = require("role.base");
 
var roleBuilder = {
    
	findTarget: function(creep) {
		var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(constructionSites.length) {
		    constructionSites.sort((a,b) => roleBase.distanceBetween(a, creep) - roleBase.distanceBetween(b, creep));
			return 	constructionSites[0]; 
		}
        return 0;
	},	

    /** @param {Creep} creep **/
    run: function(creep) {
        // just run out of energy
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            console.log(creep + "stop building");
        }
        
        // just filled up with energy
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.targetSourceId = 0;
            console.log(creep + "start building");
        }
         
        // moving towards construction site
        if(creep.memory.building) {   
        	var target = this.findTarget(creep);
        	console.log("creep: " + creep + " target: " + target );
        	if (0 != target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        	} //if (0 != target)
        } // if(creep.memory.building) 
        
        // moving towards source
        else {
            var sourceId = creep.memory.targetSourceId;
            console.log("sourceid " + sourceId + " memory " + creep.memory);
            
            // Has not decided which source to target
            if (sourceId === undefined || 0 == sourceId)
            { 
                var targetSource = roleBase.findTargetSource(creep);
                
                if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) { 
                    console.log("Target sources" + targetSource );
                    creep.memory.targetSourceId = targetSource.id;
                    creep.moveTo(targetSource);
                }  
            // Contiue moving towards source or havest it if there    
            } else {                   
                var source = Game.getObjectById(creep.memory.targetSourceId);                
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {                   
                    creep.moveTo(source);
                } 
            } // if (sourceId)
        } //else
    } //function
};

module.exports = roleBuilder;

























