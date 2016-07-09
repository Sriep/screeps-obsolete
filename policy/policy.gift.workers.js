/**
 * Created by Piers on 02/07/2016.
 */
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
raceBase = require("race.base");
raceWorker = require("race.worker");
raceInfantry = require("race.infantry");
roleBase = require("role.base");


/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyRescue
 */
var policyGiftWorkers = {

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
        //return null;
        var creeps = _.filter(Game.creeps, (creep) =>
                    (creep.memory.endRoom == creep.room.name
                    && creep.policyId == oldPolicy.id));

        for (var i in creeps) {
            oldPolicy.workersDelivered++;
            this.clearCreep();
        }
        if (oldPolicy.workersDelivered >= oldPolicy.workersContractedFor) {
            console.log("Shutting down gift workers", creeps.length,
                "delivered",oldPolicy.workersDelivered,"contracted",oldPolicy.workersContractedFor);
            return null;
        }
        return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
        console.log("In gift worker",policy.type, "with",creep);
        creep.memory.role = roleBase.Type.NEUTRAL_BUILDER;
        creep.memory.policyId = policy.id;
        creep.memory.startRoom = policy.startRoom;
        creep.memory.endRoom = policy.endRoom;
        creep.memory.sourceRoom = policy.endRoom;
        creep.memory.workRoom = policy.endRoom;
        creep.memory.targetRoom = policy.endRoom;
        creep.memory.targetSourceId = 0;
        policy.workersAssigned = policy.workersAssigned  +1;
    },

    clearCreep: function(creep) {
        creep.memory.role = roleBase.Type.TRAVELLER;
        creep.memory.policyId = undefined;
        creep.memory.startRoom = undefined;
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
    }

}

module.exports = policyGiftWorkers;







































