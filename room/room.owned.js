/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
"use strict";
var raceWorker = require("race.worker");
var roleBase = require("role.base");
var gc = require("gc");
/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module roomOwned
 */
var roomOwned = {

    calaculateSuplly: function (room){
        // OptimisticSupply = TotalEnergyHarvested * ( 1 - w/a)
        // a/w = Harvesters / TotalProductionUnits
        var genStats = room.memory.stats.generations;
        var supply = 0;
        var lastGen = genStats.length -1;
      //  console.log(room,"stats gen length",JSON.stringify(genStats[lastGen]));
        for (var g in genStats) {
            var TotalEnergyHarvested = genStats[g].energyHarvested;
            var TotalCreepProduction = genStats[g].creeps;
            var TotalHarvester = genStats[g].harvester;
            supply = supply +  TotalEnergyHarvested * (1 - TotalHarvester / TotalCreepProduction);
          //  console.log("Loop",g,"TEH",TotalEnergyHarvested,"TCP",TotalCreepProduction,"TH",TotalHarvester);
        }
        supply = supply / lastGen;
        if (!supply)
            supply = 0;
        return supply;
    },

    avProductionSupplyDistance: function (room) {
        // todo Add mechanism for weighting spawns and extensions by capacity.
        var source =  room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });
        if (source.length == 0) {
            source =  room.find(FIND_SOURCES);
        }
        var destinations =  room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return (object.structureType == STRUCTURE_SPAWN
                || object.structureType == STRUCTURE_EXTENSION);
            }
        });
       // console.log(room,"avProductionSupplyDistance",source,destinations);
        return this.avDistanceBetweenObjects(room, source, destinations) - gc.RANGE_TRANSFER;
    },

    avUpgradeDistance: function (room) {
        var source =  room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });
        if (source.length == 0) {
            source =  room.find(FIND_SOURCES);
        }
        // console.log(room,"avProductionSupplyDistance",source,room.controller.pos);
        return this.avDistanceFromObjects(room, source, room.controller.pos) - gc.RANGE_UPGRADE ;
    },

    avDistanceBetweenObjects: function (room, objArray1, objArray2) {
        var distance = 0;
        var journeys = 0;
        for ( var i in objArray1 ) {
            for ( var j in objArray2 ) {
                var path = room.findPath(objArray1[i].pos, objArray2[j].pos,  {
                    ignoreCreeps: true,
                    ignoreRoads: true,
                    ignoreDestructibleStructures: true});
                //   console.log("two points " + objArray1[i].pos + objArray2[j].pos);
                distance = distance + path.length;
                journeys = journeys + 1;
                  // console.log("avDistanceBetweenObjects path len " + path.length + " distance "
                 //           + distance + " journeys " + journeys);
            } //for ( var j in spawns )
        } //for ( var i in sources ) {
        return distance/journeys;
    },

    avDistanceBetween: function (room, findType1, findType2) {
        var distance = 0;
        var obj1s = room.find(findType1);
        if (obj1s.length > 0) {
            var obj2s = room.find(findType2);
            if (obj2s.length > 0) {
                return this.avDistanceBetweenObjects(room, obj1s, obj2s);
            }
        }
        return distance;
    },

    avDistanceFromObjects: function (room,objects,pos) {
        var distance = 0;
        var journeys = 0;
        for ( var i in objects ) {
            var path = room.findPath(objects[i].pos, pos, {
                ignoreCreeps: true,
                ignoreRoads: true,
                ignoreDestructibleStructures: true} );
            distance = distance + path.length;
            journeys = journeys + 1;
           // console.log("avDistanceForm path len" + path.length + " distance "
            //    + distance + " journeys " + journeys);
        } //  for ( var i in objs )
        return distance/journeys;
    },
    
    avDistanceForm: function (room, findType, pos2) {
        var distance = 0;
        var objs = room.find(findType);
        if (objs.length > 0) {
            var distance = 0;
            var journeys = 0;
            for ( var i in objs ) {
                var path = room.findPath(objs[i].pos, pos2, {
                        ignoreCreeps: true, 
                        ignoreRoads: true,
                        ignoreDestructibleStructures: true} );               
                distance = distance + path.length;
                journeys = journeys + 1;
               // console.log("avDistanceForm path len" + path.length + " distance "
               //     + distance + " journies " + journeys);
            } ///  for ( var i in objs )
            distance = distance/journeys;
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

    getConstructionLeft: function (room) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        var toGo = 0;
        for ( var site = 0 ; site < constructionSites.length ; site++ ) {
            toGo = toGo + constructionSites[site].progressTotal - constructionSites[site].progress;
          //  console.log("construciton left site", constructionSites[site],"progress",constructionSites[site].progress
         //   ,"total",constructionSites[site].progressTotal)
        }
        return toGo;
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
            case roleBase.Type.ENERGY_PORTER:
                return this.getUpgradeRondTripLength(room, force);
            case roleBase.Type.ROLE_FLEXI_STORAGE_PORTER:
                return this.getUpgradeRondTripLength(room, force);
            default:
                return this.getUpgradeRondTripLength(room, force);
        }
    },

    accessPointsType: function (room, findType, opts) {
        var sites = room.find(findType,opts);
        var accessPoints = 0;
        for ( var i = 0 ; i < sites.length ; i++ ) {
            accessPoints += this.countAccessPoints(room, sites[i].pos);
        }
        return accessPoints;
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
       // console.log("energyLifeTime loadtime",loadTime,"offloadTime",offloadTime,"roundTripTime",roundTripTime);
        
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

    countSiteAccess: function(room, roomObject)
    {
        var sites = room.find(roomObject);
        var countAcces = 0;
        for (var i in sites) {
            countAcces += this.countAccessPoints(room, sites[i].pos);
        }
        return countAcces;
    },
    
    sourceEnergyLT: function(room, source, workerHavestRate) {
        var access = this.countAccessPoints(room, source);
        return Math.min(access * workerHavestRate * CREEP_LIFE_TIME, 
               source.energyCapacity * CREEP_LIFE_TIME / ENERGY_REGEN_TIME);        
    },
    
    allSourcsEnergyLT: function(room, workerSize)
    {
        var havestableSourcEnergyLT = 0;
        var sources = room.find(FIND_SOURCES);
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
            var warTimeHavesters =  this.allSourcsEnergyLT(room, workerSize)
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
            var havestRate = 2 * workerSize;
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
            var havestRate = 2 * workerSize;                      
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER);
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
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
            var workerCost = raceWorker.BLOCKSIZE * workerSize;
            var hELT = this.energyLifeTime(room, workerSize, roleBase.Type.HARVESTER); 
            var havesters = this.constructHavesters(room, workerSize, force);      
            room.memory.consructBuilders = (( hELT / workerCost)-1 ) * havesters; 
        }   
        return room.memory.consructBuilders; 
    }


};

module.exports = roomOwned;




















