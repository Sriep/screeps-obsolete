"use strict";
/**
 * @fileOverview Screeps module. Abstract base object for handling policy 
 * decisions
 * @author Piers Shepperson
 */
var gc = require("gc");
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
        for (var i in Memory.policies) {
            var oldPolicyModule = this.getModuleFromPolicy(Memory.policies[i]);
            var newPolicyDetails = oldPolicyModule.prototype.draftNewPolicyId(Memory.policies[i]);
            if (newPolicyDetails === null) {
                delete Memory.policies[i];
            } else if ( newPolicyDetails.id != Memory.policies[i].id) {
                console.log("new policy")
                var newPolicyModule = this.getModuleFromPolicy(newPolicyDetails);
                this.activatePolicy(newPolicyDetails);
                newPolicyModule.prototype.switchPolicy(Memory.policies[i], newPolicyDetails);
                delete Memory.policies[i];
                newPolicyModule.prototype.enactPolicy(newPolicyDetails);
            } else {
                oldPolicyModule.prototype.enactPolicy(Memory.policies[i]);
            }
        } // for
    },


    /**
     * @var Memory        Screeps Memory object
     * @var Memory.policies  List of active policies.
     */
    checkRoomPolicies: function() {
        var policies = Memory.policies;
        if (policies === undefined)  policies = {};

        for(var roomIndex in Game.rooms) {
            var room = Game.rooms[roomIndex]
            var foundPolicy = false;
            var policiesToBeTerminated = [];

            for (var policyIndex in policies) {
                var policy = policies[policyIndex];
                //console.log("checkRoomPolicies", policy.room,room.)
                if (policy.roomName !== undefined && policy.roomName == room.name) {
                    // Use the first policy found for the room terminate any others.
                    //console.log("found polciy for room", room);
                    if (!foundPolicy) {
                        foundPolicy = true;
                        room.policyId = policy.id;
                        room.currentPolicy = policy.type;
                    } else {
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
                var PolicyPeace = require("policy.peace");
                var PolicyNeutralRoom = require("policy.neutral.room");
                var newPolicy;
                if (room.controller != undefined && room.controller.my) {
                    newPolicy = new PolicyPeace(room.name);
                    console.log("Create peace policy for room",room.name);
                    this.activatePolicy(newPolicy);
                } else {
                    newPolicy = new PolicyNeutralRoom(room.name);
                    console.log("Create neutral room policy for room",room.name);
                    this.activatePolicy(newPolicy);
                }
            }//(!foundPolicy)
        }// for(var roomIndex in Game.rooms)

    },

    // Remove all policies with given id.
    terminate: function(policyId)   {
        delete Memory.policies[policyId];
        //Memory.policies[policyId] = undefined;
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
        if (undefined === policyDetails.id ) {
            policyDetails.id = this.getNextPolicyId();;
        }
        if (undefined === Memory.policies){
            Memory.policies = {};
        }
        var module = this.getModuleFromPolicy(policyDetails);
        if (undefined === module) {
            return false;
        }
        console.log("making policy", policyDetails.id);
        Memory.policies[policyDetails.id] = policyDetails;
        if (undefined  !== module.prototype.initialisePolicy
            && typeof module.prototype.initialisePolicy === "function") {
            console.log("Initialising policy", policyDetails.id, JSON.stringify(policyDetails));
            module.prototype.initialisePolicy(policyDetails)
        }
        return true;
    },

    getPolicyFromId: function(id) {
        return Memory.policies[id];
    },

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

    getModuleFromPolicy: function(p) {
        var name = "policy." + p.type;
        //console.log("getModuleFromPolicy",p)
        if (p.type) {
            var modulePtr = require(name);
            return modulePtr;
        } else {
            return undefined;
        }
    },

    creepLifeTicks: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id});
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









































