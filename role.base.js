/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
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
	    console.log("sorted sources" + sources);
	    for ( var sIndex in  sources ) {
            sources[sIndex].client = 0;
            for(var cIndex in Game.creeps) {
                if (Game.creeps[cIndex].memory.targetSourceId == sources[sIndex].id)
                {
                    sources[sIndex].client = sources[sIndex].clients +1;
                }   // if             
            }   //  for(var cIndex in Game.creeps)          
        } // for ( var sIndex in  sources ) 
        var target = sources[0];
        console.log("In roleBase.findTargetSource source0 " + sources[0] 
                        + " source1 " + sources[1]);
        if (sources.length > 1) {
            if (sources[0].clients > sources[1].clients + this.sourceClinetThreshold) {
                target = sources[1];   
            }
        }
        return target;  
	}
	
        
};

module.exports = roleBase;
