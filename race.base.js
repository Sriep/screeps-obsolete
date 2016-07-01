/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for use by my creeps. 
 * @author Piers Shepperson
 */
 
//var roomOwned = require("room.owned");
var raceWorker = require("race.worker"); 
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
//var roadBuilder = require("road.builder");
var roleBase = require("role.base");
var roleNeutralBuilder = require("role.neutral.builder")

/**
 * Abstract base object containing data and functions for use by my creeps.
 * This contains data and functions common to all races of creep. 
 * @module raceBase
 */
var raceBase = {

    spawn: function (race, policy, spawn, creepSize) {
       // console.log("in spawn policy ", JSON.stringify(policy));
        if (creepSize == undefined) {
            creepSize = 1;
        } 
        var cost = race.BLOCKSIZE * creepSize;
        var body = race.body(cost);
        var canDo = spawn.canCreateCreep(body)
        if (canDo != OK) {
            return canDo;
        }
        console.log("spawning creep, size". creepSize, "boidy", body);
        var result = spawn.createCreep(
                body, undefined, {role: race.ROLE_DEFULT, policyId: policy.id});
        if(_.isString(result)) {
            console.log("New creep produced with name:", result);
        }


        return result;
    }, // spawn	

    countBodyParts: function (creeps, part) {
        var count = 0;
        for (var i in creeps) {
            count = count + creeps[i].getActiveBodyparts(part);
        }
        return count;
    },

    moveCreeps: function () {
       // for (var roomindex  in  Game.rooms) {
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            if (creep.memory.role == raceWorker.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            } else if (creep.memory.role == raceWorker.ROLE_UPGRADER) {
                roleUpgrader.run(creep);
            } else if (creep.memory.role == raceWorker.ROLE_BUILDER) {
                roleBuilder.run(creep);
            } else if (creep.memory.role == raceWorker.ROLE_REPAIRER) {
                roleRepairer.run(creep);
            } else if (creep.memory.role == roleBase.Type.NEUTRAL_BUILDER) {
                roleNeutralBuilder.run(creep, creep.room);
            }
        }
    }
}

module.exports = raceBase;