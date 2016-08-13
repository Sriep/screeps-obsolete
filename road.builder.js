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
    	var path = from.findPathTo(to, { ignoreCreeps: true, ignoreRoads: true});
		var room = Game.rooms[from.roomName];
    	for(var step in path) {	  
    		room.createConstructionSite(path[step].x, path[step].y, STRUCTURE_ROAD);
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
		var structures = room.find(FIND_MY_STRUCTURES, { filter: function (structure) {
											return structure.structureType == STRUCTURE_EXTRACTOR
												|| structure.structureType ==  STRUCTURE_STORAGE
												|| structure.structureType ==  STRUCTURE_EXTRACTOR }
		});
		sources.concat(spawns);
		structures.push(controller);

		console.log(room,"buildroads betwen",structures);
		for (var i = 0 ; i < structures.length ; i++ ){
			for (var j = 0 ; j < structures.length ; j++ ){
				if ( i != j) {
					this.buildRoad(structures[i].pos, structures[j].pos);
				}
			}
		}
	}
};

module.exports = roadBuilder;

