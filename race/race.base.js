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
var stats = require("stats");
var tasks = require("tasks");
var roleNeutralBuilder = require("role.neutral.builder")

/**
 * Abstract base object containing data and functions for use by my creeps.
 * This contains data and functions common to all races of creep. 
 * @module raceBase
 */
var raceBase = {

    spawn: function (race, policy, spawn, creepSize) {
     //   console.log("in spawn policy ",race,"creepsize",creepSize, JSON.stringify(policy));
        if (creepSize == undefined) {
            creepSize = 1;
        } 
        var cost = race.BLOCKSIZE * creepSize;
        var body = race.body(cost);
        var canDo = spawn.canCreateCreep(body)
        if (canDo != OK) {
            return canDo;
        }
    //    console.log("spawning creep, size". creepSize, "boidy", body);
        var result = stats.createCreep(spawn, body, undefined, policy.id);
       // var result = spawn.createCreep(body, undefined, {policyId: policy.id});
        if(_.isString(result)) {
            raceBase.setRole(Game.creeps[result], race.ROLE_DEFULT);
            console.log("New creep produced with name:", result,JSON.stringify(result));
        }
        return result;
    }, // spawn

    setRole: function (creep, role) {
        if (creep) {
            creep.memory.role = role;
            roleBase.convert(creep, role);
        }
        //       console.log("In set role converted somethig",creep,role);
        //  }
    },
    
 

    getEnergyFromBody: function (body) {
     //   console.log("getEnergyFromBody boidy length",body.length);
        var energy = 0;
        for (var part = 0 ; part < body.length ; part++ ) {
            switch (body[part].type) {
                case MOVE:
                    energy += 50; break;
                case WORK:
                    energy += 100; break;
                case CARRY:
                    energy += 50; break;
                case ATTACK:
                    energy += 80; break;
                case RANGED_ATTACK:
                    energy += 150; break;
                case HEAL:
                    energy += 250; break;
                case CLAIM:
                    energy += 600; break;
                case TOUGH:
                    energy += 10; break;
                default:
                    //Invalid body part
                    console.log("invalid part",part, JSON.stringify(body));
                    return 0;
            }
        }
       // console.log("getEnergyFromBody boidy energy",energy);
        return energy;
    },

    countBodyParts: function (creeps, part) {
        var count = 0;
        for (var i in creeps) {
            count = count + creeps[i].getActiveBodyparts(part);
        }
        return count;
    },

    moveCreeps: function () {
        console.log("MOVE CREEPS");
        stats.initiliseTick();
        for (var creepName in Game.creeps) {
            roleBase.run(Game.creeps[creepName]);
        }
        stats.upadateTick();
    },

    newMove: function () {
        for (var creepNaame in Game.creeps) {
            var creep = Game.creeps[creepNaame];
            tasks.doTasks(creep);
        }
    }
}

module.exports = raceBase;





























