/**
 * @fileOverview Screeps module. Abstract base class functions and data
 * for roles worker creeps can take.
 * @author Piers Shepperson
 */
 
/**
 * Abstract base class functions and data for roles worker creeps can take.
 * Methods for finding and moving towards targets.
 * @module roleBase
 */
var roleBase = {
    sourceClinetThreshold: 1,
    
    distanceBetween: function( obj1, obj2) {
		dx = obj1.pos.x - obj1.pos.x;
		dy = obj1.pos.y - obj2.pos.y;
		distance = Math.sqrt(dx*dx + dy*dy);
		return distance;
	},
	
	findTargetSource: function(creep) {
	    var sources = creep.room.find(FIND_SOURCES);
	    sources.sort((a,b) => this.distanceBetween(a, creep) 
                    - this.distanceBetween(b, creep));   	    
	    for ( var sIndex in  sources ) {
            sources[sIndex].clients= 0;
            for(var cIndex in Game.creeps) {
                if (Game.creeps[cIndex].memory.targetSourceId == sources[sIndex].id)
                {
                    sources[sIndex].clients = sources[sIndex].clients +1;
                }   // if             
            }   //  for(var cIndex in Game.creeps)          
        } // for ( var sIndex in  sources ) 
        var target = sources[0];
        if (sources.length > 1) {
            if (sources[0].clients > sources[1].clients + this.sourceClinetThreshold) {
                target = sources[1];   
            }
        }
        return target;  
	},
	
	checkCarryState: function (creep) {	
	    if(creep.memory.carrying === undefined) {
	        creep.memory.carrying = false
	    }
	        
	    // Just run out of energy
	    if(creep.memory.carrying && creep.carry.energy == 0) {
            creep.memory.carrying = false;
        } 
        // Just filled up with energy
        if(!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
            creep.memory.carrying = true;
            creep.memory.targetSourceId = 0;
        }          	    
	},        	
	
	fillUpEnergy: function(creep) {
        var sourceId = creep.memory.targetSourceId;
        // Has not decided which source to target
        if (sourceId === undefined || 0 == sourceId)
        {            
            var targetSource = this.findTargetSource(creep);
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) { 
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
    }       
};

module.exports = roleBase;






































