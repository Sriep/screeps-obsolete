/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roadBuilder = {
	blockSzie : 50 + 100 +50,	
    
	/** @param {from object, to object} creep **/
    run: function( from, to ) {
    	console.log("Create road from: " + from + "to: " + to );
    	
    	var path = from.room.findPath(from.pos , to.pos, { ignoreCreeps: true, ignoreRoads: true});
    	for(var step in path) {	  
    		from.room.createConstructionSite(path[step].x, path[step].y, STRUCTURE_ROAD);    		
    	}   //for
    	console.log("finsihed for loop");
    } //function    
};

module.exports = roadBuilder;

//
//var roadBuilder = require('road.builder');
//var from = Game.getObjectById("55db3176efa8e3fe66e04a52");  
//var to =  Game.getObjectById("55db3176efa8e3fe66e04a50");  
//roadBuilder.run( from, to );

