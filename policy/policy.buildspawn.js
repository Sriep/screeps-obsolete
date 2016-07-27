/**
 * Created by Piers on 02/07/2016.
 */
/**
 * @fileOverview Screeps module. Apolicy object for neutral rooms. Kind of empty wrapper.
 * @author Piers Shepperson
 */
//Bace object
var policy = require("policy");
var policyFrameworks = require("policy.frameworks");
var roleBase = require("role.base");
var raceBase = require("race.base");
var stats = require("stats");
var gc = require("gc");
var raceWorker = require("race.worker");


/**
 * Abstract policy object for neutral rooms. Kind of empty wrapper.
 * @module policyDefence
 */
var policyBuildspawn = {

    /**
     * Determins what the new polciy of or the comming tick should be.
     * This will changed if all enemy units are removed.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick.
     */
    draftNewPolicyId: function(oldPolicy) {
        console.log("policy build spawn");
        var room = Game.rooms[oldPolicy.room];
        if (undefined === room)
            return oldPolicy;
        if (this.spawnFound(oldPolicy)){
            return policyFrameworks.createPeacePolicy(room.name);
        }
        return oldPolicy;
    },

    initialisePolicy: function (newPolicy) {
        return true;
    },

    spawnFound: function (policy) {
        var room = Game.rooms[policy.room];
        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns === undefined || spawns[0] === undefined) {
            return  false;
        }
        return true;
    },
    

    /**
     * Handles defence of the room.
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none}
     */
    enactPolicy: function(currentPolicy) {
        console.log("buildspawn enact",currentPolicy,currentPolicy.room);
         var room = Game.rooms[currentPolicy.room];
     //   stats.updateStats(room);


        var source = room.find(FIND_SOURCES);
        var spawnSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: { structureType:  STRUCTURE_SPAWN }
        });
        var role;
        if (room.controller.level < 2)
        {
            role = gc.ROLE_UPGRADER;
        } else {
            role = gc.ROLE_BUILDER;
        }

        var creeps = room.find(FIND_MY_CREEPS);
        console.log("In build spawn",room,"creeps",creeps.length);
        for(var i = 0 ; i < creeps.length ; i++ ) {
            if (raceWorker.isWorker(creeps[i].body)) {
                if (creeps[i].memory.role != role) {
                    roleBase.switchRoles(creeps[i], role);
                }

            }

            /*
            if (creeps[i].memory.policyId != currentPolicy.id)
            {
                console.log(creeps[i] in room);
                creeps[i].memory.role = roleBase.Type.SPAWN_BUILDER;
                creeps[i].memory.targetRoom = currentPolicy.room;
                creeps[i].memory.sourceRoom = currentPolicy.room;
                creeps[i].memory.targetRoom = currentPolicy.room;
                creeps[i].memory.workRoom = currentPolicy.room;
                creeps[i].memory.startRoom = currentPolicy.room;
                creeps[i].memory.policyId = currentPolicy.id;
                creeps[i].memory.task = roleBase.Task.HARVEST;
                if (source.length >0) {
                    creeps[i].memory.targetSourceId = source[0].id;
                    creeps[i].memory.offloadTargetId = undefined;
                } else if (spawnSites.length >0) {
                    creeps[i].memory.targetSourceId = undefined;
                    creeps[i].memory.offloadTargetId = spawnSites[0].id;
                }
            }*/
        }
    },

    switchPolicy: function(oldPolicyId, newPolicy)
    {
        switch(oldPolicyId) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.PEACE:
            default:
        }
        policy.reassignCreeps(oldPolicyId, newPolicy);
    },

}

module.exports = policyBuildspawn;
















