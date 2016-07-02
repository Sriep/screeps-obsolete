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

    createNeutralBuilderPolicy: function(startRoom
                                        , workRoom
                                        , sourceRoom
                                        , endRoom
                                        , workersContracted
                                        , start) {
        var newPolicy = { id : this.getNextPolicyId(),
                        type : policy.Type.FOREIGN_ROAD,
                        startRoom : startRoom,
                        workRoom : workRoom,
                        sourceRoom : sourceRoom,
                        endRoom : endRoom,
                        workersContractedFor : workersContracted,
                        workersAssigned : 0,
                        shuttingDown : false};
        if (start) {
            var module = this.getModuleFromPolicy(newPolicy);
            module.initilisePolicy(newPolicy)
            if (0 < this.activatePolicy(newPolicy)) {
                console.log("Created policy", newPolicy.type);
            } else {
                console.log("failed to activate policy", newPolicy.type)
            }
        }
        return newPolicy;
    },

    initilisePolicy: function(newPolicy) {
        var module = this.getModuleFromPolicy(newPolicy)
        if (undefined !== module) {
            if (!module.initilisePolicy(newPolicy)) {
                console.log("Failed to initilise policy",newPolicy.type)
                return false;
            }
        } else {
            console.log("Failed to load module for",newPolicy.type);
            return false;
        }
        return true;
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
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
        console.log("START CREATEPEACEPOLICT",room.name);
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
        this.checkRoomPolicies();
        var i = Memory.policies.length;
        while(i--) {
            var oldPolicy = this.getModuleFromPolicy(Memory.policies[i]);
            var newPolicyDetails = oldPolicy.draftNewPolicyId(Memory.policies[i]);
            if (newPolicyDetails === null) {
                console.log("Terminate policy",Memory.policies[i].type,Memory.policies[i].id);
                Memory.policies.splice(i, 1);
            } else if ( newPolicyDetails.id != Memory.policies[i].id) {
                var newPolicy = this.getModuleFromPolicy(newPolicyDetails);
                this.activatePolicy(newPolicyDetails);
                newPolicy.switchPolicy(Memory.policies[i], newPolicyDetails);
                console.log("Removing old policy",Memory.policies[i].type,"id", Memory.policies[i].id );
                Memory.policies.splice(i, 1);
                console.log("Enact new policy",newPolicyDetails.type,newPolicyDetails.id);
                newPolicy.enactPolicy(newPolicyDetails);

            } else {
                console.log("Enact policy",Memory.policies[i].type, Memory.policies[i].id);
                oldPolicy.enactPolicy(Memory.policies[i]);
            } // if(newPolicyDetails !===
        } //while
    },
    
    checkRoomPolicies: function() {
        var policies = Memory.policies;
        for(var roomIndex in Game.rooms) {
            var room = Game.rooms[roomIndex]
            var roomPolicy = this.getPolicyFromId(room.memory.policyId);
            var foundPolicy = false;
            var policiesToBeTerminated = [];
            for (var policyIndex in policies) {
                var policy = policies[policyIndex];
                if (policy.room !== undefined && policy.room == room.name) {
                    // Use the first policy found for the room terminate any others.
                    console.log("found polcy for room", room);
                    if (!foundPolicy) {
                        foundPolicy = true;
                        room.policyId = policy.id;
                        room.currentPolicy = policy.type;
                        console.log("first");
                    } else {
                        console.log("susequent to be reomved");
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
                var newPolicy = this.createPeacePolicy(room.name);
                console.log("checkRoomPolicies");
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

    supportBurden: function(room)
    {
       // var room = Game.rooms[policy.workRoom];
        var supportCount = 0;
        if (room !== undefined && room.memory.dependantPolicies !== undefined)
        {
            dPolicies = room.memory.dependantPolicies;
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
        policyDetails.id = this.getNextPolicyId();
        if (undefined === Memory.policies){
            Memory.policies = [];
        }
        var module = this.getModuleFromPolicy(policyDetails);
        console.log("activatePolicy id",policyDetails.id,"module",module);
        if (module.initilisePolicy(policyDetails)) {
            return Memory.policies.push(policyDetails);
        } else {
           return 0;
        }
    },

    pushDependantPolicy: function (room,dPolicy) {
        if (undefined !== room) {
            if (undefined === room.memory.dependantPolicies
                || null === room.memory.dependantPolicies)
            {
                room.memory.dependantPolicies = [];
            }
            room.memory.dependantPolicies.push(dPolicy.id);
            console.log("InpushDependantPolicy about to return ture",room,dPolicy );
            return true;
        } else {
            return false;
        }
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

    convertContractWorkers: function(room, policy, availableRole,freeWorkers) {
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
     //   console.log("leaving convertContractWorkers");
    },

    getModuleFromPolicy: function(policy) {
        var name = "policy." + policy.type;
        var modulePtr = require(name);
        //console.log("getModuleFromPolicy name",name);
        return modulePtr;
    }
}

module.exports = policy;









































