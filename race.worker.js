/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * for use by worker creeps. 
 * @author Piers Shepperson
 */
 
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roadBuilder = require("road.builder");
//var roomOwnded = require("room.owned");
var roomController = require("room.controller");

/**
 * Data and functions used by all workers.
 * Workers are used to carry stuff around, and are made up of 
 * WORK, MOVE and CARRY parts. They can have various roles depening on
 * what they are carrying and where to and from.
 * @module raceWorker
 */
var raceWorker = {
    
    /**
    * The energy cost of a block of parts. [ WORK, CARRY, MOVE ]. 
    * A Worker creep is constructed from multiple copies of these blocks. 
    * @constant
    */
    blockSize: 100 + 50 + 50,
    BLOCKSIZE: 100 + 50 + 50,
	
    buildRatio: 1.0,
	repairerRatio: 0.08,
	repairerThreshold: 5,
	havesterRation: 0.5,
	
	ROLE_HARVESTER: "harvester",
	ROLE_UPGRADER: "upgrader",
	ROLE_BUILDER: "builder",
	ROLE_REPAIRER: "repairer",
	ROLE_DEFULT: this.ROLE_HARVESTER,
	
	maxSize: function(contolerLevel) {    
	    return  Math.floor(roomController.maxProduction[contolerLevel] / this.blockSize);
	},	
	
	switchRoles: function(delta1, delta2, role1, role2) {
        var deltaChange = 0;
	    if (delta1 > 0 && delta2 < 0) {
            deltaChange = Math.min(delta1, -1*delta2);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role2); 
            for (var i = 0; i < deltaChange; i++)   {
                if (creeps[i] !== undefined) {
                    creeps[i].memory.role = role1;   
                } else {
                     console.log("Undefined creep delta1" + delta1 + " delta2 " 
                         + delta2 + " role1 " + role1 + " role2 " + role2 + " i " + i);     
                }
            }
	    } else if (delta2 > 0 && delta1 < 0) {
            deltaChange = Math.min(delta2, -1*delta1);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role1); 
            for (var i = 0; i < deltaChange; i++)   {
                if (creeps[i] !== undefined) {
                    creeps[i].memory.role = role2; 
                } else {
                     console.log("Undefined creep delta1" + delta1 + " delta2 " 
                         + delta2 + " role1 " + role1 + " role2 " + role2 + " i " + i);     
                }
            }
            deltaChange = -1*deltaChange;
        }
        return deltaChange;
	},
	
	setUnrolledCreeps: function(role)
	{
	    for(var name in Game.creeps) {
            if(Game.creeps[name].memory.role === undefined ) {
                Game.creeps[name].memory.role = this.ROLE_HARVESTER;
            }
        }
	},
	
    
/**
 * Assigns roles to all the creeps in a room.
 * @function assignRoles
 * @param   {number} roomName  The index of the room in the Game.rooms hash.
 */
