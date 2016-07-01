/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
raceWorker = require("race.worker");
roomWar = require("room.war");
roleBase = require("role.base");
/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module roomOwned
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

    getBuilderRondTripLength: function (room, force) {
        return this.getHavestRoundTripLength(room, force);       
    },

    getRepairerRondTripLength: function (room, force) {
        return this.getUpgradeRondTripLength(room, force);       
    },


    roundTripLength: function(room,role,force) {
        switch (role) {
            case roleBase.Type.HARVESTER:
                return this.getHavestRoundTripLength(room, force);
            case roleBase.Type.UPGRADER:
                return this.getUpgradeRondTripLength(room, force);
            case roleBase.Type.BUILDER:
                return this.getBuilderRondTripLength(room, force);
            case roleBase.Type.REPAIRER:
                return this.getRepairerRondTripLength(room, force);
        }
    },
    
    countAccessPoints: function (room, pos)
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

    findAccesPoints: function (room, pos) {
        var accedssPoints = [];
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x+1, pos.y, room.name));
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y+1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x+1, pos.y+1, room.name));
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x+1, pos.y-1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x+1, pos.y-1, room.name));
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x-1, pos.y, room.name));
        }          
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y+1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x-1, pos.y+1, room.name));
        }         
        if (room.lookForAt(LOOK_TERRAIN, pos.x-1, pos.y-1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x-1, pos.y-1, room.name));
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x, pos.y+1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x, pos.y+1, room.name));
        }
        if (room.lookForAt(LOOK_TERRAIN, pos.x, pos.y-1) != "wall") {  
            accessPoints.push(room.RoomPosition(pos.x, pos.y-1, room.name));
        } 
        return accessPoints;  
    },

    energyLifeTime: function (room, workerSize, role) {
        if (workerSize === undefined) {
            workerSize =  raceWorker.size(room.controller.level);   
        }
        var loadTime = roleBase.LoadTime[role];
        var offloadTime = roleBase.OffloadTime[role];
        var roundTripTime = this.roundTripLength(room, role);
        
        var timePerTrip = loadTime + offloadTime + roundTripTime;
        var tripsPerLife = CREEP_LIFE_TIME / timePerTrip;
        var energyPerTrip = CARRY_CAPACITY * workerSize;     
        return energyPerTrip * tripsPerLife;
    },
    
    setWorkerSize: function(room, workerSize, force)  {
        if (workerSize === undefined) {
            if (room.memory.workerSize === undefined) {
                workerSize =  raceWorker.maxSize(raceWorker.LINKING_WORKERSIZE);
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
    
    sourceEnergyLT: function(room, source, workerHavestRate) {
        var access = this.countAccessPoints(room, source);
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


    allSourcesEnergy: function(room)
    {
        var havestableSourceEnergy = 0;
        var sources = room.find(FIND_SOURCES);
        for (var i in sources) {
            havestableSourceEnergy += sources[i].energyCapacity
        }
        return havestableSourceEnergy;
    },

    warTimeHavesters: function(room, workerSize, force)  {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        if (room.memory.warTimeHavesters === undefined || force == true)
        {   
            warTimeHavesters =  this.allSourcsEnergyLT(room, workerSize) 
                / this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
            room.memory.warTimeHavesters = warTimeHavesters;  
        }
        return room.memory.warTimeHavesters;        
    },
           
    peaceHavesters: function(room, workerSize, force) {
        //console.log("room",room,"workeSize",workerSize,"forse",force)
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        
        if (room.memory.peaceHavesters === undefined || force == true) {
            workerCost = raceWorker.BLOCKSIZE * workerSize;
            var havestRate = 2 * workerSize;
            hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
            var uELT = this.energyLifeTime(room, workerSize, roleBase.Type.UPGRADER);
            var sELT = this.allSourcsEnergyLT(room, workerSize);
            var wCost = workerCost;
            //console.log("In peaceHavesters selt ",sELT," helt ",hELT," uelt ",uELT," wcost ",wCost);
            room.memory.peaceHavesters
                = sELT / ( hELT + (uELT * hELT / wCost) - uELT );
        }
        //console.log("peaceHavesters",room.memory.peaceHavesters,"room" ,room,
        //            "workerSize", workerSize);
        return room.memory.peaceHavesters;
    },
    
    peaceUpgraders: function(room, workerSize, force) {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        if (room.memory.peaceUpgraders === undefined || force == true)
        {        
            if (workerSize == undefined) {               
                workerSize = raceWorker.maxSize(room.controller.level);
            }
            workerCost = raceWorker.BLOCKSIZE * workerSize;    
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);  
            var havesters = this.peaceHavesters(room, workerSize, force);
            room.memory.peaceUpgraders = (( hELT / workerCost)-1 ) * havesters; 
        }
        return room.memory.peaceUpgraders;            
    },    

    supportUpgraders: function(room, exrtraWorkers, sourceEnerghLT, workerSize, force) {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        if (room.memory.supportUpgraders === undefined || force == true)
        {        
            if (workerSize == undefined) {               
                workerSize = raceWorker.maxSize(room.controller.level);
            }
            workerCost = raceWorker.BLOCKSIZE * workerSize;    
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);  
            var havesters = this.supportHavesters(room, exrtraWorkers, sourceEnerghLT, workerSize, force);
            room.memory.supportUpgraders = (( hELT / workerCost)-1 ) * havesters - exrtraWorkers; 
        }
        return room.memory.supportUpgraders;            
    },   

    supportHavesters: function(room, exrtraWorkers, sourceEnerghLT, workerSize, force) {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        
        if (room.memory.supportHavesters === undefined || force == true)
        {        
            workerCost = raceWorker.BLOCKSIZE * workerSize;
            var havestRate = 2 * workerSize;                      
            hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
            var uELT = this.energyLifeTime(room, workerSize, roleBase.Type.UPGRADER);
            //var sELT = this.allSourcsEnergyLT(room, workerSize);
            var wCost = workerCost;
            room.memory.supportHavesters
                = (sourceEnerghLT + exrtraWorkers*uELT) / ( hELT + (uELT * hELT / wCost) - uELT );
               // = (sELT/2 + 2*uELT) / ( hELT + (uELT * hELT / wCost) - uELT );
        }
        return room.memory.supportHavesters; 
    },   

    workersSupportable: function(room, energy, workerSize, force) {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        if (room.memory.workersSupportable === undefined || force == true)
        {
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);  
            room.memory.workersSupportable = energy / workerCost - energy / hELT;
        }
        return room.memory.workersSupportable;
    },

    constructHavesters: function(room, workerSize, force)
    {
        //console.log("StartConstrutHarveser room",room,"workersize",workerSize,"fore",force);
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        
        if (room.memory.constructHavesters === undefined || force == true)
        {        
            workerCost = raceWorker.BLOCKSIZE * workerSize;
            var havestRate = 2 * workerSize;           
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
            var bELT = this.energyLifeTime(room, workerSize, roleBase.Type.BUILDER);
            var sELT = this.allSourcsEnergyLT(room, workerSize);
            var wCost = workerCost;
            //console.log("In constructHavesters selt",sELT,"helt",hELT,"wcost",wCost,"belt",bELT);
            room.memory.constructHavesters
                = sELT / ( hELT + (bELT * hELT / wCost) - bELT );
        }
        return room.memory.constructHavesters;   
    },

    constructBuilders: function(room, workerSize, force) {
        var force = this.setWorkerSize(room, workerSize, force);
        var workerSize = room.memory.workerSize;
        if (room.memory.consructBuilders === undefined || force == true)
        {        
            if (workerSize == undefined) {               
                workerSize = raceWorker.maxSize(room.controller.level);
            }
            workerCost = raceWorker.BLOCKSIZE * workerSize;    
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER); 
            var havesters = this.constructHavesters(room, workerSize, force);      
            room.memory.consructBuilders = (( hELT / workerCost)-1 ) * havesters; 
        }   
        return room.memory.consructBuilders; 
    }


};

module.exports = roomOwned;

// var roomOwned = require("room.owned"); roomOwned.getHavestRoundTripLength(Game.rooms["Spawn1"]);

//                var path = room.findPath(objs[i].pos, pos2, {ignoreCreeps: true, 
//                    ignoreRoads: true, ignoreDestructibleStructures: true} ); 

//





















