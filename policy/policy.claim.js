/**
 * @fileOverview Screeps module. Abstract object for handling the foreign 
 * harvest policy. 
 * @author Piers Shepperson
 */
var policy = require("policy");
var policyFrameworks = require("policy.frameworks");

/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module policy
 */
var policyClaim = {

    
    initilisePolicy: function (newPolicy) {
        if (undefined == newPolicy) {
            return false;
        }
        var room = Game.rooms[newPolicy.startRoom];
        if (undefined !== room) {
           // policyDeclarations.pushDependantPolicy(room, newPolicy);
        } else {
            return false;
        }
        return true;
    },

    assignWorker: function(creep, policy)
    {
        creep.memory.role = roleBase.Type.NEUTRAL_BUILDER;
        creep.memory.policyId = policy.id;
        creep.memory.startRoom = policy.startRoom;
        creep.memory.controllerId = policy.controllerId;
        creep.memory.endRoom = policy.endRoom;
        policy.workersAssigned = policy.workersAssigned  +1;
    },

    draftNewPolicyId: function (oldPolicy) {
        contoller = Game.getObjectById(oldPolicy.controllerId);
       /* if (contoller.my) {
            if (undefined === Game.creep[oldPolicy.ownedCreep]
                || Game.creep[oldPolicy.ownedCreep].room.name == oldPolicy.endRoom )  {
                cleanUp();
                return null;
            }
            else  {
                shuttingDown = true;
            }
        }*/
        return oldPolicy;
    },


    enactPolicy: function (currentPolicy) { //CLAIMER_BODY
        //if(currentPolicy.worker = undefined) {
        //
         //   var  worker = raceBase.spawn(raceClaimer,currentPolicy,)
        //}

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
    },

    clearCreep: function(creep) {
        creep.memory.role = roleBase.Type.HARVESTER;
        creep.memory.policyId = undefined;
        creep.memory.controllerId = undefined;
        creep.memory.startRoom = undefined;
        creep.memory.endRoom = undefined;
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
    },

};

module.exports = policyClaim;

























