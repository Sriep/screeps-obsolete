/**
 * @fileOverview Screeps module. Declaration of policies.
 * harvest policy.
 * @author Piers Shepperson
 */
policy = require("policy");
//raceClaimer = require("raceClaimer");

/**
 * Declaration of policies.
 * @module policy
 */
var public = {
    Type: {
        THE_POOL: "the.pool",
        PEACE: "peace",
        CONSTRUCTION: "construction",
        DEFEND: "defence",
        RESCUE: "rescue",
        FOREIGN_HARVEST: "foreign.harvest",
        FOREIGN_ROAD: "neutral.road",
        NEUTRAL_ROOM: "neutral.room",
        CLAIM: "claim",
        BUILD_SPAWN: "buildspawn",
        GIFT_WORKERS: "gift.workers"
    },

    createNeutralBuilderPolicy: function(startRoom
        , workRoom
        , sourceRoom
        , endRoom
        , workersContracted
        , start) {
        var newPolicy = { id : policy.getNextPolicyId(),
            type : this.Type.FOREIGN_ROAD,
            startRoom : startRoom,
            workRoom : workRoom,
            sourceRoom : sourceRoom,
            endRoom : endRoom,
            workersContractedFor : workersContracted,
            workersAssigned : 0,
            shuttingDown : false};
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            module.initilisePolicy(newPolicy)
            if (0 < policy.activatePolicy(newPolicy)) {
            } else {
            }
        }
        return newPolicy;
    },

    createClaimPolicy: function(startRoom, controllerId, endRoom, start) {
        var newPolicy = { id : policy.getNextPolicyId(),
            type : this.Type.CLAIM,
            startRoom : startRoom,
            controllerId : controllerId,
            endRoom : endRoom,
            workersContractedFor : 0,
            workersAssigned : 0,
            shuttingDown : false};
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            module.initilisePolicy(newPolicy)
            if (0 < policy.activatePolicy(newPolicy)) {
            } else {
            }
        }
        return newPolicy;
    },

    createGiftWorkersPolicy: function(startRoom, endRoom, numberGifted, start) {
        var newPolicy = { id : policy.getNextPolicyId(),
            type : this.Type.GIFT_WORKERS,
            startRoom : startRoom,
            endRoom : endRoom,
            workersContractedFor : numberGifted,
            workersAssigned : 0,
            workersDelivered : 0};
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            module.initilisePolicy(newPolicy)
            if (0 < policy.activatePolicy(newPolicy)) {
            } else {
            }
        }
        return newPolicy;
    },

    createRescuePolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.RESCUE,
            room : room};
        return p;
    },

    createNeutralRoomPolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.NEUTRAL_ROOM,
            room : room};
        return p;
    },

    createBuildspawn: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.BUILD_SPAWN,
            room : room};
        return p;
    },


    createPeacePolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.PEACE,
            room : room};
        return p;
    },

    createDefendPolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.DEFEND,
            room : room};
        return p;
    },

    createConstructionPolicy: function(room) {
        var p = {
            id : policy.getNextPolicyId(),
            type : this.Type.CONSTRUCTION,
            room : room
        };
        return p;
    },

    createThePool: function() {
        var p  = {
            id : 0,
            type : this.Type.THE_POOL,
            requisitions : [],
            supplies : []
        }
        return p;
    }
    
}



module.exports = public;


















































