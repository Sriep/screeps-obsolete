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
var policySupply = require("pool.supply");
/**
 * Abstract Policy
 * @module policyMany2oneLinker
 */
var policyMany2oneLinker = {
    NUMBER_OF_LINKERS:  3,
    REPAIRER_THRESHOLD:  6,
    LINKER_AGE_THRESHOLD: 10,

    buildRequest: function (policyId, body, taskList, role, priority) {
        this.policyId = policyId;
        this.body = body;
        this.taskList = taskList;
        this.role = role;
        this.energy = raceBase.getEnergyFromBody(body);
        this.priority = priority,
        this.tick = Game.time;
    },

    initialisePolicy: function (newPolicy) {
        console.log("initialisePolicy policyMany2oneLinker");
        //var room = Game.rooms[newPolicy.room];
        this.initialiseLinks(newPolicy);
        return true;
    },

    initialiseLinks: function(policy) {
        var room = Game.rooms[policy.room];
        if (undefined === room.memory.buildQueue) {
            room.memory.buildQueue = [];
        }
        //console.log(room,"Policy for whtevr" ,JSON.stringify(policy));
        //console.log(room,"room.memory.links.info;" ,JSON.stringify(room.memory.links.info));
        policy.linksInfo = room.memory.links.info;
                        // room.memory.links.info
        room.memory.links.linkCreeps = [];
        if (undefined !== room.memory.links.info) {
            for (var j = 0; j < room.memory.links.info.length; j++) {
                var role;
                if (room.memory.links.info[j].fromId === undefined) {
                    role = gc.ROLE_LINKER_MINER_STORAGE;
                } else {
                    role = gc.ROLE_LINKER_SOURCE;
                }
                room.memory.links.linkCreeps.push({
                    creepName: undefined,
                    role: role,
                    info: room.memory.links.info[j]
                });

            } // for
        } //if
       // console.log("room.memory.links", JSON.stringify(room.memory.links));
    },

    findLinksSites: function (room) {
        var LINK_RANGE = 2;
        var linkSources  = room.find(FIND_SOURCES);
        linkSources = linkSources.concat(room.find(FIND_MINERALS));
        linkSources = linkSources.concat(room.find(FIND_MY_STRUCTURES, {
            filter: function(object) {
                return  object.structureType == STRUCTURE_LINK;
            }
        }));
        console.log("likSources",linkSources);
        var  linkSites = [];
        for ( var i = 0 ; i < linkSources.length ; i++ ) {
             var linksHere = linkSources[i].pos.findInRange(FIND_STRUCTURES, LINK_RANGE, {
                                    filter: function(object) {
                                        return object.structureType == STRUCTURE_CONTROLLER
                                            || object.structureType == STRUCTURE_LINK
                                            || object.structureType == STRUCTURE_STORAGE
                                            || object.structureType == STRUCTURE_TERMINAL
                                            || object.structureType == STRUCTURE_CONTAINER;
                                    }
            });
            for ( var j = 0 ; j < linksHere.length ; j++ ){
                if (linksHere[j].id = linkSources[i].id) {
                    linksHere.splice(j,1);
                }
                var sitesHere = this.findLinkerPosition(room, linkSources[i].pos.x, linkSources[i].pos.y,
                    linksHere[j].pos.x,linksHere[j].pos.y)
            }
            //console.log(j,"linkshere", JSON.stringify(sitesHere) );
            linkSites.push({Source :  linkSources[i], target : linksHere, positions : sitesHere } );
        }
      //  console.log(linkSources[i],"likSite",linkSites);
      //  console.log(room,"linkSites",linkSites);
    },




    findLinkerPosition: function (room, x1,y1,x2,y2) {
        var xs = [],ys = [];
        var dx = x2-x1;
        var dy = y2-y1;
        switch (dx) {
            case -2:
                xs.push(-1);
                break;
            case -1:
                xs.push(-1,0);
                break;
            case 0:
                xs.push(-1,0,1);
                break;
            case 1:
                xs.push(1,0);
                break;
            case 2:
                xs.push(1);
                break;
            default:
        }
        switch (dy) {
            case -2:
                ys.push(-1);
                break;
            case -1:
                ys.push(-1,0);
                break;
            case 0:
                ys.push(-1,0,1);
                break;
            case 1:
                ys.push(1,0);
                break;
            case 2:
                ys.push(1);
                break;
            default:
        }
        var xys;
        for (var i = 0 ; i < xs.length ; i++ ){
            for (var j = 0 ; j < ys.length ; j++) {
                var xy = { roomName: room, x: x + xs[i], y: y + ys[j] };
                var atXY = look(xy);
                if (atXY[type] == 'swamp' || atXY[type] == 'plain') {
                    xys.push(xy);
                }
            }
        }
        return xys;
    },

    draftNewPolicyId: function(oldPolicy) {
        var room = Game.rooms[oldPolicy.room];
        if (policyRescue.needsRescue(room)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
        var creeps = _.filter(Game.creeps, function (creep)
        {return creep.memory.policyId == oldPolicy.id});
        if (3 >= creeps.length) {
            console.log("CHANGE POLICY Not enough creeps to maintain all links", creeps.length)
            return  policyFrameworks.createPeacePolicy(room.name                
                , room.memory.links.fromLinks
                , room.memory.links.toLink);
        }

        var linkStructures = room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_LINK ||
                structure.structureType == STRUCTURE_STORAGE )
            }
        });
        if (4 < linkStructures.length) {
            console.log("CHANGE POLICY Less then thee links and one storage ")
            return  policyFrameworks.createPeacePolicy(room.name                
                , room.memory.links.fromLinks
                , room.memory.links.toLink);
        }
        return oldPolicy;
    },

    readyForMAny2OneLinker2: function (OldPolicy) {
        var room = Game.rooms[OldPolicy.room];
        if ( policy.creepLifeTicks(OldPolicy) > gc.MANY2ONE_REQUIRED_LIFE ) {
            return true;
        }
        return false;
    },

    readyForMAny2OneLinker: function (OldPolicy) {
        var room = Game.rooms[OldPolicy.room];
        if ( (room.memory.linkState == "linkEconomy" || room.memory.linkState == "linkForming")
            && (policy.creepLifeTicks(OldPolicy) > gc.MANY2ONE_REQUIRED_LIFE) ) {
            return true;
        }
        return false;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
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
        console.log("ENACT POLICY MANY2ONE LINKERS",room);
        poolSupply.updateSupplyLevel(room.name
            ,roomOwned.calaculateSuplly(room)
            ,room.energyCapacityAvailable);

        //this.initialiseLinks(currentPolicy);
        //if (room.memory.links !== undefined
        //    && room.memory.links.info !== undefined
       //     && room.memory.links.info.length > 0)
      //  {
         //   console.log(room,"room.memory.links.info.length",room.memory.links.info.length);
       // console.log("something not defeind properly", JSON.stringify(room.memory.links));
            this.checkLinks(room, currentPolicy);
            this.nonLinkBuilds(room, currentPolicy);/*
        } else {
            console.log("something not defeind properly", JSON.stringify(room.memory.links));
            console.log("room.memory.links",room.memory.links);
            console.log("room.memory.links.info",room.memory.links.info);
            console.log("room.memory.links.info.length",room.memory.links.info.length);
            this.checkLinks(room, currentPolicy);
            this.nonLinkBuilds(room, currentPolicy);
        }*/
        npcInvaderBattle.defendRoom(room);
    },

    checkLinks: function (room, currentPolicy) {
        //console.log(room,"In checkLinks", currentPolicy.id);
        this.findNewLinkers(currentPolicy);
        var linkToRenew = this.newLinkToBuild(currentPolicy, room.memory.links.info.length);
        console.log(room,"link",linkToRenew,"needs renewing");
        if (undefined !== linkToRenew) {
         //   console.log("replacing dead porter");
            var spawns = room.find(FIND_MY_SPAWNS);
            this.spawnLinkerCreep(spawns[0], currentPolicy);
            //this.addLinkToBuildQueue(room, linkToRenew, currentPolicy)
        }
    },


    nonLinkBuilds: function (room, currentPolicy) {
        var spawns = room.find(FIND_MY_SPAWNS);
        if (room.memory.buildQueue.length > 0) {
           // this.spawnFromBuildQueue(spawn[0], room.buildQueue[0]);
        }
        this.checkRoles(room, currentPolicy);
        console.log("extraPorters", this.extraPorters(room), "0 < porterShortfall"
            , this.porterShortfall(room,currentPolicy));
        var externalCommitments = poolSupply.getEnergyInBuildQueue(room.name);
        console.log(room,"External commitments", externalCommitments);
        //if ( this.extraPorters(room) < this.porterShortfall(room,currentPolicy)) {

        if ( 0 < this.porterShortfall(room,currentPolicy)) {
            console.log("tryingToSpawn shortfall", this.porterShortfall(room,currentPolicy) );
            var body = raceWorker.body(this.porterSize(room));
            var name = stats.createCreep(spawns[0], body, undefined, currentPolicy.id);
            if(_.isString(name)) {
                console.log("spawning porter");
                this.convertPorter(Game.creeps[name, currentPolicy]);
            }
        } else if (externalCommitments) {
            var build = poolSupply.nextRequisition(room.name);
            console.log(room,"about to build ", build.energy);
            var buildName = stats.createCreep(spawns[0], build.body, undefined, currentPolicy.id);
            if(_.isString(buildName)) {
                console.log(room,"Built contract creep energy cost", build.energy);
                policySupply.completedOrder(room.name, build, buildName);
            }
        }
    },

    spawnFromBuildQueue: function(spawn, build) {
        console.log(build.policyId,"about to build from buildQueue");
        var buildName = stats.createCreep(spawns[0], build.body, undefined, build.policyId);
        if(_.isString(buildName)) {
            console.log(build.policyId,"Built contract creep energy cost", build.energy);
            creep.memory.tasks.tasklist = build.taskList;
            creep.memory.policyId = build.requester;
            creep.memory.role = build.role;
            return true;
        }
        return false;
    },

    checkRoles: function (room, currentPolicy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id})

        for (var i = 0 ; i < creeps.length ; i++ ) {
           // console.log(room,"checkRoles",creeps[i],"has tole",creeps[i].memory.role);
            if (creeps[i].memory.role != gc.ROLE_FLEXI_STORAGE_PORTER
            && creeps[i].memory.role != gc.ROLE_LINKER_SOURCE
            && creeps[i].memory.role != gc.ROLE_LINKER_MINER_STORAGE
            && creeps[i].memory.role != gc.ROLE_STORAGE_REPAIRER)
            {
                if (raceWorker.isWorker(creeps[i].body))
                {
                    roleBase.switchRoles(creeps[i], gc.ROLE_FLEXI_STORAGE_PORTER);
                   // this.convertPorter(creep[i],currentPolicy);
                }
            }
        }
    },

    porterSize: function (room) {
      //  return Math.min(gc.LINKING_WORKER_SIZE, raceWorker.maxSizeRoom(room));
        return  raceWorker.maxSizeRoom(room);
    },

    extraPorters: function (room) {
      /*  var storage = room.find(FIND_STRUCTURES, {
            filter: { structureType : STRUCTURE_STORAGE }
        })
        if (storage[0].store[RESOURCE_ENERGY] > 10000) {
            // console.log("porter size",this.porterSize(room))
            return this.porterSize(room);
        } else {
            return 0;
        }*/
        return 0;
    },


    porterShortfall: function (room,currentPolicy) {
        var energyCost = 0;
        var porters = _.filter(Game.creeps, function (creep) {
            return (creep.memory.policyId == currentPolicy.id
            &&  creep.memory.role == gc.ROLE_FLEXI_STORAGE_PORTER );
        })
        for (var i in porters) {
            var energyI = raceBase.getEnergyFromBody(porters[i].body);
            energyCost = energyCost + energyI;
            //   console.log(porters[i],"cost", energyI,"body", porters[i]);
        }

        //var porterSize = this.porterSize(room);
        var existingPorterParts = energyCost / 200;
        var externalCommitments = poolSupply.getEnergyInBuildQueue();

        var energyInStorage
        if ( room.storage !== undefined) {
            energyInStorage = room.storage.store[RESOURCE_ENERGY];
        } else {
            energyInStorage = 0;
        }
        var portersNoCommitmentsEnergyLT = roomOwned.energyLifeTime(room, 1,  gc.ROLE_FLEXI_STORAGE_PORTER);
        var sourceEnergyLT  = roomOwned.allSourcesEnergy(room) *5;
        var energyBuildLinkersAndRepairer = 4*1000;
        var energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer - externalCommitments;
        var numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);
        var extraPartsForStorage = existingPorterParts - numPortersPartsNeeded;
       // console.log("extraPartsForStorage",extraPartsForStorage,"existingPorterParts"
      //                  ,existingPorterParts,"numPortersPartsNeeded",numPortersPartsNeeded);

        var availableInStorage = Math.max(0, energyInStorage - 40000- extraPartsForStorage * portersNoCommitmentsEnergyLT);
    //    console.log("available InStorage",availableInStorage,"energyInStorage",energyInStorage,"extraPartsForStorage",
   //                     extraPartsForStorage,"portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT);

        energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer - externalCommitments + availableInStorage;
        numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);



        var porterShortfall = numPortersPartsNeeded - existingPorterParts;//*policy.creepsAgeFactor(currentPolicy);

