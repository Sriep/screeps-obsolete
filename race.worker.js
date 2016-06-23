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
	maxCpuLoad: 0.7,	
	havesterThreshold: 0.4,
	builderRatio: 0.5,
	repairerRatio: 0.1,
	
	HARVESTER: "harvester",
	UPGRADER: "upgrader",
	BUILDER: "builder",
	REPAIRER: "repairer",

	stopSawning: function(cpuLoad) {
		return 	cpuLoad > this.maxCpuLoad;
	},
	
	energyAtCapacity: function(roomName) {
	    return Game.rooms[roomName].energyAvailable 
	            == Game.rooms[roomName].energyCapacityAvailable; 
	},
	
	assingCpuOverload: function(roomName) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.HARVESTER);
        console.log("Harvesters: " + harvesters);
        if (harvesters.length) {
            for(var creep in harvesters) {
                harvesters[creep].memory.role = this.UPGRADER;
            }	         
        } // (harvesters.length)
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.BUILDER);	 
        var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);	
        console.log("Construction sites: " + constructionSites.length);
        console.log("Builders: " + builders);
        if (constructionSites.length == 0) {        
            for(var creep in builders) {
                builders[creep].memory.role = this.UPGRADER;
            }  
        } else {               
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.UPGRADER);
            console.log("Upgraders: " + upgraders);
            var numCreeps = builders.length + upgraders.length;
            var reqBuilders = Math.floor(numCreeps * this.builderRatio);
            if ( reqBuilders > builders.length ) {
                numNewBuilders = reqBuilders - builders.length;
                for (var i = 0; i < numNewBuilders; i++)   {
                    upgraders[i].memory.role = this.BUILDER;    
                }
            } else if (builders.length > reqBuilders) {
                numNewUpgraders =  builders.length - reqBuilders;
                for (var i = 0; i < numNewUpgraders; i++)   {
                    builders[i].memory.role = this.UPGRADER;    
                }               
            } // ( reqBuilders > numBuilders )
        } //(constructionSites.length == 0)        
    },
	
	assignCpuLoadHigh: function(roomName) {
	    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.BUILDER);	 
        var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);	
        console.log("Construction sites: " + constructionSites.length);
        console.log("Builders: " + builders);
        if (constructionSites.length == 0) {        
            for(var creep in builders) {
                builders[creep].memory.role = this.UPGRADER;
            }  
        } else {
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.HARVESTER);
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.UPGRADER);
            console.log("Harvesters: " + harvesters);
            console.log("Upgraders: " + upgraders);
            var numCreeps = builders.length + harvesters.length; + upgraders.length;
            var reqBuilders = Math.floor(numCreeps * this.builderRatio);
            if ( reqBuilders > builders.length ) {
                numNewBuilders = reqBuilders - builders.length;
                var looseUpgraders = 0;
                var looseHavesters = 0;
                if (numNewBuilders < upgraders.length)
                {
                    for (var i = 0; i < numNewBuilders; i++)   {
                        upgraders[i].memory.role = this.BUILDER;    
                    }
                } else {
                    for (var i = 0; i < upgraders.length; i++)   {
                        upgraders[i].memory.role = this.BUILDER;    
                    }                
                    looseHavesters = numNewBuilders - upgraders.length;
                    for (var i = 0; i < looseHavesters; i++)   {
                        upgraders[i].memory.role = this.BUILDER;    
                    }  
                } // (numNewBuilders < upgraders.length)
            } else if (builders.length > reqBuilders) {
                numNewUpgraders =  builders.length - reqBuilders;
                for (var i = 0; i < numNewUpgraders; i++)   {
                    builders[i].memory.role = this.UPGRADER;    
                }               
            } // ( reqBuilders > numBuilders )                       
        }	    
	},
	
	assignCpuLoadLow: function(roomName) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.UPGRADER);
        console.log("Upgraders: " + upgraders);
        if (upgraders.length) {
            for(var creep in upgraders) {
                upgraders[creep].memory.role = this.HARVESTER;
            }	         
        } // (upgraders.length)
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.BUILDER);	 
        var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);	
        console.log("Construction sites: " + constructionSites.length);
        console.log("Builders: " + builders);
        if (constructionSites.length == 0) {        
            for(var creep in builders) {
                builders[creep].memory.role = this.HARVESTER;
            }  
        } else {              
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.HARVESTER);
            console.log("Harvesters: " + harvesters);
            var numCreeps = builders.length + harvesters.length;
            var reqBuilders = Math.floor(numCreeps * this.builderRatio);
            if ( reqBuilders > builders.length ) {
                numNewBuilders = reqBuilders - builders.length;
                for (var i = 0; i < numNewBuilders; i++)   {
                    harvesters[i].memory.role = this.BUILDER;    
                }
            } else if (builders.length > reqBuilders) {
                numNewUpgraders =  builders.length - reqBuilders;
                for (var i = 0; i < numNewUpgraders; i++)   {
                    builders[i].memory.role = this.HARVESTER;    
                }               
            } // ( reqBuilders > numBuilders )
        } //(constructionSites.length == 0) 	    
	},
	
	assignRoles: function(cpuLoad, roomName) {
	    if (this.stopSawning(cpuLoad) && energyAtCapacity(roomName)) {
	        console.log("CPU overload, cpuLoad is " + cpuLoad);    
	        this.assingCpuOverload(roomName);
	    } else if (cpuLoad > this.havesterThreshold) {
	        console.log("CPU load high, cpuLoad is " + cpuLoad);    
		    this.assignCpuLoadHigh(roomName);
		} else {
		    console.log("CPU load low, cpuLoad is " + cpuLoad);    
		    this.assignCpuLoadLow(roomName);
		}
	    
		var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == this.REPAIRER); 
		var damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
            		filter: object => object.hits < object.hitsMax
        });	
        console.log("Damaged structures: " + damagedStructures.length);
		if (repairers.length) {
            if (damagedStructures.length == 0) {        
                for(var creep in repairers) {
                    repairers[creep].memory.role = this.HARVESTER;
                }        
            }          
		} else {
		    if (damagedStructures.length) {
		        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.UPGRADER);
		        if (upgraders.length)
		        {
		            upgraders[0].memory.role = this.REPAIRER;    
		        }		        
		    }		        
		}
		
		//DEBUG code for console
		var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == this.REPAIRER); 
		var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.BUILDER);	 
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.HARVESTER);
		var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.UPGRADER);
		console.log("Harvesters: " + harvesters.length);
		console.log("Upgraders: " + upgraders.length);
		console.log("Builders: " + builders.length);
		console.log("Repairers: " + repairers.length);
	},
	
	/** @param {cpuLoad, roomName, spawnName}  **/
	spawn: function(cpuLoad, roomName, spawnName) {
	    console.log("In raceWorker.build cpuload: " + cpuLoad);
		if (this.stopSawning(cpuLoad)) {
			return;	
	    }
		
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
				body, undefined, {role: this.UPGRADER});  
			console.log("New creep " + newName + " is born");
    	} // if ( energy >= biggestCreep ) 				
	}, // spawn	
	
	forceSpawn: function(spawnName) {
		var energy = Game.rooms[roomName].energyAvailable; 
		if  (energy > this.blockSize) {
			var newName = Game.spawns[spawnName].createCreep(
				[WOREK, CARRY, MOVE] , undefined, {role: this.UPGRADER});  
			console.log("New creep " + newName + " is born");			
		}
	}
}

module.exports = raceWorker;