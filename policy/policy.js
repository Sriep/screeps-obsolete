"use strict";
/**
 * @fileOverview Screeps module. Abstract base object for handling policy 
 * decisions
 * @author Piers Shepperson
 */
var roleBase = require("role.base");
var gc = require("gc");
//var policyFrameworks = require("policy.declarations");
/**
 * Abstract base object for policy decisions.
 * @module policy
 */
var policy = {

    //policyPeace:  require("policy.peace"),
    //policyConstruction:  require("policy.construction"),
    //policyDefend:  require("policy.defence"),
    //policyRescue:  require("policy.rescue"),
    LINKING_WORKER_SIZE: 5,
    THE_POOL: 0,

    Owner: {
        PLAYER: "player",
        NEUTRAL: "neutral",
        ENEMY: "enemy"
    },
    
    enactPolicies: function()
    {
        this.checkRoomPolicies();
        var i =  Object.keys(Memory.policies).length;
        for (var i in Memory.policies) {
            var oldPolicyModule = this.getModuleFromPolicy(Memory.policies[i]);
           // console.log("enactPolicies",JSON.stringify(Memory.policies[i]));
         //   console.log("oldPolicyModule", JSON.stringify(oldPolicyModule))
            var newPolicyDetails = oldPolicyModule.draftNewPolicyId(Memory.policies[i]);
            //console.log(JSON.stringify(oldPolicyModule) ,"newPolicyDetails",newPolicyDetails,"i =",i);
            if (newPolicyDetails === null) {
              //  console.log("Terminate policy",Memory.policies[i].type,Memory.policies[i].id);
                delete Memory.policies[i];
                //Memory.policies.splice(i, 1);
            } else if ( newPolicyDetails.id != Memory.policies[i].id) {
                var newPolicyModule = this.getModuleFromPolicy(newPolicyDetails);
                this.activatePolicy(newPolicyDetails);
                newPolicyModule.switchPolicy(Memory.policies[i], newPolicyDetails);
               // console.log("Removing old policy",Memory.policies[i].type,"id", Memory.policies[i].id );
                delete Memory.policies[i];
                //Memory.policies.splice(i, 1);
               // console.log("Enact new policy",newPolicyDetails.type,newPolicyDetails.id);
                newPolicyModule.enactPolicy(newPolicyDetails);

            } else {
               // console.log("ENACT POLICY",Memory.policies[i].type, Memory.policies[i].id);
                oldPolicyModule.enactPolicy(Memory.policies[i]);
               // console.log("FINISHED POLICY");
            } // if(newPolicyDetails !===
        } //while
    },


    /**
     * @var Memory        Screeps Memory object
     * @var Memory.policies  List of active policies.
     */
    checkRoomPolicies: function() {
        var policyFrameworks = require("policy.frameworks");
        var policies = Memory.policies;
        if (policies === undefined) {
            policies = {};
        }
        if (policies[0] === undefined) {
            var thePoolPolicyDetails = policyFrameworks.createThePool();
            this.activatePolicy(thePoolPolicyDetails);
        }

        for(var roomIndex in Game.rooms) {
            var room = Game.rooms[roomIndex]
            var foundPolicy = false;
            var policiesToBeTerminated = [];
            for (var policyIndex in policies) {
                var policy = policies[policyIndex];
                if (policy.room !== undefined && policy.room == room.name) {
                    // Use the first policy found for the room terminate any others.
           //         console.log("found polcy for room", room);
                    if (!foundPolicy) {
                        foundPolicy = true;
                        room.policyId = policy.id;
                        room.currentPolicy = policy.type;
              //          console.log("first");
                    } else {
                   //     console.log("susequent to be reomved");
                        policiesToBeTerminated.push(policy.id);
                    }
                }
            } //(policyIndex in policies)
            // remove unwanted policies
            for (var i in policiesToBeTerminated) {
                this.terminate(policiesToBeTerminated[i]);
            }
            // Room does not have a policy give it peace
            if (!foundPolicy) {
                var policyFrameworks = require("policy.frameworks");
                var newPolicy = policyFrameworks.createPeacePolicy(room.name);
                if (room.controller != undefined && room.controller.my) {
                    console.log("Create peace policy for room",room.name);
                    this.activatePolicy(newPolicy);
                } else {
                    var newPolicy = policyFrameworks.createNeutralRoomPolicy(room.name);
                    console.log("Create neutral room policy for room",room.name);
                    this.activatePolicy(newPolicy);
                }
            }//(!foundPolicy)
        }// for(var roomIndex in Game.rooms)

    },
    
    shutDownPolicy: function (poicy) {
        policy.shuttingDown = true;
    },

    // Remove all policies with given id.
    terminate: function(policyId)   {
      delete Memory.policies[policyId];
    },
    
    

    supportBurden: function(room)
    {
       // var room = Game.rooms[policy.workRoom];
        var supportCount = 0;
        if (room !== undefined && room.memory.dependantPolicies !== undefined)
        {
            var dPolicies = room.memory.dependantPolicies;
            for (var i in dPolicies) {
                var policy = this.getPolicyFromId(dPolicies[i]);

                if (undefined !== policy) {
                    supportCount = supportCount + policy.workersContractedFor - policy.workersAssigned;
                }
            }
        }
        return supportCount;
    },

    reassignCreeps: function (oldPolicy, newPolicy) {
        for (var creep in Game.creeps) {
            if (Game.creeps[creep].memory.policyId == oldPolicy.id) {
                Game.creeps[creep].memory.policyId = newPolicy.id
            }
        }
    },

    getNextPolicyId: function() {
        if (Memory.nextPolicyId === undefined) {
            Memory.nextPolicyId = 1;
        }
        var latestId = Memory.nextPolicyId;
        Memory.nextPolicyId = Memory.nextPolicyId +1;
        return latestId;
    },
    
    activatePolicy: function(policyDetails) {
        var policyFrameworks = require("policy.frameworks");
        if (undefined === policyDetails.id ) {
            var nextId = this.getNextPolicyId();
           // console.log(policyDetails,"policyDetails.id "
          //      ,policyDetails.id ,"next polisy",nextId)
            policyDetails.id = nextId;
        }
        if (undefined === Memory.policies){
            Memory.policies = {};
            var thePoolPolicyDetails = policyFrameworks.createThePool();
            this.activatePolicy(thePoolPolicyDetails);
        }
        var module = this.getModuleFromPolicy(policyDetails);
        console.log("activatePolicy id",policyDetails.id,"module",module);
        if (undefined === module) {
            console.log("activatePolciy cant make module",JSON.stringify(policyDetails));
            return false;
        }
        if (undefined  !== module.validPolicy) {
            if (!module.validPolicy(policyDetails)) {
                return false;
            }
        }
        console.log("making policy", policyDetails.id);
        Memory.policies[policyDetails.id] = policyDetails;

        if (undefined  !== module.initialisePolicy) {
            module.initialisePolicy(policyDetails)
        }
        return true;
    },

    pushDependantPolicy: function (room,dPolicy) {
        if (undefined !== room) {
            if (undefined === room.memory.dependantPolicies
                || null === room.memory.dependantPolicies)
            {
                room.memory.dependantPolicies = [];
            }
            room.memory.dependantPolicies.push(dPolicy.id);
            console.log("In push Dependant Policy about to return ture",room,dPolicy );
            return true;
        } else {
            return false;
        }
    },

    getPolicyFromId: function(id) {
        return Memory.policies[id];
    },

    breakUpLinks: function (policyId)
    {
       
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policyId.id
                && ( creep.memory.role == gc.ROLE_LINKER_SOURCE
                || creep.memory.role == gc.ROLE_LINKER_MINER_STORAGE);
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            roleBase.resetTasks(creeps[i]);
        }
    } ,

    energyStorageAtCapacity: function (room) {
        if (room.energyAvailable == room.energyCapacityAvailable) {
            var towers = room.find(FIND_MY_STRUCTURES,
                {filter: {structureType: STRUCTURE_TOWER}});
            for (var i in towers) {
                if (towers[i] === undefined) {
                    return true
                }
                if (towers[i].energy != towers[i].energyCapacity) {
                    return false;
                }
            }
            return true;
        } else {
            return false
        }
    },

    convertContractWorkers: function(room, policy, availableRole) {
       // console.log("in convertContractWorkers room", room, "policy", policy.type, "role", availableRole);
        var depPolicies = room.memory.dependantPolicies;
        if (undefined == depPolicies) {
         //   console.log("cannot find dependance policies room",room, "policy",polcy.id)
            return;
        }
        var workersAvailable = room.find(FIND_MY_CREEPS, {
            filter: function (creep) {
                return creep.memory.role == availableRole
                    && creep.memory.policyId == policy.id
            }
        });
        if (workersAvailable.length >0) {workersAvailable.pop();}
        var policyIndex = depPolicies.length;
        var workersAllotted = 0;
      //  console.log("just before while policyIndex", policyIndex,"workers allowed"
      //      ,workersAllotted,"wokers avalabe",workersAvailable.length);
        while (--policyIndex >= 0 && workersAllotted < workersAvailable.length ) {

            var depPolicy = this.getPolicyFromId(depPolicies[policyIndex]);
          //  console.log("fisrt line of while policy index", policyIndex, "workers alloted",workersAllotted,
          //      "workers avaliable",workersAvailable.length,"depPolicy",depPolicy );

            if (depPolicy === undefined) {// || depPolicy === null) {
    //            console.log("about to splice policy at", policyIndex);
                depPolicies.splice(policyIndex, 1);
    //            console.log("spliced policy");
            } else {
             //   console.log("found valid contract policy", depPolicy.id);
                var needed = depPolicy.workersContractedFor - depPolicy.workersAssigned;
                var getting = Math.min(needed, workersAvailable.length - workersAllotted);
          //      console.log("getting", getting, "needed",needed,"orkersAvailable.length",
          //          workersAvailable.length, "workersAllotted",workersAllotted);
                for (var i = 0; i < getting; i++) {
                    var module = this.getModuleFromPolicy(depPolicy);
                    module.assignWorker(workersAvailable[workersAllotted + i], depPolicy);
                }
                workersAllotted += getting;
            }
           // console.log("last line of while policy index", policyIndex, "workers alloted",workersAllotted,
         //       "workers avaliable",workersAvailable.length,"depPolicy",depPolicy );
        }
        //console.log(workersAllotted,"Workers assigned to external contracts");
    },

    initialisePolicy: function(newPolicy) {
        var module = this.getModuleFromPolicy(newPolicy);
        if (undefined !== module) {
            if (!module.initialisePolicy(newPolicy)) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    },

    getPolicyCreeps: function (policyId) {
        var policiesCreeps = [];
        for ( var creep in Game.creeps)
        {
            if (creep.memory.policyId == policyID) {
                policiesCreeps.push(creep);
            }
        }
        return policiesCreeps;
    },

    getModuleFromPolicy: function(p) {
        var name = "policy." + p.type;
        if (p.type) {
            var modulePtr = require(name);
            return modulePtr;
        } else {
            return undefined;
        }
    },

    creepLifeTicks: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id})
        var life = 0;
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            life = life + creeps[i].ticksToLive;
        }
        return life;
    },
    
    creepsAgeFactor: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id})
        var life = 0;
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            life = life + creeps[i].ticksToLive;
        }
        return life/(creeps.length * 1500);       
    }

};

module.exports = policy;









































