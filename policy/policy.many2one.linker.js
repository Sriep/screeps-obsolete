/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Set up linkers.
 * @author Piers Shepperson
 */
"use strict";
var policyFrameworks = require("policy.frameworks");
var policyRescue = require("policy.rescue");
var policy = require("policy");
var stats = require("stats");
var policyConstruction = require("policy.construction");
var policyDefence = require("policy.defence");
var policyFrameworks = require("policy.frameworks");
var raceBase = require("race.base");
var raceWorker = require("race.worker");
var roomOwned = require("room.owned");
var _ = require('lodash');
var policyBuildspawn = require("policy.buildspawn");
var roleBase = require("role.base");
var poolSupply = require("pool.supply");
var gc = require("gc");
var roleLinkerSource = require("role.linker.source");
var roleLinkerMinerStorage = require("role.linker.miner.storage");
var tasks = require("tasks");
var roleEnergyPorter = require("role.energy.porter");
var npcInvaderBattle = require("npc.invader.battle");
var roleStorageRepairer = require("role.storage.repairer");
/**
 * Abstract Policy
 * @module policyRescue
 */
var policyGiftWorkers = {

    initilisePolicy: function (newPolicy) {
        var room = Game.rooms[currentPolicy.room];
        room.memory.links.linkCreeps = undefined;
        return true;
    },

    draftNewPolicyId: function(oldPolicy) {
        var room = Game.rooms[currentPolicy.room];
        if (policyRescue.needsRescue(room)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
        var creeps = _.filter(Game.creeps, function (creep)
            {return creep.memory.policyId == currentPolicy.id});
        if (2 <= creeps.length) {
            return  policyFrameworks.createPeacePolicy(room.name);
        }

        var linkStructures = room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_LINK ||
                structure.structureType == STRUCTURE_STORAGE )
            }
        });
        if (4 < linkStructures.length) {
            return  policyFrameworks.createPeacePolicy(room.name);
        }

        return oldPolicy;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
        "use strict";
        switch(oldPolicy.type) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.PEACE:
            default:
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
    },

    enactPolicy: function(currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        poolSupply.updateSupplyLevel(room.name,roomOwned.calaculateSuplly(room)
            ,room.energyCapacityAvailable);
        if ("linkEconomy" == room.memory.linkState ) {
            this.linkActive(currentPolicy);
        } else {
            this.linkForming(currentPolicy);
            this.linkActive(currentPolicy);
        }
    },

    linkForming: function (currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        if (room.name == "W27S21"){
            console.log(room,"Game.rooms[currentPolicy.room].memory.linkState"
                ,room.memory.linkState);
            room.memory.linkState = undefined;
            return;
        }
        var numberOfLinkers = 3;
        var fromLinks = room.memory.links.fromLinks;
        var toLink = room.memory.links.toLink;


        if (undefined === room.memory.links.linkCreeps) {
            room.memory.links.linkCreeps = [];
            room.memory.links.linkCreeps.push({creepName: undefined, linkInfo : fromLinks[0], toInfo : toLink});
            room.memory.links.linkCreeps.push({creepName: undefined, linkInfo : fromLinks[1], toInfo : toLink});
            room.memory.links.linkCreeps.push({creepName: undefined, linkInfo : toLink});
        }
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        var linkCreeps = room.memory.links.linkCreeps;
        this.checkCreepsStillAlive(currentPolicy, numberOfLinkers);
        this.findNewLinkers(currentPolicy);

        if (this.linkersInPosition(currentPolicy)) {
            room.memory.linkState = "linkEconomy";
        }
    },

     linkActive: function (currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        if (!this.checkCreepsStillAlive(currentPolicy, 3)) {
            this.findNewLinkers(currentPolicy);
        }
        
        var numberOfLinkers =3;
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
                && ( creep.memory.role == gc.ROLE_HARVESTER
                || creep.memory.role == gc.ROLE_BUILDER
                || creep.memory.role == gc.ROLE_UPGRADER
                || creep.memory.role == gc.ROLE_ENERGY_PORTER );
        });
        var  madeRepaier = false;
        var  madePorter = false;
        for (var i in creeps) {
            if (creeps[i].memory.role != gc.ROLE_ENERGY_PORTER) {
                if (madePorter && !madeRepaier) {
                    this.convertStorageRepairer(creeps[i]);
                    madeRepaier = true;
                } else {
                    this.convertPorter(creeps[i]);
                    madePorter = true;
                    console.log(creeps[i], "converted to porter");
                }
            }
        }
        var externalCommitments = 0//poolSupply.getEnergyInBuildQueue();
        var porterSize = Math.min(5, raceWorker.maxSizeRoom(room));
        
        var spawns = room.find(FIND_MY_SPAWNS);
        if (!this.checkCreepsStillAlive(currentPolicy, numberOfLinkers)) {
            console.log("replacing dead porter");
            this.spawnLinkerCreep(spawns, currentPolicy);
            this.findNewLinkers(currentPolicy);
            //} else  if(  porterSize <= this.porterShortfall(room,currentPolicy)) {
        } else  if(  0 < this.porterShortfall(room,currentPolicy)) {
            console.log("tryingToSpawn");
            var body = raceWorker.body(porterSize * 200);
            var name = stats.createCreep(spawns[0], body, undefined, currentPolicy.id);
            if(_.isString(name)) {
                console.log("spawning porter");
                this.convertPorter(Game.creeps[name]);
            }
        } else if (externalCommitments) {
            // var nextBuildItem  = room.memory.nextRequisition(room);
            //   console.log(room,"about to build contract creep", JSON.stringify(nextBuildItem));
            //   name = stats.createCreep(spawns[0], nextBuildItem.body, undefined, currentPolicy.id);
        }

        npcInvaderBattle.defendRoom(room);
        console.log("LEAVING LINKS ACTIVE LEAVING LINKS ACTIVE");
    },


    porterShortfall: function (room,currentPolicy) {
        var energyCost = 0;
        var porters = _.filter(Game.creeps, function (creep) {
            return (creep.memory.policyId == currentPolicy.id
            &&  creep.memory.role == gc.ROLE_ENERGY_PORTER );
        });
        for (var i in porters) {
            var energyI = raceBase.getEnergyFromBody(porters[i].body);
            energyCost = energyCost + energyI;
            //     console.log(porters[i],"cost", energyI);
        }

        var porterSize = Math.min(5, raceWorker.maxSizeRoom(room));
        var existingPorterParts = energyCost / 200;
        var externalCommitments = 0//poolSupply.getEnergyInBuildQueue();

        var portersNoCommitmentsEnergyLT = roomOwned.energyLifeTime(room, 1,  gc.ROLE_ENERGY_PORTER);

        var sourceEnergyLT  = roomOwned.allSourcesEnergy(room) *5;
        var energyBuildLinkersAndRepairer = 4*1000;

        var energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer - externalCommitments;
        var numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);
        var porterShortfall = numPortersPartsNeeded - existingPorterParts;
        /*
         console.log("porterSize",porterSize,"existingPorterParts",existingPorterParts
         ,"externalCommitments",externalCommitments);
         console.log("portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT,"sourceEnergyLT",sourceEnergyLT
         ,"energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer);
         console.log("energyForUpgrading",energyForUpgrading,"numPortersPartsNeeded",numPortersPartsNeeded,
         "porterShortfall",porterShortfall);*/
        console.log(room,"porterShortfall",porterShortfall);
        return porterShortfall;
    },

    convertPorter: function(creep) {
        if (undefined !== creep) {
            creep.memory.role = gc.ROLE_ENERGY_PORTER;
            creep.memory.tasks.tasklist = roleEnergyPorter.moveTaskList(creep);
            //   console.log("New Energy Porter tsetlisg", JSON.stringify(creep.memory.tasks.tasklist) );
            tasks.setTargetId(creep,undefined);
        }
    },

    convertStorageRepairer: function(creep) {
        if (undefined !== creep) {
            creep.memory.role = gc.ROLE_STORAGE_REPAIRER;
            creep.memory.tasks.tasklist = roleStorageRepairer.moveTaskList(creep);
            //   console.log("New Energy Porter tsetlisg", JSON.stringify(creep.memory.tasks.tasklist) );
            tasks.setTargetId(creep,undefined);
        }
    },

    spawnLinkerCreep: function (spawn, currectPolicy) {
        var body = raceWorker.body(gc.LINKING_WORKER_SIZE*gc.BLOCKSIZE_COST_WORKER);
        var name = stats.createCreep(spawn, body, undefined, currectPolicy.id);
        if (_.isString(result)) {
            var linkCreeps = room.memory.links.linkCreeps;
            for ( var i = 0 ; i < linkCreeps.length ; i++ )
            {
                if (undefined === linkCreeps[i]) {
                    linkCreeps[i].creepName = name;
                    if (linkCreeps[i].linkInfo.fromId !== undefined) {
                        this.makeFromLinker(Game.creeps[name]
                            ,linkCreep[i].linkInfo
                            , linkCreep[i].toLink);
                    } else {
                        this.makeToLinker(Game.creeps[name], linkCreep[i].linkInfo);
                    }
                    console.log(name,"New linker spawned");
                }
            }
        }
        return name;
    },

    findNewLinkers: function (currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        var linkCreeps = room.memory.links.linkCreeps;
        var fromLinks = room.memory.links.fromLinks;
        var toLink = room.memory.links.toLink;
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        for (var i = creeps.length-1 ; i >=0 ; i-- ) {
            //   console.log(creeps[i].creepName,"In findNewLiners loop counter",i)
            if ( (gc.ROLE_HARVESTER != creeps[i].memory.role
                && gc.ROLE_LINKER_SOURCE != creeps[i].memory.role
                && gc.ROLE_LINKER_MINER_STORAGE != creeps[i].memory.role)
            // && gc.LINKING_WORKER_SIZE * gc.BLOCKSIZE_COST_WORKER
            //        == raceBase.getEnergyFromBody(creeps[i].body())
            )
            {
                if (undefined === linkCreeps[0].creepName){
                    linkCreeps[0].creepName = creeps[i].name;
                    this.makeFromLinker(creeps[i] ,fromLinks[0], toLink);

                } else  if (undefined === linkCreeps[1].creepName) {
                    linkCreeps[1].creepName = creeps[i].name;
                    this.makeFromLinker(creeps[i] ,fromLinks[1], toLink);

                } else {
                    if (undefined === linkCreeps[2].creepName) {
                        linkCreeps[2].creepName = creeps[i].name;
                        this.makeToLinker(creeps[i], toLink);
                    }
                }

            }  // harvester
        }//for
    },

    checkCreepsStillAlive: function (currentPolicy, numberOfLinkers) {
        var room = Game.rooms[currentPolicy.room];
        if (undefined === room.memory.links.linkCreeps) {
            return false;
        }
        var numLinkersFound = 0;
        var linkCreeps = room.memory.links.linkCreeps;
        if (numberOfLinkers != linkCreeps.length){
            return false;
        }
        for ( var i = 0 ; i < linkCreeps.length ; i++ )
        {
            if (undefined !== linkCreeps[i].creepName) {
                var creepName = linkCreeps[i].creepName;
                if (undefined === Game.creeps[creepName]) {
                    //   console.log("checkCreepsStillAlive", linkCreeps[i].creepName ,"just died" );
                    linkCreeps[i].creepName = undefined;
                    return false;
                } else  {
                    //    console.log("in checkCreepsStillAlive foud liveone ", creepName);
                    numLinkersFound++
                }
            } else {
                //    console.log("link", i,"creep procbably died");
                return false;
            }
        }
        return true;
    },

    linkersInPosition: function (currentPolicy) {
        console.log("In linkersInPosition");
        var room = Game.rooms[currentPolicy.room];
        if (undefined === room.memory.links.linkCreeps) {
            return false;
        }
        var linkCreeps = room.memory.links.linkCreeps;
        for ( var i = 0 ; i < linkCreeps.length ; i++ )
        {
            if (undefined === linkCreeps[i] || undefined === linkCreeps[i].creepName) {
                console.log(false, "undefined === linkCreeps[i].creepName) i",i);
                return false;
            } else {

                var creep = Game.creeps[linkCreeps[i].creepName];
                if  (creep === undefined) {
                    console.log(false, "probably dead", creep);
                    return false;
                }
                if (!(creep.pos.x == linkCreeps[i].linkInfo.x)
                    || !(creep.pos.y == linkCreeps[i].linkInfo.y)) {
                    console.log(false, creep, "not in postion x", creep.pos.x,linkCreeps[i].linkInfo.x
                        ,"y",creep.pos.y , linkCreeps[i].linkInfo.y);
                    return false;
                }
            }
        }
        console.log(true,"linkersInPosition");
        return true;
    },

    makeFromLinker: function (creep, fromLink, toLink) {

        // moveTaskList: function(creep, x,y,sourceId, homeLinkId, targetLinkId)
        creep.memory.tasks.tasklist = roleLinkerSource.moveTaskList(creep,fromLink.x, fromLink.y
            , fromLink.fromId, fromLink.fromLinkId, toLink.toLinkId );
        creep.memory.role = gc.ROLE_LINKER_SOURCE;
        tasks.setTargetId(creep,undefined);
    },

    makeToLinker: function (creep, toLink) {

        creep.memory.tasks.tasklist = roleLinkerMinerStorage.moveTaskList(creep, toLink.x, toLink.y
            , toLink.storageId, toLink.toLinkId , toLink.mineId, toLink.mineResource );
        creep.memory.role = gc.ROLE_LINKER_MINER_STORAGE;
        tasks.setTargetId(creep,undefined);
    },

};

module.exports = policyGiftWorkers;







































