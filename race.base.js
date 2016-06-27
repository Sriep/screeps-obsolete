/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for use by my creeps. 
 * @author Piers Shepperson
 */
 
var roomOwned = require("room.owned"); 
var raceWorker = require("race.worker"); 
/**
 * Abstract base object containing data and functions for use by my creeps.
 * This contains data and functions common to all races of creep. 
 * @module raceBase
 */
var raceBase = {

    spawn: function(race, room, spawn, creepSize) {	
        console.log("start base spaen workerSize", race, room, spawn, creepSize);
        if (creepSize == undefined) {
            cost = room.energyAvailable;
            cost = Math.floor(cost/race.BLOCKSIZE);
        } else {
            cost = race.BLOCKSIZE * creepSize;
        }
        //console.log("In base.spawn cost", cost,"workersize", workerSize);
        var body = race.body(cost);
        //console.log("In racebase.spawn body is", body);
        var canDo = spawn.canCreateCreep(body)
        if (canDo != OK) {		    
            return canDo;   
        }			
        var result = spawn.createCreep(
                            body, undefined, {role: race.ROLE_DEFULT});  
        //console.log("In base spawn body is", body, "return is ", result);                        
        if  (_.isString(result)) {
            console.log("New creep " + result + " is born");
        } 
        return result;		
    }, // spawn	

    countBodyParts: function(creeps, part) {
        var count = 0;
        for (var i in creeps) {
            count = count + creeps[i].getActiveBodyparts(part);
        }
        return count;
    }



}

module.exports = raceBase;