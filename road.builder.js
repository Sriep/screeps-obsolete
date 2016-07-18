/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
"use strict";

var roadBuilder = {
	blockSzie : 50 + 100 +50,	
    
	//** @param {from object, to object} creep **/
    buildRoad: function( from, to ) {
    	console.log("Create road from: " + from + "to: " + to );
    	
    	var path = from.room.findPath(from.pos , to.pos, { ignoreCreeps: true, ignoreRoads: true});
    	for(var step in path) {	  
    		from.room.createConstructionSite(path[step].x, path[step].y, STRUCTURE_ROAD);    		
    	}   //for
    	console.log("finsihed for loop");
    }, //function

	removeSites: function (room) {
		var sites  = room.find(FIND_CONSTRUCTION_SITES);
		var i = sites.length
		while(--i) {
			sites[i].remove();
		}
	},

	buildRoadsRoom: function (room) {
		var sources = room.find(FIND_SOURCES);
		var controller = room.controller;
		var spawns = room.find(FIND_MY_SPAWNS);
		var structures = sources.concat(spawns);
		structures.push(controller);
		console.log(room,"buildroads betwen",structures);
		for (var i = 0 ; i < structures.length ; i++ ){
			for (var j = 0 ; j < structures.length ; j++ ){
				if ( i != j) {
					this.buildRoad(structures[i], structures[j]);
				}
			}
		}

	}

};

module.exports = roadBuilder;

//
//var roadBuilder = require('road.builder');
//var from = Game.getObjectById("55db3176efa8e3fe66e04a52");  
//var to =  Game.getObjectById("55db3176efa8e3fe66e04a50");  
//roadBuilder.run( from, to );

