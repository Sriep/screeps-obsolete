/**
 * @fileOverview Screeps module. Abstract base class functions and data
 * for roles worker creeps can take.
 * @author Piers Shepperson
 */
 stats = require("stats");

/**
 * Abstract base class functions and data for roles worker creeps can take.
 * Methods for finding and moving towards targets.
 * @module roleBase
 */
var roleBase = {

    Type: {
    	HARVESTER: "harvester",
        UPGRADER: "upgrader",
        BUILDER: "builder",
        REPAIRER: "repairer",
        LINKER: "linker",
        NEUTRAL_BUILDER: "neutral.builder",
        UNASSIGNED: "unassigned"
    },

    Task: {
        CARRY: "carry",
        HARVEST: "harvest",
        MOVE: "move"
    },

    LoadTime: {"harvester": 25, "upgrader": 25, "builder":25, "repairer": 25},
    OffloadTime: {"harvester": 1, "upgrader": 50, "builder":5, "repairer": 50},

    sourceClinetThreshold: 1,

    forceCreeps: function (room, role) {
        creeps = room.find(FIND_MY_CREEPS);
        for (var i in creeps) {
            console.log("looping in force creps ", creeps[i], creeps[i].memory.role);
           // if (creeps[i].memory.role == this.LINKER 
           //     || creeps[i].memory.role == undefined ) {
                 creeps[i].memory.role = role;
            //}
        }
    },
    
    distanceBetween: function( obj1, obj2) {
		dx = obj1.pos.x - obj1.pos.x;
		dy = obj1.pos.y - obj2.pos.y;
		distance = Math.sqrt(dx*dx + dy*dy);
		return distance;
	},

    returnToPool: function(creep) {
        creep.room.memory.startRoom = undefined;
        creep.room.memory.workRoom = undefined;
        creep.room.memory.sourceRoom = undefined;
        creep.room.memory.endRoom = undefined;
        creep.room.memory.targetRoom = undefined;
        creep.room.memory.targetSourceId = undefined;
        creep.room.memory.offloadTargetId = undefined;
        creep.room.memory.policyID = undefined;
        creep.room.memory.role = this.Type.UNASSIGNED;
        if (creep.room.memory.policy !== undefined)
        {
            creep.room.memory.startRoom = creep.room;
            creep.room.memory.policyID = creep.room.memory.policy.id;
        }
    },

    setFirstTask: function(creep) {
        //console.log("setting first task",creep);
        if (creep.memory.sourceRoom === undefined) {
            if (creep.memory.workRoom === undefined) {
                if (creep.memory.endRoom === undefined) {
                    creep.memory.targetRoom = creep.memory.startRoom;
                } else {
                    creep.memory.targetRoom = creep.memory.endRoom;
                }
                return this.Task.MOVE;
            } else {
                creep.memory.targetRoom = creep.memory.workRoom;
                if (creep.memory.workRoom == creep.room.name) {
                    return this.Task.CARRY;
                } else {
                    return this.Task.MOVE;
                }
            }
        } else {
            creep.memory.targetRoom == creep.memory.sourceRoom;

            if (creep.memory.sourceRoom == creep.room.name) {
               // console.log("Shotd get here",this.Task.HARVEST,  this.Task.MOVE);
                return this.Task.HARVEST;
            } else {
                return this.Task.MOVE;
            }
        }
    },

    justMovedIntoTargetRoom: function (creep) {
        if (creep.room.name == creep.memory.sourceRoom) {
            return this.Task.HARVEST;
        } else if (creep.room.name == creep.memory.workRoom)  {
            return this.Task.CARRY;
        } else  if (creep.room.name == creep.memory.endRoom) {
            this.returnToPool(creep);
            return undefined;
        } else {
            // Creep seems lost?? Trying to do something unimplemented?
            return this.Task.MOVE;
        }
    },

    checkTask: function (creep) {
        //First task
        if (creep.memory.task === undefined) {
           var  firstTdask = this.setFirstTask(creep);
           // console.log("and the fist task is",firstTdask);
            return firstTdask;
        }

        // Just run out of energy
        if (creep.memory.sourceRoom !== undefined) {
            if (creep.memory.task == this.Task.CARRY && creep.carry.energy == 0) {
                creep.memory.offloadTargetId = undefined;
                creep.memory.targetRoom = creep.memory.sourceRoom;
                return this.Task.HARVEST;
            }
        }

        // Just filled up with energy
        if (creep.memory.workRoom !== undefined) {
            if (creep.memory.task != this.Task.CARRY
                && creep.carry.energy == creep.carryCapacity) {
                creep.memory.targetSourceId = 0;
                creep.memory.targetRoom = creep.memory.workRoom;
                return this.Task.CARRY;
            }
        }


        //Just moved into your target room
        if (this.Task.MOVE == creep.memory.task
            && creep.memory.targetRoom == creep.room.name) {
            return this.justMovedIntoTargetRoom(creep);
        }

        // Contract has ended
        policy = require("policy");

        var contract = policy.getPolicyFromId(creep.id);
       // console.log("In movevoev creep",creep, contract);
        if (undefined !== contract) {
            if (contract.shuttingDown) {
                if (creep.memory.endRoom !== undefined) {
                    creep.memory.targetRoom = creep.memory.endRoom;
                    return this.Task.MOVE;
                } else {
                    this.returnToPool(creep);
                }
            }
        }
        return creep.memory.task;
    },

    move: function (creep) {
        // Moving somewhere in this room
        if (creep.memory.targetRoom == creep.room.name ) {
            if (undefined !== creep.memory.targetSourceId) {
                var target = Game.getObjectById(creep.memory.targetSourceId);
                creep.moveTo(target);
            }
            return  this.Task.MOVE;
        }

        //Moving to another room
        var route = Game.map.findRoute(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(route[0].exit);
        if (creep.pos.x == exit.x && creep.pos.y == exit.y) {
            var foriegnTarget =  this.nextStepIntoRoom(creep.pos.x, creep.pos.y, creep.memory.targetRoom);
            var path = creep.pos.findPathTo(foriegnTarget);
            creep.move(path[0].direction);
        } else {
            creep.moveTo(exit);
        }

    },

    nextStepIntoRoom: function(pos, nextRoom) {
        var x  = pos.x;
        var y= pos.y;
        if (pos.x == 0) {
            x ==48;
        }
        if (pos.x == 49) {
            x = 1;
        }
        if (pos.y == 0) {
            y ==48;
        }
        if (pos.y == 49) {
            y = 1;
        }
        return new RoomPosition(x,y,nextRoom);
    },

	findTargetSource: function(creep) {
	    var sources = creep.room.find(FIND_SOURCES, {
            filter: function(source) {             
                return (creep.room.memory.reservedSources === undefined
                        || -1 == creep.room.memory.reservedSources.indexOf(source.id));
            }
        });
	    sources.sort((a,b) => b.energy - a.energy);    	    
	    for ( var sIndex in  sources ) {
            sources[sIndex].clients= 0;
            for(var cIndex in Game.creeps) {
                if (Game.creeps[cIndex].memory.targetSourceId == sources[sIndex].id)
                {
                    sources[sIndex].clients = sources[sIndex].clients +1;
                }   // if             
            }   //  for(var cIndex in Game.creeps)          
        } // for ( var sIndex in  sources ) 
        var target = sources[0];
        if (sources.length > 1) {
            if (sources[0].clients > sources[1].clients + this.sourceClinetThreshold) {
                target = sources[1];   
            }
        }
        return target;  
	},
	
	checkCarryState: function (creep) {	
	    if(creep.memory.carrying === undefined) {
	        creep.memory.carrying = false
	    }
	        
	    // Just run out of energy
	    if(creep.memory.carrying && creep.carry.energy == 0) {
           // console.log("Should get herer");
            creep.memory.carrying = false;
            creep.memory.offloadTargetId = undefined;
        } 
        // Just filled up with energy
        if(!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
            creep.memory.carrying = true;
            creep.memory.targetSourceId = 0;
        }          	    
	},        	
	
	fillUpEnergy: function(creep) {
        var sourceId = creep.memory.targetSourceId;
        // Has not decided which source to target
        if (sourceId === undefined || 0 == sourceId)
        {
            var targetSource = this.findTargetSource(creep);
            if (targetSource ===  null) {
                console.log(creep, "SHOLD NOT GET HERE fillUpEnegy targetSource ===  null");
                return;
            }
            if(stats.harvest(creep, targetSource) == ERR_NOT_IN_RANGE) { 
                creep.memory.targetSourceId = targetSource.id;
                creep.moveTo(targetSource);
            }   
         // Contiue moving towards source or havest it if there       
         } else {    
            var source = Game.getObjectById(creep.memory.targetSourceId);
            if(stats.harvest(creep, source) == ERR_NOT_IN_RANGE) {                   
                creep.moveTo(source);
            } 
        } // if (sourceId)             
    }      
};

module.exports = roleBase;






































