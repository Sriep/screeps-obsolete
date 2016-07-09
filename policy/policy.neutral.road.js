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
var _ = require('lodash');
//policyConstruction = require("policy.construction");
//policyDefence = require("policy.defence");
//policyPeace= require("policy.peace");
raceBase = require("race.base");
raceWorker = require("race.worker");
raceInfantry = require("race.infantry");
roleBase = require("role.base");


/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyRescue
 */
var policyNeutralRoad = {

    initilisePolicy: function (newPolicy) {
        if (undefined == newPolicy) {
            return false;
        }
        var room = Game.rooms[newPolicy.startRoom];
        if (undefined !== room) {
            policy.pushDependantPolicy(room, newPolicy);
        } else {
            return false;
        }
        return true;
    },



    draftNewPolicyId: function(oldPolicy) {
        var room = Game.rooms[oldPolicy.workRoom]
        if (undefined !== room) {
            sites = room.find(FIND_MY_CONSTRUCTION_SITES);
            if (undefined === sites || sites.length == 0) {
                oldPolicy.shuttingDown = true;
                console.log("Policy id", oldPolicy.id, "is shutting down");
            }
        }
        if (oldPolicy.shuttingDown) {
            var stillCreepsToSendHowe = false;
            for (var i in Game.creeps)
                if (Game.creeps[i].policy !== undefined
                    && Game.creeps[i].memory.policy.id == oldPolicy.id) {
                    if (Game.creep[i].memory.endRoom == oldPolicy.endRoom) {
                        this.clearCreep();
                    } else {
                        stillCreepsToSendHowe = true;
                    }
                }
            if (stillCreepsToSendHowe) {
                return oldPolicy;
            } else {
                this.cleanUp(oldPolicy);
                return null;
            }
        }
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
       // var index = Game.rooms[oldPolicy.sourceRoom].dependantPolicies.indexOf(oldPolicy.id);
      //  if (index > 0) {
      //      Game.rooms[OldPolicy.sourceRoom].dependantPolicie.splice(index);
       // }
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        console.log("Enact Neutral worker, id",currentPolicy.id,"booked workers"
            , currentPolicy.workersAssigned,"creeps assigned",creeps.length );
        if (!currentPolicy.shuttingDown) {
            //If a creep has died, reinstate the request for workers
            currentPolicy.workersAssigned = creeps.length;
        }
    }

}

module.exports = policyNeutralRoad;







