/*
         console.log("porterSize",porterSize,"existingPorterParts",existingPorterParts
          ,"externalCommitments",externalCommitments);
          console.log("portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT,"sourceEnergyLT",sourceEnergyLT
           ,"energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer);

        console.log("energyForUpgrading",energyForUpgrading,"sourceEnergyLT",sourceEnergyLT,
            "energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer,"externalCommitments",externalCommitments,
        "energyInStorage",energyInStorage);
        console.log("numPortersPartsNeeded",numPortersPartsNeeded,"energyForUpgrading",energyForUpgrading,
            "portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT);
          console.log(room,"porterShortfall",porterShortfall,"numPortersPartsNeeded",numPortersPartsNeeded,"existingPorterParts"
                    ,existingPorterParts,"age factor",policy.creepsAgeFactor(currentPolicy));*/
        return porterShortfall;
    },

    convertPorter: function(creep,currentPolicy ) {
        // console.log("in convertPorter",creep);
        if (undefined !== creep) {
            var creeps = _.filter(Game.creeps, function (creep) {
                return creep.memory.policyId == currentPolicy.id
            });
            var foundRepaier = false;
            if ( creeps.length > this.REPAIRER_THRESHOLD ) {
                foundRepaier = false;
                var i = 0;
                while (i < creeps.length && !foundRepaier) {
                    //    console.log("convertPorter while loop i",i,"lenght",creeps.length);
                    if ( creeps[i].memory.role == gc.ROLE_STORAGE_REPAIRER ) {
                        foundRepaier = true;
                    }
                    i++;
                }
            }
            if (foundRepaier || creeps.length <= this.REPAIRER_THRESHOLD ) {
                roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
               // roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
                // creep.memory.role = gc.ROLE_ENERGY_PORTER;
                // if (undefined === creep.memory.tasks)
                //     creep.memory.tasks = {};
                //// creep.memory.tasks.tasklist = roleEnergyPorter.moveTaskList(creep);
                //   console.log("New Energy Porter tsetlisg", JSON.stringify(creep.memory.tasks.tasklist) );
                //tasks.setTargetId(creep,undefined);
            } else {
              //  roleBase.switchRoles(creep, gc.ROLE_FLEXI_STORAGE_PORTER);
               roleBase.switchRoles(creep, gc.ROLE_STORAGE_REPAIRER);
                //this.convertStorageRepairer(creep);
            }
        }
    },



    findNewLinkers: function (currentPolicy) {
      //     console.log("In findNewLiners");
        var room = Game.rooms[currentPolicy.room];
        var linkCreeps = room.memory.links.linkCreeps;
        if (undefined === linkCreeps) {
        //    console.log(room,"something wrong");
        //   // console.log(room, "link data", JSON.stringify(room.memory.links));
            this.initialisePolicy(currentPolicy);
            return;
        }
        var info = room.memory.links.info;
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        for (var i = creeps.length-1 ; i >=0 ; i-- ) {
            if ( ( gc.ROLE_LINKER_SOURCE != creeps[i].memory.role
                && gc.ROLE_LINKER_MINER_STORAGE != creeps[i].memory.role)
                && this.bodySuitableForLinker(creeps[i])
            ) {
                for ( var j = 0 ; j < linkCreeps.length ; j++ ) {
                    if (!this.linkOk(room,j)) {
                        linkCreeps[j].creepName = creeps[i].name;
                      //  console.log(room,"findNewLinkers found new link", JSON.stringify(info[j]));
                        this.makeLinker(creeps[i] ,info[j]);
                    }
                }
            }  // harvester
        }//for

    },

    bodySuitableForLinker: function (creep) {
        var size = Math.min(gc.LINKING_WORKER_SIZE, raceWorker.maxSizeRoom(creep.room));
        return raceBase.isCreep(creep, "worker", size);
    },

 //   creep.memory.tasks.tasklist = roleLinkerSource.getTaskList(fromLink.x, fromLink.y
 //   , fromLink.fromId, fromLink.fromLinkId, toLink.toLinkId );

