/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for use by my creeps. 
 * @author Piers Shepperson
 */
"use strict";
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
var gc = require("gc");
var roleNeutralBuilder = require("role.neutral.builder")

/**
 * Abstract base object containing data and functions for use by my creeps.
 * This contains data and functions common to all races of creep. 
 * @module raceBase
 */
var raceBase = {

    spawn: function (race, policy, spawn, creepSize) {
        //console.log("in spawn policy ",race,"creepsize",creepSize, JSON.stringify(policy));
        if (creepSize == undefined) {
            creepSize = 1;
        }
        var body = race.body(creepSize);
        //console.log("ceeps body", JSON.stringify(body))
        var canDo = spawn.canCreateCreep(body)
        if (canDo != OK) {
            return canDo;
        }
        //console.log("spawning creep, size". creepSize, "body");
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
    },

    isCreep: function (creep, race, size) {
        var isRace = false;
        var isSize = false;
        if (creep === undefined || undefined === creep.memory)
            return false;

        if (undefined === creep.memory.race) {
            var raceFromBody = this.getRaceFromBody(creep.body);
            creep.memory.race = raceFromBody;
            isRace = (raceFromBody == race);
        } else {
            isRace = (creep.memory.race == race);
        }

        if (!isRace)
            return false;
        if ( undefined === size)
            return isRace;

        if (undefined === creep.memory.size) {
            var module = this.getModuleFromRace(race);
            var sizeFromBody = module.creepSize(creep.body);
            creep.memory.size = sizeFromBody;
            isSize = (sizeFromBody == size);
        } else {
            isSize = (creep.memory.size == size);
        }
        return (isSize);
    },

    convertBodyToArray: function (body){
        if (!Array.isArray(body)) return undefined;
        if (undefined == body[0].type) {
            return body;
        } else {
            return Array.from(body, function(part) {return part.type});
        }
    },

    occurancesInBody: function(body, bodyPart) {
        body = this.convertBodyToArray(body);
        if (undefined === body) return 0;
        var count = 0;
        for ( var i = 0 ; i < body.length ; i++ ) {
            if (bodyPart == body[i]) count++;
        }
        return count;
    },

    getRaceFromBody: function (body) {
        if (raceWorker.isWorker(body)) {
            return gc.RACE_WORKER;
        }
        return undefined;
    },

    getModuleFromRace: function (race){
        if (undefined !== race) {
            var name = "race." + race;
            var modulePtr = require(name);
            //console.log("race",race,"name",name,"module",modulePtr);
            return modulePtr;
        }  else {
            return undefined;
        }
    },
 

    getEnergyFromBody: function (body) {
     //   console.log("getEnergyFromBody boidy length",body.length);
        var energy = 0;
        for (var i = 0 ; i < body.length ; i++ ) {
           // console.log("getEnergyFromBody body[part].type",body[part].type, "body[part]",body[part]);
           var part = body[i].type;
            if (undefined === part) {
                part = body[i];
             //   console.log("getEnergyFromBody part",part,"body[i]",body[i],"body[i].type",body[i].type);
            }
            switch (part) {
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
                    console.log("getEnergyFromBody Invalid body part", part);
                    //Invalid body part
                    return 0;
            } //switch
        } //for
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

    REFILL_PERCENTAGE: 50,
    moveCreeps: function () {
        console.log("MOVE CREEPS");
        stats.initiliseTick();

        for (var creepName in Game.creeps) {
            roleBase.run(Game.creeps[creepName]);

            if (gc.ROLE_UNASSIGNED == Game.creeps[creepName].memory.role) {
                this.recycleCreep(Game.creeps[creepName]);
            } //  if (Game.creeps[creepName].memory.role = ROLE_UNASSIGNED)
            
        } //  for (var creepName in Game.creeps)
        stats.upadateTick();
    },

    recycleCreep: function (creep) {
        var spawns = Game.spawns;
        for (var spawn in spawns ) {
            if (spawns[spawn].pos.inRangeTo(creep,1))
            {
                var liftimeFracLeft = (CREEP_LIFE_TIME - creep.ticksToLive)/ CREEP_LIFE_TIME;
                var energyCreep = this.getEnergyFromBody(creep.body) * liftimeFracLeft;
                console.log(creep,"recyle ticks" ,creep.ticksToLive, "frac"
                    , liftimeFracLeft, "energy",energyCreep);

                var usedCapacity = spawns[spawn].energyCapacity - spawns[spawn].energy;
                var pctUsed = usedCapacity * 100 / spawns[spawn].energyCapacity;
 console.log(creep,"recyleCreep at spawn ",spawns[spawn], "usedCapacity", usedCapacity, "pctUsed>30", pctUsed);
                if (pctUsed > this.REFILL_PERCENTAGE || usedCapacity > energyCreep) {
                    var rtv = spawns[spawn].recycleCreep(creep);
                    console.log("recylce creep rtv",rtv);
                }
            }
        } //for (var spawn in spawns )
    },

    newMove: function () {
        for (var creepNaame in Game.creeps) {
            var creep = Game.creeps[creepNaame];
            tasks.doTasks(creep);
        }
    }
}

module.exports = raceBase;





























