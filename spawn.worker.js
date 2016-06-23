/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var spawnWorker = {
	blockSize: 50 + 100 +50,	
	
    
	/** @param {crole, roomName, spawnName, threshold} creep **/
    run: function( crole, roomName, spawnName, threshold) {
    	console.log("Threshold: " + threshold + " room name: " 
    		+ roomName + " spawn name : " + spawnName);
    	
    	energyBiggestCreep = Math.floor(
    		Game.rooms[roomName].energyCapacityAvailable / this.blockSize) 
    		* this.blockSize
    	energy = Game.rooms[roomName].energyAvailable;  
    	
    	console.log("avaliabelEnergy: " + energy 
    		+ " capacity: " + Game.rooms[roomName].energyCapacityAvailable 
    		+ "enefgty biggest creep: " + energyBiggestCreep
    		+ " blockszie: " + this.blockSize); 
    	
    	if ( energy >= this.blockSize )
    	{
    		if ( energy >= threshold * Game.rooms[roomName].energyCapacityAvailable 
        		|| energy >= energyBiggestCreep)
        	{   	
    			var numBlocks = Math.floor(energy/this.blockSize);
    			var body = [];
    			for (i = 0; i < numBlocks; i++) {
    				body.push(WORK);
    				body.push(CARRY);
    				body.push(MOVE);
    			} // for   			
    			var newName = Game.spawns[spawnName].createCreep(body, undefined, {role: crole});
    			
    			console.log('Spawning new worker: ' + newName + " role " + crole 
    				+ " numBlocks: " + numBlocks + " body: " + body);
    		} // if
    	} // if
    } //function
};

module.exports = spawnWorker;