assignRoles: function(room) {
    //var room = Game.rooms[roomName];
    this.setUnrolledCreeps(this.ROLE_HARVESTER);
    var roomOwned = require("room.owned");
    var creepCount = Object.keys(Game.creeps).length;
    var havesters_needed;
    if (room.memory.state == roomOwned.GameState.WAR)
    {
        havesters_needed = roomOwned.warTimeHavesters(room);
    } else {
        havesters_needed = roomOwned.eqlibHavesters(room);
    }
    havesters_needed = Math.min(havesters_needed, creepCount);
    console.log("In assignRoles equlibriumHavesters" , havesters_needed );
    havesters_needed = Math.ceil(havesters_needed); 
    console.log("In assignRoles havesters_needed" , havesters_needed );
    //havesters_needed = 3;

    var builders_needed = 0;
    var constructionSites = room.find(FIND_CONSTRUCTION_SITES);	       
    if (constructionSites.length) {
        builders_needed = Math.ceil(
            (creepCount - havesters_needed) * this.buildRatio); 
        builders_needed = Math.min(builders_needed, 2*constructionSites.length);
    }

    var repairers_needed=0;
    var damagedStructures = room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
    });	
    if (damagedStructures.length && creepCount >= this.repairerThreshold) {
        repairers_needed = Math.ceil( 
            (creepCount - havesters_needed)  * this.repairerRatio);
        builders_needed = Math.max(0, builders_needed - repairers_needed);
    }

    var upgraders_needed = creepCount - havesters_needed - builders_needed - repairers_needed;

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_HARVESTER);	
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_BUILDER);	 		
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_REPAIRER); 
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_UPGRADER);
    var dHavesters = havesters_needed - harvesters.length;
    var dBuilders = builders_needed - builders.length;
    var dRepairers = repairers_needed - repairers.length;
    var dUpgraders = upgraders_needed - upgraders.length;

    console.log("Harvesters: " + harvesters.length + " delta " + dHavesters);
    console.log("Upgraders: " + upgraders.length + " delta " + dUpgraders);
    console.log("Builders: " + builders.length + " delta " + dBuilders);
    console.log("Repairers: " + repairers.length + " delta " + dRepairers);
    //console.log("About to call swithc Rols " , "role1" + this.HARVESTER + "role2" + this.HARVESTER);
        if (dHavesters != 0)
        {        
            delta = this.switchRoles(dHavesters, dUpgraders, this.ROLE_HARVESTER, this.ROLE_UPGRADER);
            dHavesters = dHavesters + delta;
            dUpgraders = dUpgraders - delta;
        }
        if (dHavesters != 0)
        {
            delta = this.switchRoles(dHavesters, dBuilders, this.ROLE_HARVESTER, this.ROLE_BUILDER);
            dHavesters = dHavesters + delta;
            dBuilders = dBuilders - delta;
        }
        if (dHavesters != 0)
        {
            delta = this.switchRoles(dHavesters, dRepairers, this.ROLE_HARVESTER, this.ROLE_REPAIRER);
            dHavesters = dHavesters + delta;
            dRepairers = dRepairers - delta;
        }

        if (dBuilders != 0)
        {
            delta = this.switchRoles(dBuilders, dUpgraders, this.ROLE_BUILDER, this.ROLE_UPGRADER);
            dBuilders = dBuilders + delta;
            dUpgraders = dUpgraders - delta;
        }
        if (dBuilders != 0)
        {
            delta = this.switchRoles(dBuilders, dRepairers, this.ROLE_BUILDER, this.ROLE_REPAIRER);
            dBuilders = dBuilders + delta;
            dRepairers = dRepairers - delta;
        }

        if (dRepairers != 0)
        {
            delta = this.switchRoles(dRepairers, dUpgraders, this.ROLE_REPAIRER, this.ROLE_UPGRADER);
            dRepairers = dRepairers + delta;
            dUpgraders = dUpgraders - delta;
        }
    },
	/*
    bodyWorker: function (cost) {
        var numBlocks = Math.ceil(cost/this.blockSize);
        var body = [];
        for (i = 0; i < numBlocks; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        } // for
        return body;	    
    },*/
    body: function (cost) {
        var numBlocks = Math.ceil(cost/this.BLOCKSIZE);
        var body = [];
        for (i = 0; i < numBlocks; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        } // for
        return body;	    
    },

    biggistSpawnable: function(room) {
        cost = room.energyCapacityAvailable;  
        cost = Math.floor(cost/this.blockSize) * this.blockSize;	     
        return cost;
    },

    spawnFromName(roomName, spawnName, wokerSize) {
        spawns = currentRoom.find(FIND_MY_SPAWNS);
        spawn(Game.rooms[roomName], spawns[spawnName], workerSize);
    },
    //var raceWorker = require("race.worker");   raceWorker.spawnFromName("W26S21", "Spawn1");  
    /**
    * Spawn a worker creep. 
    * @function spawn
    * @param   {number} roomName  The index of the room in the Game.rooms hash.
    * @param   {number} spawnName  The index of the spawn at which to spawn the
    *   new creep.
    * @param   {number} cost The cost of the creep. 
    *   <ul>
    *   <li> number = Creates a creep that costs at least this ammount. 
    *   <li> undefined = Creats the biggist creep that can be spawned with the 
    *   room's current energy.  
    *   </ul>
    * @description    
    * @returns {Number}  <a href="http://support.screeps.com/hc/en-us/articles/203084991-API-Reference">
    *   Screeps error code.</a>   
    * @example 
    *   // Create the biggest worker currently possable.  
    *   var raceWorker = require("race.worker");
    *   raceWorker.spawnWorker("W26S21", "Spawn1");        
    */
	spawn: function(room, spawn, workerSize) {	
        
	    if (workerSize == undefined) {
		     cost = room.energyAvailable;
		} else {
		    cost = this.blockSize * workerSize;
		}
		var body = this.body(cost);
		var canDo = spawn.canCreateCreep(body)
		if (canDo != OK) {		    
            return canDo;   
		}			
		var result = spawn.createCreep(
		                    body, undefined, {role: this.ROLE_HARVESTER});  
		if  (_.isString(result)) {
		    console.log("New creep " + result + " is born");
		} else {
		}
		return result;		
	}, // spawn	
	
	forceSpawn: function(spawn) {
		//var energy = Game.rooms[roomName].energyAvailable; 
		//if  (energy > this.blockSize) {
			var newName = spawn.createCreep(
				[WORK, CARRY, MOVE] , undefined, {role: this.ROLE_HARVESTER});  
			console.log("New creep " + newName + " is born");			
		//}
	},
	//var raceWorker = require("race.worker");raceWorker.forceSpawn("Spawn1");
	//
	
	moveCreeps: function(room) {
        var creeps = room.find(FIND_MY_CREEPS);
        for(var id in creeps) {
            var creep = creeps[id];
            if (creep.memory.role == raceWorker.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            } else if (creep.memory.role == raceWorker.ROLE_UPGRADER) {
                roleUpgrader.run(creep);               
            } else if (creep.memory.role == raceWorker.ROLE_BUILDER) {
                roleBuilder.run(creep);
            } else if(creep.memory.role == raceWorker.ROLE_REPAIRER) {
                roleRepairer.run(creep);
            }       
        }     
	}
	
}

module.exports = raceWorker;




































