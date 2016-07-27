/**
 * @fileOverview Screeps module. Abstract base class functions and data
 * for roles worker creeps can take.
 * @author Piers Shepperson
 */
"use strict";

var stats = require("stats");
var gc = require("gc");
var tasks = require("tasks");


/**
 * Abstract base class functions and data for roles worker creeps can take.
 * Methods for finding and moving towards targets.
 * @module roleBase
 */
var roleBase = {

    Type: {
    	HARVESTER: gc.ROLE_HARVESTER,
        UPGRADER: gc.ROLE_UPGRADER,
        BUILDER: gc.ROLE_BUILDER,
        REPAIRER: gc.ROLE_REPAIRER,
        LINKER: gc.ROLE_LINKER,
        CLAIMER: gc.ROLE_CLAIMER,
        NEUTRAL_BUILDER: gc.ROLE_NEUTRAL_BUILDER,
        UNASSIGNED: gc.ROLE_UNASSIGNED,
        SPAWN_BUILDER: gc.ROLE_SPAWN_BUILDER,
        MINER: gc.ROLE_MINER,
        TRAVELLER: gc.ROLE_TRAVELLER,
        ENERGY_PORTER: gc.ROLE_ENERGY_PORTER,
        ROLE_FLEXI_STORAGE_PORTER: gc.ROLE_FLEXI_STORAGE_PORTER
    },

    Task: {
        CARRY: "carry",
        HARVEST: "harvest",
        MOVE: "move"
    },

    LoadTime: {"harvester": 25, "upgrader": 25, "builder":25, "repairer": 25
        , "energy.porter" : 0, "flexi.storage.porter" : 0},
    OffloadTime: {"harvester": 1, "upgrader": 50, "builder":5, "repairer": 50
        , "energy.porter" : 40 , "flexi.storage.porter" : 40},

    sourceClinetThreshold: 1,

    forceCreeps: function (room, role) {
        var creeps = room.find(FIND_MY_CREEPS);
        for (var i in creeps) {
            console.log("looping in force creps ", creeps[i], creeps[i].memory.role);
           // if (creeps[i].memory.role == this.LINKER 
           //     || creeps[i].memory.role == undefined ) {
                 creeps[i].memory.role = role;
            //}
        }
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
        //if (undefined == creep.memory.targetRoom) {
        //    creep.memory.targetRoom = creep.room.name;
       // }

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
            creep.memory.targetRoom = creep.memory.sourceRoom;

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
            return this.Task.UNASSIGNED;;
        } else {
            // Creep seems lost?? Trying to do something unimplemented?
            creep.memory.targetSourceId = undefined;
            creep.memory.offloadTargetId = undefined;
          //  console.log(creep,"Creep seems lost?? Trying to do something unimplemented?");
            return this.Task.MOVE;
        }
    },

    pickUpLooseEnergy: function(creep){
        var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if(target) {
            creep.pickup(target)
        }
    },

    justRunOutOfEnergy: function (creep) {
        // Just run out of energy
        if (creep.memory.sourceRoom !== undefined) {
            if (creep.memory.task == this.Task.CARRY
                && creep.carry.energy == 0) {
             //   console.log(creep,"should not get here until empty");
                creep.memory.offloadTargetId = undefined;
                creep.memory.targetRoom = creep.memory.sourceRoom;
                //    console.log(creep,"got there");
                if (creep.memory.targetRoom == creep.room.name) {
                    return this.Task.HARVEST;
                } else {
                    return this.Task.MOVE;
                }
            }
        }
        return this.Task.UNASSIGNED;
    },

    justFilledUpWithEnergy: function(creep) {
        if (creep.memory.workRoom !== undefined) {
            if (creep.memory.targetRoom == creep.room.name) {
                if (creep.carry.energy == creep.carryCapacity) {
                 //   console.log(creep,"justFilledUpWithEnergy3", "ragetroom",creep.memory.targetRoom,
                //    "creep.room.name",creep.room.name);
                    creep.memory.targetSourceId = 0;
                    creep.memory.targetRoom = creep.memory.workRoom;
                    if (creep.memory.targetRoom == creep.room.name) {
                  //      console.log(creep,"just about to return",this.Task.CARRY);
                        return this.Task.CARRY;
                    } else {
                        return this.Task.MOVE;
                    }
                }
            }
        }
        return this.Task.UNASSIGNED;
    },

    checkTask: function (creep) {
        this.pickUpLooseEnergy(creep);
        //First task
        var task;
        if (undefined == creep.memory.targetRoom) {
            creep.memory.targetRoom = creep.room.name;
        }

        if (creep.memory.targetRoom != creep.room.name) { return this.Task.MOVE; }
        if (creep.memory.task === undefined) { return this.setFirstTask(creep);  }

     //   console.log(creep,"afterwaords");
        // Just filled up with energy
   //     console.log(creep.name,"targetRoom",creep.memory.targetRoom,"creep.room.name"
  //    /      ,creep.room.name,"sourceRoom",creep.memory.sourceRoom,"task"
  //          ,creep.memory.task,"energy",creep.carry.energy  );
        task =  this.justFilledUpWithEnergy(creep);
        if (this.Task.UNASSIGNED != task) { return task }


        task =  this.justRunOutOfEnergy(creep);
        if (this.Task.UNASSIGNED != task) { return task }

        //Just moved into your target room
        if (this.Task.MOVE == creep.memory.task
            && creep.memory.targetRoom == creep.room.name) {
           // console.log(creep,"justMovedIntoTargetRoom");
            return this.justMovedIntoTargetRoom(creep);
        }


        // Contract has ended
        var policy = require("policy");
        var contract = policy.getPolicyFromId(creep.memory.policyId);
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
        console.log(creep,"is in move");
        if (creep.memory.targetRoom == creep.room.name ) {
            if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49  )
            {
                var nextStep = this.nextStepIntoRoom(creep.pos, creep.memory.targetRoom);
                var path = creep.pos.findPathTo(nextStep);
                if (undefined != path[0]){
                    creep.move(path[0].direction);
                    return this.Task.MOVE;
                }
            } else {
                if (undefined !== creep.memory.targetSourceId) {
                    var target = Game.getObjectById(creep.memory.targetSourceId);
                    creep.moveTo(target);
                }
                return  this.Task.MOVE;
            }
        }

        if (undefined === creep.memory.targetRoom) {
            creep.memory.targetRoom = creep.room.name;
            return this.Task.MOVE;
        }

     //   console.log(creep,"atMoving to another room at pos",creep.pos,"and room",creep.room);
        //Moving to another room
        var route = Game.map.findRoute(creep.room.name, creep.memory.targetRoom);
        if (route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            if (exit != null) {
                if (creep.pos.x == exit.x && creep.pos.y == exit.y) {
                    nextStep = this.nextStepIntoRoom(creep.pos, creep.memory.targetRoom);
                    if (undefined != path[0]){
                        creep.move(path[0].direction);
                    }
                } else {
                    creep.moveTo(exit);
                }
            }
        } else {
            // console.log(creep,"botom of move.length > 0");
            nextStep = this.nextStepIntoRoom(creep.pos, creep.memory.targetRoom);
            path = creep.pos.findPathTo(nextStep);
            if (undefined != path[0]){
                creep.move(path[0].direction);
                return this.Task.MOVE;
            }
        }
        return this.Task.MOVE;
    },

    nextStepIntoRoom: function(pos, nextRoom) {
        var x  = pos.x;
        var y= pos.y;
        if (pos.x == 0) {
            x =47;
        }
        if (pos.x == 49) {
            x = 2;
        }
        if (pos.y == 0) {
            y =47;
        }
        if (pos.y == 49) {
            y = 2;
        }
      //  console.log("Just before roomposition constoutor: x",x,"y",y,"room",nextRoom);
        if (undefined !== nextRoom ){
            return new RoomPosition(x,y,nextRoom);
        } else {
            return undefined;
        }
    },

	findTargetSource: function(creep) {
      //  console.log(creep,"IN find target source");
        var roomOwned = require("room.owned");
	    var sources = creep.room.find(FIND_SOURCES);
        var target;
        if (1 >= sources.length)  {
            target = sources[0];
        } else {
            if (sources.length > 2) {
                sources = sources.sort( function (a,b)  { return b.energy - a.energy; } );
            }
            var closest = creep.pos.findClosestByRange(FIND_SOURCES);
            var iClosest, iFurthest;
            for (var i = sources.length - 1 ; i >= 0 ; i--) {
                if (sources[i].id == closest.id)
                    iClosest = i;
            }
            if (0 == iClosest)
                iFurthest = 1
            else
                iFurthest = 0;

            var access = [];
            var creepCount = _.filter(Game.creeps).length;
          //  console.log("number creeps",creepCount );
            for (var i = 0; i < sources.length; i++) {
                access.push(0);
                for (var creepName in Game.creeps) {
                    //console.log(creep,i,creepName,"creepId",Game.creeps[creepName].memory.tasks.targetId,
                   //                         "sourceId",sources[i].id);
                    if (undefined !== Game.creeps[creepName].memory.tasks
                        && Game.creeps[creepName].memory.tasks.targetId == sources[i].id) {
                        access[i] = access[i] + 1;
                        //debugger;
                    }   // if
                }   //  for(var cIndex in Game.creeps)
                var accessPoints = roomOwned.countAccessPoints(creep.room, sources[0].pos);
                access[i] = access[i] - accessPoints;
            } // for ( var sIndex in  sources )

           // console.log(creep,"findTargetSources access", JSON.stringify(access),"clostse index",iClosest);

            if (access[iFurthest] > 1) {
                target = sources[iClosest];
              //  console.log("(access[iFurthest] > 1) ",target);
            } else if (access[iClosest] > 1) {
                target = sources[iFurthest];
           //     console.log("(access[iClosest] > 1) ",target);
            } else if (closest.energy >= creep.carryCapacity) {
                target = sources[iClosest];
            //    console.log("((closest.energy >= creep.carryCapacity) ",target);
            } else if (sources[iFurthest].energy > creep.carryCapacity) {
                target = sources[iFurthest];
             //   console.log("(sources[iFurthest].energy > creep.carryCapacity) ) ",target);
            } else {
                target = sources[iClosest];
             //   console.log("else",target);
            }
        }
      //  console.log(creep,"findTargetSource target",target,"length sources", sources.length);
      //  console.log(creep,"findTargetSources access", JSON.stringify(access),"clostse index",iClosest);
        //creep.memory.tasks.targtId = target;

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
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) { 
                creep.memory.targetSourceId = targetSource.id;
                creep.moveTo(targetSource);
            }   
         // Contiue moving towards source or havest it if there       
         } else {    
            var source = Game.getObjectById(creep.memory.targetSourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {                   
                creep.moveTo(source);
            } 
        } // if (sourceId)             
    },

    resetTasks: function (creep) {
        creep.memory.tasks = undefined;
        console.log(creep.memory.tasks);
        if (creep.memory.tasks === undefined) {
            var raceBase = require("race.base");
            if (creep,creep.memory.role = "linker")
                creep,creep.memory.role = "harvester";
            raceBase.setRole(creep,creep.memory.role);
        }
    },
   
    run: function(creep) {

        if (!creep.memory.tasks || !creep.memory.tasks.tasklist) {
            roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
          return;
        }
        var tasks = require("tasks");
        tasks.doTasks(creep);
        //creep.say(creep.memory.role);
        return;
          //  if (creep.name == "Skyler"){
         //    this.resetTasks(creep);
         //   }
                //creep.memory.tasks = undefined;
          //   console.log("-------------------", creep,"-------------------------------");
              //    tasks.showTasks(creep);
             //   tasks.setTargetId(creep,undefined);
              // console.log(creep,creep.memory.role);
          //  creep.say(creep.memory.role);

            //  console.log("---------------------------------------------------");

          // }
    //    }
 /*       if (creep.memory.role === undefined){
            creep.memory.role = gc.ROLE_BUILDER;
           // console.log(creep , "LLLLLLLLLLLLLOST ROLE")
        }
        creep.memory.tasks = undefined;
        console.log(creep.memory.tasks);
        if (creep.memory.tasks === undefined) {
            var raceBase = require("race.base");
            if (creep,creep.memory.role = "linker")
                creep,creep.memory.role = "harvester";
            raceBase.setRole(creep,creep.memory.role);
        }


        if(creep.role == roleBase.Type.LINKER){
            return;
        }

        var newTask = roleBase.checkTask(creep);
        creep.memory.task = newTask;
     //   console.log(creep,"newtask " ,newTask, "this.Task.MOVE", this.Task.MOVE,"roleBase.Task.MOVE",roleBase.Task.MOVE);

        // moving towards construction site
        switch (creep.memory.task) {
            case roleBase.Task.MOVE:
                roleBase.move(creep);
                break;
            case roleBase.Task.CARRY:
                module = this.getModuleFromRole(creep.memory.role);
               // console.log("lust after gotmdouelfrom roel module", module,"role", creep.memory.role);
                var target = module.findTarget(creep);
         //       console.log(creep,"is stet to carry task in switch target",target);
             //  console.log("creep", creep, "target", target,"role",creep.memory.role)
                if (0 != target) {
                    //console.log(creep,creep.memory.role,"target",target);
                    if(module.action(creep, target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else { //silly thing if no where for havester to dump energy
                    if (creep.memory.role == this.Type.HARVESTER
                        || creep.memory.role == this.Type.NEUTRAL_BUILDER) {
                        creep.memory.role = this.Type.UPGRADER;
                      //  console.log(creep,"ijust changed role to",creep.memory.role);
                        target = module.findTarget(creep);
                        if (0 != target) {
                            if(module.action(creep, target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                            }
                        }
                    }
                }
                break;
            case roleBase.Task.HARVEST:
                roleBase.fillUpEnergy(creep);
                break;
            default:
        }*/
    },

    convert: function (creep, role) {
        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        module = this.getModuleFromRole(role);
        creep.memory.tasks.tasklist = module.getTaskList(creep);
        creep.memory.role = role;
        tasks.setTargetId(creep,undefined);
        return true;
    },

    switchRoles: function (creep, role, para1, para2, para3, para4, para5,
                                         para6, para7, para8, para9, para10) {
        if (undefined === creep) {
            return false;
        }

        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        tasks.setTargetId(creep,undefined);
        creep.memory.tasks.state = undefined;

        module = this.getModuleFromRole(role);
        if (undefined === module) {
            return false;
        }
        //console.log(creep,"roleBase.switchRoles role",role,"module",module,"length",Object.keys(module).length );
        creep.memory.tasks.tasklist = module.getTaskList(creep, para1, para2, para3, para4, para5,
                                                                para6, para7, para8, para9, para10 );
        console.log(creep,"basek form module.getTaskList", JSON.stringify(creep.memory.tasks.tasklist));

        creep.memory.role = role;
        return true;
    },

    getModuleFromRole: function (role){
        if (undefined !== role) {
            var name = "role." + role;
            var modulePtr = require(name);
            //console.log("rolebase.getModuleFromRole role",role,"name",name,"module", modulePtr);
            return modulePtr;
        }  else {
            return undefined;
        }
    }
};

module.exports = roleBase;
























































