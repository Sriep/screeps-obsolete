/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = {
	
	findTarget: function(creep) {
		var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(constructionSites.length) {
		    constructionSites.sort((a,b) => this.distanceBetween(a, creep) - this.distanceBetween(b, creep));
			return 	constructionSites[0]; 
		}
        return 0;
	},
	
	distanceBetween: function( obj1, obj2) {
		dx = obj1.pos.x - obj1.pos.x;
		dy = obj1.pos.y - obj2.pos.y;
		distance = Math.sqrt(dx*dx + dy*dy);
		return distance;
	},

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            console.log(creep + "stop building");
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.targetSourceId = 0;
            console.log(creep + "start building");
        }
               
        if(creep.memory.building) {   
        	var target = this.findTarget(creep);
        	console.log("creep: " + creep + " target: " + target );
        	if (0 != target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                	console.log(creep + "more to target");
                    creep.moveTo(target);
                } else {
                	console.log(creep + "built to target");
                }
        	} //if
        } // if(creep.memory.building) 
        else {
            var sourceId = creep.memory.targetSourceId;
            console.log("sourceid " + sourceId + " memory " + creep.memory);
            if (sourceId === undefined)
            { 
                //var source = creep.pos.findClosestByRange(FIND_SOURCES);
                var sources = creep.room.find(FIND_SOURCES);
                sources.sort((a,b) => this.distanceBetween(a, creep) 
                    - this.distanceBetween(b, creep));     
                 if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) { 
                    console.log("sources[0]" + sources[0] );
                    creep.memory.targetSourceId = sources[0].id;
                    creep.moveTo(sources[0]);
                 }                              
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

























