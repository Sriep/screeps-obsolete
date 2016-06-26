/**
 * @fileOverview Screeps module. Abstract base object for handling policy 
 * decisions
 * @author Piers Shepperson
 */
 
/**
 * Abstract base object for policy decisions.
 * @module policy
 */
var policy = {

    //policyPeace:  require("policy.peace"),
    //policyConstruction:  require("policy.construction"),
    //policyDefend:  require("policy.defence"),
    //policyRescue:  require("policy.rescue"),   


   Type: {
        PEACE: "peace",
        CONSTRUCTION: "construction",
        DEFEND: "defence",
        RESCUE: "rescue",
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
        console.log("old policy is", JSON.stringify(oldPolicy));
        room.memory.currentPolicy =  oldPolicy.draftNewPolicyId(room);  ;      
        return require("policy." + room.memory.currentPolicy);
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