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
	
    buildRatio: 1.0,
	repairerRatio: 0.08,
	repairerThreshold: 5,
	havesterRation: 0.5,
	
	ROLE_HARVESTER: "harvester",
	ROLE_UPGRADER: "upgrader",
	ROLE_BUILDER: "builder",
	ROLE_REPAIRER: "repairer",
	ROLE_DEFULT: this.ROLE_HARVESTER,
	
	size: function(contolerLevel)
	{    
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
 * @function roomName
 * @param   {number} roomName  The index of the room in the Game.rooms hash.
 */
assignRoles: function(roomName) {
	    this.setUnrolledCreeps(this.ROLE_HARVESTER);
	    
	    var creepCount = Object.keys(Game.creeps).length;
	    //console.log("Creep count" + creepCount);
		
		//var havesters_needed = Math.ceil(creepCount * this.havesterRation);
		var havesters_needed = Math.ceil(Game.rooms[roomName].memory.eqlibHavesters); 
		
		var builders_needed = 0;
        var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);	       
        if (constructionSites.length) {
            builders_needed = Math.ceil(
                (creepCount - havesters_needed) * this.buildRatio); 
            builders_needed = Math.min(builders_needed, 2*constructionSites.length);
        }
        
        var repairers_needed=0;
  		var damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
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
	
	bodyWorker: function (cost) {
        var numBlocks = Math.floor(cost/this.blockSize);
        var body = [];
        for (i = 0; i < numBlocks; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        } // for
        return body;	    
	},
	
    /**
    * Spawn a worker creep
    * @function spawn
    * @param   {number} roomName  The index of the room in the Game.rooms hash.
    * @param   {number} spawnName  The index of the spawn at which to spawn the
    *   new creep.
    * @param   {number} The cost of the creep. Creep is generated as follows.
    *   number = Creates a creep that costs at least this ammount. Does not 
    *   spawn a creep if insufficent energy.
    *   undefined = Creats the biggist creep that can be spawned with the 
    *   room's current maximum energy capacity.  Does not spawn a creep if
    *   insufficent energy.
    */
	spawn: function(roomName, spawnName, cost) {
		//console.log("In spawn room Name is " + roomName + " spawn Name is " + spawnName);
		if (cost == undefined || cost == 0)
		{
		     cost = Game.rooms[roomName].energyCapacityAvailable;    
		}
		var body = this.bodyWorker(cost);
		var canDo = Game.spawns[spawnName].canCreateCreep(body)
		if (canDo != OK) {		    
		    console.log("Failed to create creep, error " + canDo);
            return canDo;   
		}			
		var result = Game.spawns[spawnName].createCreep(
		                    body, undefined, {role: this.ROLE_HARVESTER});  
		if  (_.isString(result)) {
		    console.log("New creep " + result + " is born");
		} else {
		    console.log("Failed to create creep, error " + result);    
		}
		return result;		
	}, // spawn	
	
	forceSpawn: function(spawnName) {
		//var energy = Game.rooms[roomName].energyAvailable; 
		//if  (energy > this.blockSize) {
			var newName = Game.spawns[spawnName].createCreep(
				[WORK, CARRY, MOVE] , undefined, {role: this.ROLE_HARVESTER});  
			console.log("New creep " + newName + " is born");			
		//}
	},
	//var raceWorker = require("race.worker");raceWorker.forceSpawn("Spawn1");
	//
	
	moveCreeps: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
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




































