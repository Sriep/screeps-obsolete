/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * for use by worker creeps. 
 * @author Piers Shepperson
 */
"use strict";

var _ = require('lodash');
var roleBase = require("role.base");
var gc = require("gc");

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
    BLOCKSIZE_FAST: 100 + 50 + 50 + 50,
    BLOCKSIZE_PARTS: 3,
	
    buildRatio: 1.0,
	repairerRatio: 0.08,
	repairerThreshold: 6,
	havesterRation: 0.5,
	
	ROLE_HARVESTER: "harvester",
	ROLE_UPGRADER: "upgrader",
	ROLE_BUILDER: "builder",
	ROLE_REPAIRER: "repairer",
	ROLE_DEFULT: "harvester",
    ROLE_LINKER: "linker",
    ROLE_CLAIMER: roleBase.Type.CLAIMER,

    LINKING_WORKERSIZE: gc.LINKING_WORKER_SIZE,
    MaxWorkerControllerLevel: [0,1,1,2,4,6,9,11,14,16],
/*
	maxSize: function(contolerLevel) { 
        console.log("Warning In race.Worker.maxSize (congoller)");
	    return  Math.floor(roomController.maxProduction[contolerLevel] / this.BLOCKSIZE);       
    },
*/
    // Weak from. Assumes body is an array not a object.
    isWorker: function(body) {
        var raceBase = require("race.base");
        body = raceBase.convertBodyToArray(body);
        if (body === undefined || 3 > body.length)
            return false;
        var foundWork = false, foundCarry = false, foundMove = false;
        for (var i = 0 ; i < body.length ; i++) {
            switch (body[i]) {
                case WORK:
                    foundWork = true;
                    break;
                case MOVE:
                    foundMove = true;
                    break;
                case CARRY:
                    foundCarry = true;
                    break;
                default:
            } //switch
            if (foundCarry && foundMove && foundWork) {
                return true;
            }
        }// for
        return false;
    },

    creepSize: function(body) {
        if (body === undefined || 0 != body.length % 3)
            return 0;
        return body.length / 3;
    },

    energyFromSize: function (size, fast) {
        if (fast){
            return size * this.BLOCKSIZE_FAST;
        }  else {
            return size * this.BLOCKSIZE;
        }
    },

    maxSizeRoom: function(room, fast) {
    //    console.log("race.worker.maxSizeRoom",room.energyCapacityAvailable,this.BLOCKSIZE);
        var workerBodyPartLimit;
        if (fast) {
            workerBodyPartLimit = Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE_FAST);
            return Math.min(workerBodyPartLimit, gc.WORKER_FAST_MAX_SIZE);
        } else {
            workerBodyPartLimit =  Math.floor(room.energyCapacityAvailable/this.BLOCKSIZE);
            return Math.min(workerBodyPartLimit, gc.WORKER_SLOW_MAX_SIZE);
        }
    },

    maxSizeFromEnergy: function(room)  {
      //  console.log(room,"room.energyAvailable",room.energyAvailable,"blocksize",this.BLOCKSIZE,
    //    "result",Math.floor(room.energyAvailable / this.BLOCKSIZE));
        var withoutBodyPartLimit =  Math.floor(room.energyAvailable / this.BLOCKSIZE);
        return Math.min(withoutBodyPartLimit, gc.WORKER_SLOW_MAX_SIZE);
    },

    spawnWorkerSize: function(room, euilibEnergy) {
        var roomOwned = require("room.owned");
        var accesPoints = roomOwned.countSiteAccess(room,FIND_SOURCES);
        var minSizeDesirable;

        //minSizeDesirable = Math.ceil(Math.max(euilibEnergy / (400*accesPoints), gc.LINKING_WORKER_SIZE));
        minSizeDesirable = Math.ceil(euilibEnergy / (400*accesPoints));
        var maxSizePossible = room.energyCapacityAvailable/this.BLOCKSIZE;
        if (accesPoints == 1) {
            minSizeDesirable = Math.max(minSizeDesirable,maxSizePossible);
        }
        console.log(room,"equlibenergy",euilibEnergy ,"minSizeDesirable",minSizeDesirable
            ,"maxSizePossible",maxSizePossible);
        return Math.floor(Math.min(minSizeDesirable,maxSizePossible));
    },
	
	switchRoles: function(delta1, delta2, role1, role2, currentPolicy) {
        var raceBase = require("race.base");
        var deltaChange = 0;
	    if (delta1 > 0 && delta2 < 0) {
            deltaChange = Math.min(delta1, -1*delta2);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role2
                && creep.memory.policyId == currentPolicy.id);
            for (var i = 0; i < deltaChange; i++)   {
                if (creeps[i] !== undefined) {
                    //creeps[i].memory.role = role1;
                    raceBase.setRole(creeps[i], role1);
                } else {
                     console.log("Undefined creep delta1" + delta1 + " delta2 " 
                         + delta2 + " role1 " + role1 + " role2 " + role2 + " i " + i);     
                }
            }
	    } else if (delta2 > 0 && delta1 < 0) {
            deltaChange = Math.min(delta2, -1*delta1);
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role1
                && creep.memory.policyId == currentPolicy.id);
            for (var i = 0; i < deltaChange; i++)   {
                if (creeps[i] !== undefined) {
                   // creeps[i].memory.role = role2;
                    raceBase.setRole(creeps[i], role2);
                } else {
                     console.log("Undefined creep delta1" + delta1 + " delta2 " 
                         + delta2 + " role1 " + role1 + " role2 " + role2 + " i " + i);     
                }
            }
            deltaChange = -1*deltaChange;
        }
        return deltaChange;
	},
	
    assignWorkerRoles: function(currentPolicy, 
                    havesters_needed, 
                    upgraders_needed, 
                    builders_needed, 
                    repairers_needed)
    {     
console.log("assignRoles havester", havesters_needed, "upgraders",upgraders_needed,
    "builders",builders_needed,"repairers",repairers_needed);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_HARVESTER
            && creep.memory.policyId == currentPolicy.id);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_BUILDER
            && creep.memory.policyId == currentPolicy.id);
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_REPAIRER
            && creep.memory.policyId == currentPolicy.id);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_UPGRADER
            && creep.memory.policyId == currentPolicy.id);
        var linkers = _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE_LINKER
            && creep.memory.policyId == currentPolicy.id);
        var nLinkers = linkers.length

        var dHavesters = havesters_needed - harvesters.length;
        var dBuilders = builders_needed - builders.length;
        var dRepairers = repairers_needed - repairers.length;
        var dUpgraders = upgraders_needed - upgraders.length;
