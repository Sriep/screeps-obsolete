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
        FOREIGN_HARVEST: "foreign harvest",
        FOREIGN_ROAD: "build foreign road",
    },

    enactPolicies: function()
    {
        for(var i in Game.rooms) {
            var currentPolicy = this.determinePolicy(Game.rooms[i]);
            currentPolicy.enactPolicy(Game.rooms[i])
        }
    },

    determinePolicy(room)
    {      
        var oldPolicy = require("policy." + this.currentPolicyId(room)); 
        var oldPolicyId = this.currentPolicyId(room);
        room.memory.currentPolicy =  oldPolicy.draftNewPolicyId(room);  
        var newPolicy = require("policy." + room.memory.currentPolicy)
        if (oldPolicy != newPolicy) {
           newPolicy.switchPolicy(room, oldPolicyId)
        }
        console.log("Policy for room", room.name,"is",room.memory.currentPolicy);    
        return newPolicy;
    },

    currentPolicyId: function(room)
    {
        if (room.memory.currentPolicy === undefined)
        {
            room.memory.currentPolicy = "peace";
        }       
        return room.memory.currentPolicy;
    },

    workerBuildSize: function(room) 
    {
        return policy.LINKING_WORKER_SIZE;
        //return raceWorker.maxSizeRoom(room);
    },

    breakUpLinks: function (room)
    {
        creeps = room.find(FIND_MY_CREEPS);
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
                if (tower[i].energy != tower[i].energyCapacity) {
                    return false;
                }
            }
            return true;
        } else {
            return false
        }
    },

    
}

module.exports = policy;