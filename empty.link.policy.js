/**
 * Created by Piers on 29/06/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for Policy of building
 * roads in neutral territy
 * @author Piers Shepperson
 */
//Base object
policy = require("policy");
roleBase = require("role.base");

//policyConstruction = require("policy.construction");
//policyDefence = require("policy.defence");
//policyPeace= require("policy.peace");
raceBase = require("race.base");
raceWorker = require("race.worker");
roleBase = require("role.base");


/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyRescue
 */
var policyNeutralRoad = {

    initialisePolicy: function (newPolicy) {
        if (undefined == newPolicy) {
            return false;
        }
        console.log("In activatePolicy", JSON.stringify( newPolicy));
        var room = Game.rooms[newPolicy.startRoom];
        if (undefined !== room) {
            policy.pushDependantPolicy(room, newPolicy);
        } else {
            return false;
        }
    },



    draftNewPolicyId: function(oldPolicy) {
        console.log("In policyNeutralRoad draftNewPolicyId");
        return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
        console.log("In neutralbuilder",policy.type, "with",creep);
        creep.memory.role = roleBase.Type.NEUTRAL_BUILDER;
        creep.memory.policyId = policy.id;
        creep.memory.startRoom = policy.startRoom;
        creep.memory.workRoom = policy.workRoom;
        creep.memory.sourceRoom = policy.sourceRoom;
        creep.memory.endRoom = policy.endRoom;
        policy.workersAssigned = policy.workersAssigned  +1;
    },

    clearCreep: function(creep) {
        creep.memory.role = roleBase.Type.HARVESTER;
        creep.memory.policyId = undefined;
        creep.memory.startRoom = undefined;
        creep.memory.workRoom = undefined;
        creep.memory.sourceRoom = undefined;
        creep.memory.endRoom = undefined;
        policy.workersAssigned--;
    },
    
    cleanUp: function(oldPolicy)
    {
        for (var i in Game.creeps)
        {
            if (Game.creeps[i].memory.policyId !== undefined
                &&  Game.creeps[i].memory.policyId  == oldPolicy.id) {
                this.clearCreep(Game.creeps[i]);
            }
        }
        var index = Game.rooms[oldPolicy.sourceRoom].dependantPolicies.indexOf(oldPolicy.id);
        if (index > 0) {
            Game.rooms[OldPolicy.sourceRoom].dependantPolicie.splice(index);
        }
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
        console.log("enact build neutral road");
    }

}

module.exports = policyNeutralRoad;