/*
        //console.log("Linkers: " + linkers.length);
        if (nLinkers > 0){
            if (repairers.length  +  dRepairers > 0) {
                dRepairers -= Math.min(repairers.length +  dRepairers  ,nLinkers );
                nLinkers  -= Math.min(repairers.length +  dRepairers ,nLinkers);
            }
            if (builders.length  +  dBuilders > 0) {
                dBuilders -= Math.min(builders.length  +  dBuilders ,nLinkers );
                nLinkers  -= Math.min(builders.length  +  dBuilders ,nLinkers);
            }
            if (upgraders.length  +  dUpgraders > 0) {
                dUpgraders -= Math.min(upgraders.length+  dUpgraders ,nLinkers);
                nLinkers -= Math.min(upgraders.length +  dUpgraders,nLinkers);
            }

        }*/

        console.log("Harvesters: " + harvesters.length + " delta " + dHavesters
            ,"Upgraders: " + upgraders.length + " delta " + dUpgraders
            ,"Builders: " + builders.length + " delta " + dBuilders
            ,"Repairers: " + repairers.length + " delta " + dRepairers);
    //    console.log("Linkers: " + linkers.length);
        var delta
        if (dHavesters != 0)
        {        
            delta = this.switchRoles(dHavesters, dUpgraders, this.ROLE_HARVESTER, this.ROLE_UPGRADER, currentPolicy);
            dHavesters = dHavesters + delta;
            dUpgraders = dUpgraders - delta;
        }
        if (dHavesters != 0)
        {
            delta = this.switchRoles(dHavesters, dBuilders, this.ROLE_HARVESTER, this.ROLE_BUILDER, currentPolicy);
            dHavesters = dHavesters + delta;
            dBuilders = dBuilders - delta;
        }
        if (dHavesters != 0)
        {
            delta = this.switchRoles(dHavesters, dRepairers, this.ROLE_HARVESTER, this.ROLE_REPAIRER, currentPolicy);
            dHavesters = dHavesters + delta;
            dRepairers = dRepairers - delta;
        }

        if (dBuilders != 0)
        {
            delta = this.switchRoles(dBuilders, dUpgraders, this.ROLE_BUILDER, this.ROLE_UPGRADER, currentPolicy);
            dBuilders = dBuilders + delta;
            dUpgraders = dUpgraders - delta;
        }
        if (dBuilders != 0)
        {
            delta = this.switchRoles(dBuilders, dRepairers, this.ROLE_BUILDER, this.ROLE_REPAIRER, currentPolicy);
            dBuilders = dBuilders + delta;
            dRepairers = dRepairers - delta;
        }

        if (dRepairers != 0)
        {
            delta = this.switchRoles(dRepairers, dUpgraders, this.ROLE_REPAIRER, this.ROLE_UPGRADER, currentPolicy);
            dRepairers = dRepairers + delta;
            dUpgraders = dUpgraders - delta;
        }
        //this.logWorkerRoles(currentPolicy);
        //console.log("Harvesters: " + harvesters.length);
       // console.log("Upgraders: " + upgraders.length );
       //console.log("Builders: " + builders.length );
        //console.log("Repairers: " + repairers.length );
       // console.log("Linkers: " + linkers.length);
        this.initiliseWorkers(currentPolicy)
       // this.logWorkerRoles(currentPolicy);
    },

    initiliseWorkers: function(policy)
    {
      //  console.log("initiliseWorkers policy",JSON.stringify(policy));
      //  if ( policy !== undefined) {
          //  console.log("polcy", JSON.stringify(policy));
            var room = policy.room;
            var creeps = Game.rooms[room].find(FIND_MY_CREEPS);
            for (var i in creeps) {
                if (creeps[i].memory.policyId == policy.id)
                {
                    creeps[i].memory.startRoom = room;
                    creeps[i].memory.workRoom = room;
                    creeps[i].memory.sourceRoom = room;
                    creeps[i].memory.endRoom = room;
                    creeps[i].memory.targetRoom = room;
                }
            }
     //  }
    },

    bodyE: function (work, carry, move) {
        if ( work + cary + move > 50 ) return undefined;
        var body = [];
            for (var i = 0; i < carry; i++) {
                body.push(CARRY);
            }
            for (var j = 0; j < move; j++) {
                body.push(MOVE);
            }
            for (var k = 0; k < work; k++) {
                body.push(WORK);
            }
    },



    body: function (size, fast) {
        var body = [];

        if (undefined === fast || !fast)
        {
            size = Math.min(16,size);
            for (var i = 0; i < size; i++) {
                body.push(CARRY);
            } // for
            for (var i = 0; i < size; i++) {
                body.push(MOVE);
            } // for
            for (var i = 0; i < size; i++) {
                body.push(WORK);
            } // for
        } else {
            size = Math.min(12,size);
            for (var i = 0; i < size; i++) {
                body.push(CARRY);
            } // for
            for (var i = 0; i < size; i++) {
                body.push(MOVE);
                body.push(MOVE);
            } // for
            for (var i = 0; i < size; i++) {
                body.push(WORK);
            } // for

        }
        return body;

    },

    biggistSpawnable: function(room) {
        var cost = room.energyCapacityAvailable;
        cost = Math.floor(cost/this.blockSize) * this.blockSize;	     
        return cost;
    },

    spawnFromName: function(roomName, spawnName, wokerSize) {
        var spawns = currentRoom.find(FIND_MY_SPAWNS);
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
    * @returns {Number}  <a href="http://support.screeps.com/hc/en-us/articles/203084991-API-Reference">
    *   Screeps error code.</a>   
    * @example 
    *   // Create the biggest worker currently possable.  
    *   var raceWorker = require("race.worker");
    *   raceWorker.spawnWorker("W26S21", "Spawn1");        
    */

};

module.exports = raceWorker;




































