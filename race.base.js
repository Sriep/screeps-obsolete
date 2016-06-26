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

//raceWorker: required("race.worker"),
//raceWarrior: required("race.warrior",)

spawn: function(race, room, spawn, workerSize) {	
    if (workerSize == undefined) {
        cost = room.energyAvailable;
        cost = Math.floor(cost/race.BLOCKSIZE);
    } else {
        cost = race.BLOCKSIZE * workerSize;
    }
    //console.log("In base.spawn cost", cost,"workersize", workerSize);
    var body = race.body(cost);
    //console.log("In racebase.spawn body is", body);
    var canDo = spawn.canCreateCreep(body)
    if (canDo != OK) {		    
        return canDo;   
    }			
    var result = spawn.createCreep(
                        body, undefined, {role: this.ROLE_HARVESTER});  
    //console.log("In base spawn body is", body, "return is ", result);                        
    if  (_.isString(result)) {
        console.log("New creep " + result + " is born");
    } 
    return result;		
}, // spawn	


/*
spawn: function(room, spawnName)
{
    if (room.memory.state == roomOwned.GameState.WAR)
    {
        raceWorker.spawn(room, spawnName,raceWorker.biggistSpawnable(room));
    } else {
        raceWorker.spawn(room, spawnName,raceWorker.biggistSpawnable(room));
    }
},*/

}

module.exports = raceBase;