/**
 * Created by Piers on 02/07/2016.
 */
/**
 * @fileOverview Screeps module. Apolicy object for neutral rooms. Kind of empty wrapper.
 * @author Piers Shepperson
 */
//Bace object
var policy = require("policy");
var roleBase = require("role.base");
var raceBase = require("race.base");
var stats = require("stats");
var gc = require("gc");
var raceWorker = require("race.worker");


/**
 * Abstract policy object for neutral rooms. Kind of empty wrapper.
 * @module PolicyBuildspawn
 */
function PolicyBuildSpawn (roomName) {
    this.type = gc.POLICY_BUILD_SPAWN;
    this.roomName = roomName;
}

PolicyBuildSpawn.prototype.draftNewPolicyId = function(oldPolicy) {
    var room = Game.rooms[oldPolicy.roomName];
    if (undefined === room)
        return oldPolicy;
    if (this.spawnFound(oldPolicy)){
        var PolicyPeace = require("policy.peace");
        return new PolicyPeace(oldPolicy.roomName);
    }
    return oldPolicy;
};

PolicyBuildSpawn.prototype.initialisePolicy = function (newPolicy) {
    return true;
};

PolicyBuildSpawn.prototype.spawnFound = function (policy) {
    var room = Game.rooms[policy.roomName];
    var spawns = room.find(FIND_MY_SPAWNS);
    if (spawns === undefined || spawns[0] === undefined) {
        return  false;
    }
    return true;
};


/**
 * Handles defence of the room.
 * @param   {Object} room  The room that might need rescuing.
 * @returns {none}
 */
PolicyBuildSpawn.prototype.enactPolicy = function(currentPolicy) {
    console.log("buildspawn enact",currentPolicy,currentPolicy.room);
    var room = Game.rooms[currentPolicy.roomName];

    var creeps = room.find(FIND_MY_CREEPS);
    //console.log("In build spawn",room,"creeps",creeps.length);
    for(var i = 0 ; i < creeps.length ; i++ ) {
        if (raceWorker.isWorker(creeps[i].body)) {
            if (creeps[i].memory.policyId != currentPolicy.id) {
                roleBase.switchRoles(creeps[i], gc.ROLE_FLEXI_STORAGE_PORTER);
            }

        }
    }
};

PolicyBuildSpawn.prototype.switchPolicy = function(oldPolicyId, newPolicy)
{
    policy.reassignCreeps(oldPolicyId, newPolicy);
};



module.exports = PolicyBuildSpawn;
















