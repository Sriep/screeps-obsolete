/* Piers Shepperson
 *
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var raceWorker = {
    blockSize: 50 + 100 + 50,
	
	repairerRatio: 0.1,
	repairerThreshold: 3,
	havesterRation: 0.5,
	
	ROLE_HARVESTER: "harvester",
	ROLE_UPGRADER: "upgrader",
	ROLE_BUILDER: "builder",
	ROLE_REPAIRER: "repairer",
	ROLE_DEFULT: this.ROLE_HARVESTER,
	
	switchRoles: function(delta1, delta2, role1, role2) {
        //console.log("Start of swich Roles " + " deta1 " + delta1 + " deta2 " + delta2 
        //    + " role1 " + role1 + " role2 " + role2);	    
        var deltaChange = 0;
	    if (delta1 > 0 && delta2 < 0) {
            deltaChange = Math.min(delta1, -1*delta2);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role2); 
            for (var i = 0; i < deltaChange; i++)   {
                creeps[i].memory.role = role1;   
                //console.log("Changed " + creeps[i].name + "'s role " + creeps[i]);
            }
	    } else if (delta2 > 0 && delta1 < 0) {
            deltaChange = Math.min(delta2, -1*delta1);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role1); 
            for (var i = 0; i < deltaChange; i++)   {
                creeps[i].memory.role = role2; 
                //console.log("Changed " + creeps[i].name + "'s role " + creeps[i]);
            }
            deltaChange = -1*deltaChange;
        }
        //console.log("In swich Roles " + " deta1 " + delta1 + " deta2 " + delta2 
       //     + " role1 " + role1 + " role2 " + role2);
        return deltaChange;
	},
	
	setUnrolledCreeps: function(role)
	{
	    for(var name in Memory.creeps) {
            if(Game.creeps[name].memory.role === undefined ) {
                Game.creeps[name].memory.role = this.ROLE_HARVESTER;
            }
        }
	},
	
	assignRoles: function(roomName) {
	    this.setUnrolledCreeps(this.ROLE_HARVESTER);
	    
	    var creepCount = Object.keys(Game.creeps).length;
	    //console.log("Creep count" + creepCount);
		
		var havesters_needed = Math.ceil(creepCount * this.havesterRation);
		
		var builders_needed = 0;
        var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);	
        
        if (constructionSites.length) {
            builders_needed = creepCount - havesters_needed;     
        }

        
        var repairers_needed=0;
  		var damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
            		filter: object => object.hits < object.hitsMax
        });	
        if (damagedStructures.length && creepCount >= this.repairerThreshold) {
            repairers_needed = Math.ceil(( creepCount - havesters_needed)  * this.repairerRatio);
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

	    /*console.log("havesters_neededt " + havesters_needed 
	        + " builders_needed " + builders_needed 
	        +  " repairers_needed " + repairers_needed 
	        + " upgraders_needed " + upgraders_needed );
	    console.log("harvesters.length " + harvesters.length 
	        + " builders.length " + builders.length 
	        +  " repairers.length " + repairers.length 
	        + " upgraders.length " + upgraders.length);*/
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

		
		/*DEBUG code for console
		var creepCount = Object.keys(Game.creeps).length;
	    console.log("Creep count" + creepCount);
		var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_REPAIRER); 
		var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_BUILDER);	 
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_HARVESTER);
		var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_UPGRADER);
		console.log("Harvesters: " + harvesters.length + " delta " + dHavesters);
		console.log("Upgraders: " + upgraders.length + " delta " + dUpgraders);
		console.log("Builders: " + builders.length + " delta " + dBuilders);
		console.log("Repairers: " + repairers.length + " delta " + dRepairers);*/
	},
	
	/** @param {cpuLoad, roomName, spawnName}  **/
	spawn: function(roomName, spawnName) {
		console.log("In spawn room Name is " + roomName + " spawn Name is " + spawnName);
		var energy = Game.rooms[roomName].energyAvailable; 
		if  (energy < this.blockSize) {
			return;
		}
		
		var capacity = Game.rooms[roomName].energyCapacityAvailable; 
		var numBlocks = Math.floor(capacity / this.blockSize);
    	var biggestCreep = this.blockSize * numBlocks;
    	if ( energy >= biggestCreep ) {
			var numBlocks = Math.floor(energy/this.blockSize);
			var body = [];
			for (i = 0; i < numBlocks; i++) {
				body.push(WORK);
				body.push(CARRY);
				body.push(MOVE);
			} // for   			
			var newName = Game.spawns[spawnName].createCreep(
				body, undefined, {role: this.ROLE_HARVESTER});  
			console.log("New creep " + newName + " is born");
    	} // if ( energy >= biggestCreep ) 				
	}, // spawn	
	
	forceSpawn: function(spawnName) {
		//var energy = Game.rooms[roomName].energyAvailable; 
		//if  (energy > this.blockSize) {
			var newName = Game.spawns[spawnName].createCreep(
				[WORK, CARRY, MOVE] , undefined, {role: this.ROLE_HARVESTER});  
			console.log("New creep " + newName + " is born");			
		//}
	}
	//var raceWorker = require("race.worker");
	//raceWorker.forceSpawn("Spawn1");
	
}

module.exports = raceWorker;




































