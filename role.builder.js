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
        roleBase.checkCarryState(creep);  
        // moving towards construction site
        if(creep.memory.carrying) {   
        	var target = this.findTarget(creep);
        	if (0 != target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        	} //if (0 != target)
        } // if(creep.memory.building)        
        // moving towards source
        else {
            roleBase.fillUpEnergy(creep);
        } //else
    } //function
};

module.exports = roleBuilder;

