//   creep.memory.tasks.tasklist = roleLinkerMinerStorage.getTaskList(toLink.x, toLink.y
//    , toLink.storageId, toLink.toLinkId , toLink.mineId, toLink.mineResource );

    addLinkToBuildQueue: function (room, link, policyId) {
        var body = raceWorker.body(gc.LINKING_WORKER_SIZE);
        //var linkCreeps = room.memory.links.linkCreeps;
        var fromLink = room.memory.links.linkCreeps[link].linkInfo;
        var toLink = room.memory.links.linkCreeps[link].linkInfo;
        var taskList;
        var role;
        if (0 == link || 1 == link) {
            taskList = roleLinkerSource.getTaskList(fromLink.x, fromLink.y
                        , fromLink.fromId, fromLink.fromLinkId, toLink.toLinkId );
            role = gc.ROLE_LINKER_SOURCE;
        } else {
            taskList = roleLinkerMinerStorage.getTaskList(toLink.x, toLink.y
                        , toLink.storageId, toLink.toLinkId , toLink.mineId, toLink.mineResource );
            role = gc.ROLE_LINKER_MINER_STORAGE;
        }
        var build = new this.buildRequest(policyId,body,taskList,role,0);
        room.memory.buildQueue.unshift(build);
   //     console.log("Added new linker to build queue.");
    },
    spawnLinkerCreep: function (spawn, currentPolicy) {
       // var spawns = room.find(FIND_MY_SPAWNS);
        var size = Math.min(gc.LINKING_WORKER_SIZE, raceWorker.maxSizeRoom(spawn.room));
     //   console.log(spawn,"spawnLinkerCreep raceWorker.maxSizeRoom(spawn.room)" ,raceWorker.maxSizeRoom(spawn.room));
        var body = raceWorker.body(size);
   //     console.log(spawn.room,"spawn link size ",size );

        var room = Game.rooms[currentPolicy.room];
        var name = spawn.createCreep(body, name, {policyId: currentPolicy.id});
        if (_.isString(name)) {
            var linkCreeps = room.memory.links.linkCreeps;
            for ( var i = 0 ; i < linkCreeps.length ; i++ )
            {
                if (undefined === linkCreeps[i]) {
                    linkCreeps[i].creepName = name;
                    this.makeLinker(Game.creeps[name], linkCreep[i].linkInfo);
                    console.log(name,"New linker spawned link info", linkCreep[i].linkInfo);
                }
            }
        }
        return name;
    },

    newLinkToBuild: function (currentPolicy) {
       // console.log("In  newLinkToBuild")
        var room = Game.rooms[currentPolicy.room];
        var linkCreeps = room.memory.links.linkCreeps;
        if (undefined === linkCreeps) {
            console.log(currentPolicy,"newLinkToBuild undefined === linkCreeps");
            return false;
        }
      //  console.log("in newLinkToBuild linkCreeps.length",linkCreeps.length)
        for ( var link = 0 ; link < linkCreeps.length ; link++ )
        {
           // console.log("newLinkToBuild link",link)
            if (!this.linkOk(room,link)) {
             //   console.log("newLinkToBuild Return link to build",link);
                return link;
                //return linkCreeps[link].role;
            }
        }
        //console.log("no new links to build");
        return undefined;
    },

    linkOk: function(room, index) {
       // console.log(room,"linkeOk",index);
        var linkCreeps = room.memory.links.linkCreeps;
        if (undefined === linkCreeps)
            return false;
        if (undefined === linkCreeps[index]) {
       //        console.log(index,"linkOk no link ");
            return false;
        }
        if (undefined == linkCreeps[index].creepName){
     //          console.log(index,"linkOk no creep name in link data ");
            return false;
        }
        var creep = Game.creeps[linkCreeps[index].creepName];
        if (undefined === Game.creeps[linkCreeps[index].creepName]) {
        //     console.log(index,"linkOk no creep in game ");
            return false;
        }
        if (Game.creeps[linkCreeps[index].creepName].memory.role != linkCreeps[index].role){
         //    console.log(index,"linkOk creep has wrong role");
            return false;
        } // near retirement
        if (Game.creeps[linkCreeps[index].creepName].ticksToLive < this.LINKER_AGE_THRESHOLD) {
           // console.log(index,"linkOk creep about to retire life",Game.creeps[linkCreeps[index].creepName].ticksToLive);
            return false;
        }
        if (creep.pos.x != linkCreeps[index].info.x || creep.pos.y != linkCreeps[index].info.y)
        {
            for ( var i = 0 ; i <  linkCreeps.length ; i++ ){
                if (i != index && linkCreeps[index].creepName == linkCreeps[i].creepName) {
                    //Creep double booked
                    linkCreeps[index].creepName = undefined;
                    return false;
                }

            }
        }


        // console.log("linkOk return ture index",index,Game.creeps[linkCreeps[index].creepName]);
        return true;
    },

    makeFromLinker: function (creep, fromLink, toLink) {
        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        // moveTaskList: function(creep, x,y,sourceId, homeLinkId, targetLinkId)
        if (undefined === toLink) {
            creep.memory.tasks.tasklist = roleLinkerSource.getTaskList(fromLink.x, fromLink.y
                , fromLink.fromId, fromLink.fromLinkId, undefined );
        } else {
            creep.memory.tasks.tasklist = roleLinkerSource.getTaskList(fromLink.x, fromLink.y
                , fromLink.fromId, fromLink.fromLinkId, toLink.toLinkId );
        }
        creep.memory.role = gc.ROLE_LINKER_SOURCE;
        tasks.setTargetId(creep,undefined);
    },

    makeToLinker: function (creep, toLink) {
        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        creep.memory.tasks.tasklist = roleLinkerMinerStorage.getTaskList(toLink.x, toLink.y
            , toLink.storageId, toLink.toLinkId , toLink.mineId, toLink.mineResource );
        creep.memory.role = gc.ROLE_LINKER_MINER_STORAGE;
        tasks.setTargetId(creep,undefined);
    },

    makeLinker: function (creep, linkInfo) {
        //console.log(creep,"makeLinker linkIfo", JSON.stringify(linkInfo));
        if (undefined === creep.memory.tasks)
            creep.memory.tasks = {};
        var link = linkInfo;

        if (linkInfo.fromId !== undefined) {
            if (undefined === linkInfo.toLinkId) {
                creep.memory.tasks.tasklist = roleLinkerSource.getTaskList(
                    linkInfo.x,
                    linkInfo.y,
                    linkInfo.fromId,
                    linkInfo.fromLinkId,
                    undefined );
            } else {
                creep.memory.tasks.tasklist = roleLinkerSource.getTaskList(
                    linkInfo.x,
                    linkInfo.y,
                    linkInfo.fromId,
                    linkInfo.fromLinkId,
                    linkInfo.toLinkId );
            }
            creep.memory.role = gc.ROLE_LINKER_SOURCE;
        } else {
            creep.memory.tasks.tasklist = roleLinkerMinerStorage.getTaskList(
                linkInfo.x,
                linkInfo.y,
                linkInfo.storageId,
                linkInfo.toLinkId ,
                linkInfo.mineId,
                linkInfo.mineResource );
            creep.memory.role = gc.ROLE_LINKER_MINER_STORAGE;
        }
        //creep.memory.role =
        tasks.setTargetId(creep,undefined);
    }

};



module.exports = policyMany2oneLinker;






































