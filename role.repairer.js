/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roleBase = require("role.base");

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

        roleBase.checkCarryState(creep);          
        // moving towards construction site      
        if(creep.memory.carrying) {   
        	var target = this.findTarget(creep);       	
        	if (0 != target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        	} //if
        } // if(creep.memory.building)
        // moving towards source
        else {
            roleBase.fillUpEnergy(creep);
        } //else
    } //function
};

module.exports = roleRepairer;



























