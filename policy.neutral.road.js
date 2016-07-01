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
raceInfantry = require("race.infantry");
roleBase = require("role.base");


/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyRescue
 */
var policyNeutralRoad = {

    draftNewPolicyId: function(oldPolicy) {
        var workRoom = Game.rooms[oldPolicy.workRoom];
        //If cannot find existing room all the creeps much have left.
        //If no more build sits left we wish to stop building, and shut down if all creeps
        //have return to end room.
        var shuttingDown = ((workRoom === undefined || workroom == null)
                                 && oldPolicy.shuttingDown == true )
                            || (workRoom !== undefined &&
                                workRoom.find(FIND_CONSTRUCTION_SITES).length == 0)

        if (shuttingDown) {
            var stillCreepsToSendHowe = false;
            for (var i in Game.creeps)
            {
                if (Game.creeps[i].policy !== undefined
                    && Game.creeps[i].memory.policy.id == oldPolicy.id) {
                    if (Game.creep[i].memory.endRoom == oldPolicy.endRoom)
                    {
                        this.clearCreep();
                    } else {
                        stillCreepsToSendHowe = true;
                    }
                }
            }
            if (stillCreepsToSendHowe) {
                return oldPolicy;
            } else {
                this.cleanUp(oldPolicy);
                return null;
            }
        } else {
            return oldPolicy;
        }
    },

    assignWorker: function(creep, policy)
    {
        creep.memory.role = roleBase.Type.NEUTRAL_BUILDER;
        creep.memory.policyId = policy.id;
        creep.memory.startRoom = policy.startRoom;
        creep.memory.workRoom = policy.workRoom;
        creep.memory.sourceRoom = policy.sourceRoom;
        creep.memory.endRoom = policy.endRoom;
        policy.workersAssigned++;
    }

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