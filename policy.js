/**
 * @fileOverview Screeps module. Abstract base object for handling policy 
 * decisions
 * @author Piers Shepperson
 */
 
/**
 * Abstract base object for policy decisions.
 * @module raceBase
 */
var policy = {

    //policyPeace:  require("policy.peace"),
    //policyConstruction:  require("policy.construction"),
    //policyDefend:  require("policy.defence"),
    //policyRescue:  require("policy.rescue"),   


    Policy: {
        PEACE: "peace",
        CONSTRUCTION: "construction",
        DEFEND: "defence",
        RESCUE: "rescue",
    },

    enactPolicies: function()
    {
        policyPeace = require("policy.peace");
        for(var i in Game.rooms) {
            var currentPolicy = determinePolicy(Game.rooms[i]);
            currentPolicy.enactPolicy(Game.rooms[i])
        }
    },

    determinePolicy(room)
    {
        var oldPolicy = require("policy." + this.currentPolicyId(room)); 
        console.log("old policy is", JSON.stringify(oldPolicy));
        var newPolicyId = oldPolicy.draftNewPolicyId(room);  
        room.memory.currentPolicy =  newPolicyId;      
        return require("policy." + newPolicyId);
    },

    currentPolicyId: function(room)
    {
        if (room.memory.currentPolicy === undefined)
        {
            room.memory.currentPolicy = "peace";
        }       
        return room.memory.currentPolicy;
    }
}

module.exports = policy;