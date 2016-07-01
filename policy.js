/**
 * @fileOverview Screeps module. Abstract base object for handling policy 
 * decisions
 * @author Piers Shepperson
 */
 roleBase = require("role.base");
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

   Type: {
        PEACE: "peace",
        CONSTRUCTION: "construction",
        DEFEND: "defence",
        RESCUE: "rescue",
        FOREIGN_HARVEST: "foreign.harvest",
        FOREIGN_ROAD: "neutral.road",
        CLAIM: "claim"
    },

    createNeutralBuilderPolicy: function(startRoom, workRoom, sourceRoom, endRoom, workers, start) {
        var p = { id : this.getNextPolicyId(),
                        type : policy.Type.FOREIGN_ROAD,
                        startRoom : startRoom,
                        workRoom : workRoom,
                        sourceRoom : sourceRoom,
                        endRoom : endRoom,
                        workersContractedFor : workersContracted,
                        workersAssigned : 0,
                        shuttingDown : false};
        if (start) {
            this.activatePolicy(policy);
        }
        return p;
    },

    createRescuePolicy: function(room)
    {
        var p = { id : this.getNextPolicyId(),
                        type : policy.Type.RESCUE,
                        room : room};
        return p;
    },

    createPeacePolicy: function(room)
    {
        var p = { id : this.getNextPolicyId(),
            type : policy.Type.PEACE,
            room : room};
        return p;
    },

    createDefendPolicy: function(room)
    {
        var p = { id : this.getNextPolicyId(),
            type : policy.Type.DEFEND,
            room : room};
        return p;
    },

    createConstructionPolicy: function(room) {
        var p = { id : this.getNextPolicyId(),
            type : policy.Type.CONSTRUCTION,
            room : room};
        return p;
    },

    enactPolicies: function()
    {
       // Memory.policies = undefined;
        /*if (undefined === Memory.policies
            || null ===  Memory.policies
            ||  Memory.policies === [] ) {
            Memory.policies= [];
            var firstPolicy =  { id: 0,
                                    type: policy.Type.PEACE,
                                    room: "W26S21"};

            this.activatePolicy(firstPolicy);
        }*/
        this.checkRoomPolicies();
        var i = Memory.policies.length;
        while(i--) {
            var oldPolicy = require("policy." + Memory.policies[i].type);
            var newPolicyDetails = oldPolicy.draftNewPolicyId(Memory.policies[i]);
            if (newPolicyDetails === null) {
                console.log("Terminate policy",JSON.stringify(Memory.policies[i]));
                Memory.policies.splice(i, 1);
            } else if ( newPolicyDetails.id != Memory.policies[i].id) {
                var newPolicy = require("policy." + newPolicyDetails.type);
                this.activatePolicy(newPolicyDetails);
                newPolicy.switchPolicy(Memory.policies[i], newPolicyDetails);
                console.log("Removing old policy",JSON.stringify(Memory.policies[i]));
                Memory.policies.splice(i, 1);
                console.log("Enact new policy",JSON.stringify(newPolicyDetails));
                newPolicy.enactPolicy(newPolicyDetails);

            } else {
                console.log("Enact policy",JSON.stringify(Memory.policies[i]));
                oldPolicy.enactPolicy(Memory.policies[i]);
            } // if(newPolicyDetails !===
        } //while
    },
    
    checkRoomPolicies: function() {
        var policies = Memory.policies;
        for(var roomIndex in Game.rooms) {
            var room = Game.rooms[roomIndex]
            console.log("check poicies for room", room.name);
            var roomPolicy = this.getPolicyFromId(room.memory.policyId);
            var foundPolicy = false;

            var policiesToBeTerminated = [];
            for (var policyIndex in policies) {
                var policy = policies[policyIndex];
                console.log("checking policy", JSON.stringify(policy), "for room", room.name)
                if (policy.room !== undefined && policy.room == room.name) {
                    // Use the first policy found for the room terminate any others.
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
                this.terminate(policiesToBeTerminated[i].id);
            }

            // Room does not have a policy give it peace
            if (!foundPolicy) {
                var newPolicy = this.createPeacePolicy(room.name);
                console("New policy for room", room.name, "created", JSON.stringify(newPolciy));
                this.activatePolicy(newPolicy);
            }
        }

    },// for(var roomIndex in Game.rooms)

    shutDownPolicy: function (poicy) {
        policy.shuttingDown = true;
    },

    // Remove all policies with given id.
    terminate: function(policyId)   {
        var i = Memory.policies.length;
        while(i--) {
            if (Memory.policies[i].id == policyId) {
                Memory.policies.splice(i, 1);
            }
        }
    },


    supportBurden: function(policy)
    {
        var room = Game.rooms[policy.workRoom];
        var supportCount = 0;
        if (room !== undefined && room.dependantPolicies !== undefined)
        {
            dPolicies = room.memory.dependantPolices;
            for (var i in dPolicies) {
                var policy = this.getPolicyFromId(dPolicies[i]);
                supportCount = supportCount + policy.workersContractedFor - policy.workersAssigned;
            }
        }
        return supportCount;
    },

    reassignCreeps: function (oldPolicy, newPolicy) {
        for (var creep in Game.creeps) {
            if (Game.creeps[creep].memory.policyId = oldPolicy.id) {
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
        policyDetails.id = this.getNextPolicyId();
        return Memory.policies.push(policyDetails);
    },

    getPolicyFromId: function(id) {
        for (var i in Memory.policies)
        {
            if (Memory.policies[i].id == id) {
                return Memory.policies[i];
            }
        }
        return undefined;
    },

    breakUpLinks: function (room)
    {
        var creeps = room.find(FIND_MY_CREEPS);
        for (var i in creeps)
        {
            if (undefined == creeps[i].memory.role
            || "linker" == creeps[i].memory.role )  {
                creeps[i].memory.role = roleBase.Type.HARVESTER;
            }
        }
        room.memory.reservedSources = undefined;
    } ,

    energyStorageAtCapacity: function (room) {
        if (room.energyAvailable == room.energyCapacityAvailable) {
            var towers = room.find(FIND_MY_STRUCTURES,
                {filter: {structureType: STRUCTURE_TOWER}});
            for (var i in towers) {
                if (towers[i] === undefined) {
                    return truel
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
        var depPolicies = room.memory.dependantPolices;
        if (undefined == depPolicies) {
            return;
        }
        var workersAvailable = room.find(FIND_MY_CREEPS, {
            filter: function (creep) {
                return creep.memory.role == availableRole
                    && creep.memory.employerId == policy.id
            }
        });
        var policyIndex = 0;
        var workersAllotted = 0;

        while (policyIndex < depPolicies.length
                 && workersAllotted < avalable.length) {
            var depPolicy = this.getPolicyFromId(depPolicies[policyIndex].policyId);
            if (depPolicy !== null) {
                var needed = depPolicy.workersContractedFor - depPolicy.workersAssigned;
                var getting = Math.min(needed, workersAvailable.length - workersAllotted);
                for (var i = 0; i < getting ; i++) {
                    var module = this.getModuleFromPolicy(depPolicy);
                    module.assignWorker(workersAvailable[workersAllotted + i], policy);
                }
                workersAllotted += getting;
                depPolicy++;
            }
        }
    },

    getModuleFromPolicy: function(policy) {
            return require("policy." + policy.type);
    }
}

module.exports = policy;









































