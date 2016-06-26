/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
raceWorker = require("race.worker");
roomWar = require("room.war");
/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module raceWorker
 */
var roomOwned = {  
    
    GameState: {
        PEACE: "peace",
        CONSTRUCTION: "production",
        WAR: "war",
    },
    
    newTickUpdate: function(room) {
        if (roomWar.enterWareState(room)) {
            room.memory.state = this.GameState.WAR;
        } else {
            room.memory.state =  this.GameState.PEACE;  
        }         
    },
    
    peaceLoop: function(room) {
        raceWorker.spawn(room.name, "Spawn1", 6);
        raceWorker.assignRoles(room.name);			        
    },

    //enemyCreeps: function(room) {
    //    return hostiles = room.find(FIND_HOSTILE_CREEPS); 
    //},
     
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
    
    
    havesterEenegyLT: function(room, workerSize) { 
        if (workerSize === undefined) {
            workerSize =  raceWorker.maxSize(room.controller.level);   
        }
        var loadTime = 25;
        var offloadTime = 1;
        var roundTripTime = this.getHavestRoundTripLength(room);
        
        var timePerTrip = loadTime + offloadTime + roundTripTime;
        var tripsPerLife = 1500 / timePerTrip;
        var energyPerTrip = 50 * workerSize; 
        return energyPerTrip * tripsPerLife;
    },
     
    uplgraderEenegyLT: function(room, workerSize) {
        if (workerSize === undefined) {
            workerSize =  raceWorker.size(room.controller.level);   
        }
        var loadTime = 25;
        var offloadTime = 50;
        var roundTripTime = this.getUpgradeRondTripLength(room);
        
        var timePerTrip = loadTime + offloadTime + roundTripTime;
        var tripsPerLife = 1500 / timePerTrip;
        var energyPerTrip = 50 * workerSize;
        return energyPerTrip * tripsPerLife;
    },
    
    setWorkerSize: function(room, workerSize, force)  {
        if (workerSize === undefined) {
            if (room.memory.workerSize === undefined) {
                workerSize =  raceWorker.maxSize(room.controller.level);
                force = true;
            } else {
                workerSize = room.memory.workerSize;
            }               
        } else {
            if (workerSize != room.memory.workerSize) {
                force = true;
            }
        }
        room.memory.workerSize = workerSize;   
        return force;
    },
    //var roomOwned = require("room.owned"); roomOwned.setWorkerSize()
    
    warTimeHavesters: function(room, workerSize, force)  {
        force = this.setWorkerSize(room, workerSize, force);
        workerSize = room.memory.workerSize;  
        if (room.memory.warTimeHavesters === undefined || force == true)
        {   
            warTimeHavesters =  this.allSourcsEnergyLT(room, workerSize) 
                                / this.havesterEenegyLT(room, workerSize); 
            room.memory.warTimeHavesters = warTimeHavesters;  
        }
        return room.memory.warTimeHavesters;        
    },
    
    sourceEnergyLT: function(room, source, workerHavestRate) {
        var access = this.accessPoints(room, source);
        return Math.min(access * workerHavestRate * CREEP_LIFE_TIME, 
               source.energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME);        
    },
    
    allSourcsEnergyLT: function(room, workerSize)
    {
        var havestableSourcEnergyLT = 0;
        sources = room.find(FIND_SOURCES);
        for (var i in sources) {                
            havestableSourcEnergyLT = havestableSourcEnergyLT 
                + this.sourceEnergyLT(room, sources[i], 2 * workerSize);
        }   
        return havestableSourcEnergyLT;
    },
           
    eqlibHavesters: function(room, workerSize, force) {
        force = this.setWorkerSize(room, workerSize, force);
        workerSize = room.memory.workerSize;  
        
        if (room.memory.eqlibHavesters === undefined || force == true)
        {        
            workerCost = 200 * workerSize;
            var havestRate = 2 * workerSize;           
            var hELT = this.havesterEenegyLT(room, workerSize);
            var uELT = this.uplgraderEenegyLT(room, workerSize);
            var sELT = this.allSourcsEnergyLT(room, workerSize);
            var wCost = workerCost;
            room.memory.eqlibHavesters
                = sELT / ( hELT + (uELT * hELT / wCost) - uELT );
        }
        return room.memory.eqlibHavesters; 
    },    
    
    equlibUpgraders: function(room, workerSize, force) {
        force = this.setWorkerSize(room, workerSize, force);
        workerSize = room.memory.workerSize;  
        if (room.memory.eqlibUpgraders === undefined || force == true)
        {        
            if (workerSize == undefined) {               
                workerSize = raceWorker.maxSize(room.controller.level);
            }
            workerCost = 200 * workerSize;    
            var hELT = this.havesterEenegyLT(room, workerSize);   
            var havesters = this.eqlibHavesters(room, workerSize, force);
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





















