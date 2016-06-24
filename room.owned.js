/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
 
 var raceWorker = require("race.worker");
 
/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module raceWorker
 */
var roomOwned = {    
    avDistanceBetween: function (room, obj1, obj2) {
        console.log("In avDistanceBetween");
        var distance = 0;
        obj1s = room.find(obj1);
        if (obj1s.length > 0) {
            obj2s  = room.find(obj2);
            if (obj2s.length > 0) {
                var distance = 0;
                var journies = 0;
                for ( var i in obj1s ) {
                    for ( var j in obj2s ) {
                        var path = room.findPath(obj1s[i].pos, obj2s[j].pos,  {
                                ignoreCreeps: true, 
                                ignoreRoads: true,
                                ignoreDestructibleStructures: true});
                        console.log("two points " + obj1s[i].pos + obj2s[j].pos);
                        distance = distance + path.length;
                        journies = journies + 1;
                        console.log("avDistanceBetween path len " + path.length + " distance " 
                                + distance + " journies " + journies);
                    } //for ( var j in spawns )
                } //for ( var i in sources ) {
                distance = distance/journies; 
            } // if (spawns.length > 0)                
        } // if (sources.length > 0)
        return distance;
    },
    
    avDistanceForm: function (room, obj1, pos2) {
        var distance = 0;
        objs = room.find(obj1);
        if (objs.length > 0) {
            var distance = 0;
            var journies = 0;
            for ( var i in objs ) {
                var path = room.findPath(objs[i].pos, pos2, {
                        ignoreCreeps: true, 
                        ignoreRoads: true,
                        ignoreDestructibleStructures: true} );               
                distance = distance + path.length;
                journies = journies + 1;    
                //console.log("avDistanceForm path len" + path.length + " distance " 
                //    + distance + " journies " + journies);
            } //  for ( var i in objs )  
            distance = distance/journies; 
        } // if (sources.length > 0)  
        return distance;
    },
    
    getHavestRoundTripLength: function (room, force) {     
        if (room.memory.havestTrip === undefined || force == true)
        {
            room.memory.havestTrip = 2 * 
                this.avDistanceBetween(room, FIND_SOURCES, FIND_MY_SPAWNS);
        } 
        return  room.memory.havestTrip;             
    },
    
    getUpgradeRondTripLength: function (room, force) {
        if (room.memory.upgradeTrip === undefined || force == true)
        {
            room.memory.upgradeTrip = 2 
                * this.avDistanceForm(room, FIND_SOURCES, room.controller.pos);
        } 
        return  room.memory.upgradeTrip;        
    },
    
    accessPoints: function (room, pos)
    {
        var accessPoints = 0;            
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y) != "wall") {  
            accessPoints = accessPoints+1;
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y+1) != "wall") {  
            accessPoints = accessPoints+1;
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y-1) != "wall") {  
            accessPoints = accessPoints+1;
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y) != "wall") {  
            accessPoints = accessPoints+1;
        }          
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y+1) != "wall") {  
            accessPoints = accessPoints+1;
        }         
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y-1) != "wall") {  
            accessPoints = accessPoints+1;
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x, pos.y+1) != "wall") {  
            accessPoints = accessPoints+1;
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x, pos.y-1) != "wall") {  
            accessPoints = accessPoints+1;
        } 
        return accessPoints;  
    },
    
    sourceEnergyLT: function(room, source, workerHavestRate) {
        //console.log("source " + source);
        var access = this.accessPoints(room, source);
        //console.log("sourceEnergyLT acesss " + access + " workerHavestRate " 
        //    + workerHavestRate + " source.energyCapacity " + source.energyCapacity +
        //    " ENERGY_REGEN_TIME " + ENERGY_REGEN_TIME);
        return Math.min(access * workerHavestRate * CREEP_LIFE_TIME, 
               source.energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME);        
    },
    
    havesterEenegyLT: function(room) {
        var loadTime = 25;
        var offloadTime = 1;
        var roundTripTime = this.getHavestRoundTripLength(room);
        
        var timePerTrip = loadTime + offloadTime + roundTripTime;
        var tripsPerLife = 1500 / timePerTrip;
        var energyPerTrip = 50 * raceWorker.size(room.controller.level);
        
        return energyPerTrip * tripsPerLife;
    },
     
    uplgraderEenegyLT: function(room) {
        var loadTime = 25;
        var offloadTime = 50;
        var roundTripTime = this.getUpgradeRondTripLength(room);
        
        var timePerTrip = loadTime + offloadTime + roundTripTime;
        var tripsPerLife = 1500 / timePerTrip;
        var energyPerTrip = 50 * raceWorker.size(room.controller.level);
        
        return energyPerTrip * tripsPerLife;
    },
    
    eqlibHavesters: function(room, force)
    {
        if (room.memory.eqlibHavesters === undefined || force == true)
        {        
            var havestRate = 2 * raceWorker.size(room.controller.level); 
            var workerCost = 100 * havestRate;
            var havestableSourcEnergyLT = 0;
            sources = room.find(FIND_SOURCES);
            for (var i in sources) {                
                havestableSourcEnergyLT = havestableSourcEnergyLT 
                    + this.sourceEnergyLT(room, sources[i], havestRate);
            }
            var hELT = this.havesterEenegyLT(room);
            var uELT = this.uplgraderEenegyLT(room);
            var sELT = havestableSourcEnergyLT;
            var wCost = workerCost;
            //console.log("eqlibHavesters sELT "+sELT+" hELT "+hELT+" uELT " + uELT 
            //    + " wCost " + wCost);  
            room.memory.eqlibHavesters
                = sELT / ( hELT + (uELT * hELT / wCost) - uELT );
        }
        return room.memory.eqlibHavesters; 
    },
    
    equlibUpgraders: function(room, force)
    {
        if (room.memory.eqlibUpgraders === undefined || force == true)
        {        
            var workerCost = 200 * raceWorker.size(room.controller.level); 
            var hELT = this.havesterEenegyLT(room);
            var havesters = this.eqlibHavesters(room, force);
            //console.log("equlibUpgraders havesters "+havesters + " hELT " + hELT 
            //    + " workerCost " + workerCost);
            room.memory.eqlibUpgraders = (( hELT / workerCost)-1 ) * havesters; 
        }
        return room.memory.eqlibUpgraders;            
    }
    
};

module.exports = roomOwned;

// var roomOwned = require("room.owned"); roomOwned.getHavestRoundTripLength(Game.rooms["Spawn1"]);

//                var path = room.findPath(objs[i].pos, pos2, {ignoreCreeps: true, 
//                    ignoreRoads: true, ignoreDestructibleStructures: true} ); 

//





















