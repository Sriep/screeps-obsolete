/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleRepairer = {
	
	findTarget: function(creep) {
		var damagedStructures = creep.room.find(FIND_STRUCTURES, {
            		filter: object => object.hits < object.hitsMax
        });	
        damagedStructures.sort((a,b) => a.hits - b.hits);
        if(damagedStructures.length > 0) {
        	return 	damagedStructures[0];
        }
        var empty = [];
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
            console.log(creep + "start building");
        }
               
        if(creep.memory.building) {   
        	var target = this.findTarget(creep);       	
        	console.log("creep: " + creep + " target: " + target );
        	if (0 != target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                	console.log(creep + "more to target");
                    creep.moveTo(target);
                } else {
                	console.log(creep + "built to target");
                }
        	} //if
        } // if(creep.memory.building) 
        else {
        	//console.log(creep + "more to source");
            var sources = creep.room.find(FIND_SOURCES);
            //console.log("sources before soft" + sources);
            sources.sort((a,b) => this.distanceBetween(a, creep) - this.distanceBetween(b, creep));
            //console.log("sources after sort" + sources);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                //sources[0].memory.customers = sources[0].memory.customers +1;
            }
        } //else
    } //function
};

module.exports = roleRepairer;