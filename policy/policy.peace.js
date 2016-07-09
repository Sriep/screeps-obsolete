/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
"use strict";
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
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module policyPeace
 */
var policyPeace = {
    REPAIR_THRESHOLD: 3,
    REPAIR_RATIO: 0.1,
   
    /**
     * Called when at peace. Determins what the new polciy for the comming 
     * tick should be.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(oldPolicy) {
        var room =  Game.rooms[oldPolicy.room];
        if (!policyBuildspawn.spawnFound(oldPolicy))      {
            return policyFrameworks.createBuildspawn(room.name);
        }
        //if (room.memory.linkState = "linkEconomy"
        // || room.memory.linkState = "linkForming") {
       //     return policyFrameworks.createMany2OneLinkersPolicy(room.name);
       // }

     //   if (policyDefence.beingAttaced(room)) {
 //           return policyFrameworks.createDefendPolicy(room.name);
   //     }
        var policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policyFrameworks.createRescuePolicy(room.name);
        }
  //      if (policyConstruction.startConstruction(room)) {
  //          return policyFrameworks.createConstructionPolicy(room.name);
   //     }
        return oldPolicy;
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

    initilisePolicy: function (newPolicy) {
        return true;
    },

    /**
    * Enact peace time policy. The main objective in peace time is to 
    * transger as much source energy to the rooms controller as possible.
    * <ul>
    * <li> Spawn a worker if enought energy avaliable.
    * <li> Determine the ratio of havesters, upgraders, builders and repaiers. 
    * <li> Move all the workers in the room.
    * </ul>
    * @function enactPolicy
    * @param   {Object} policy  The room that might need rescuing.
    * @returns {none} 
    */
    enactPolicy: function(currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        poolSupply.updateSupplyLevel(room.name,roomOwned.calaculateSuplly(room)
            ,room.energyCapacityAvailable);
        console.log(room, "Start enact policy ");
        //room.memory.links.linkCreeps = undefined;
        if (room.name == "W27S21"){
            room.memory.linkState = undefined;
        }  
        
        if ( "linkForming" == room.memory.linkState ) {
              this.linkForming(currentPolicy);
              this.linkActive(currentPolicy)
        } else if ("linkEconomy" == room.memory.linkState ) {
              this.linkActive(currentPolicy);
        } else {
            console.log("noLinksEconomy");
            this.noLinksEconomy(currentPolicy,0 )
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

    findNewLinkers: function (currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        var linkCreeps = room.memory.links.linkCreeps;
        var fromLinks = room.memory.links.fromLinks;
        var toLink = room.memory.links.toLink;
       // console.log(room,"IIIIIIN findNewLinersfindNewLinersfindNewLinersfindNewLinersfindNewLiners");
        var creeps = _.filter(Game.creeps, function (creep)
                                {return creep.memory.policyId == currentPolicy.id});
        for (var i = creeps.length-1 ; i >=0 ; i-- ) {
         //   console.log(creeps[i].creepName,"In findNewLiners loop counter",i)
            if ( (gc.ROLE_HARVESTER != creeps[i].memory.role
                && gc.ROLE_LINKER_SOURCE != creeps[i].memory.role
                && gc.ROLE_LINKER_MINER_STORAGE != creeps[i].memory.role)
            // && gc.LINKING_WORKER_SIZE * gc.BLOCKSIZE_COST_WORKER
            //        == raceBase.getEnergyFromBody(creeps[i].body())
            )
            {
             //   console.log(creeps[i].creepName,"In findNewLiners loop counter",i)
                if (undefined === linkCreeps[0].creepName){
                  //  console.log(creeps[i].name, "in linik0");
                    linkCreeps[0].creepName = creeps[i].name;
                    this.makeFromLinker(creeps[i] ,fromLinks[0], toLink);

                } else  if (undefined === linkCreeps[1].creepName) {
                 //    console.log(creeps[i].name, "in linik1");
                    linkCreeps[1].creepName = creeps[i].name;
                    this.makeFromLinker(creeps[i] ,fromLinks[1], toLink);

                } else {
                   //  console.log("abut to check storagelink", linkCreeps[2].creepName)
                    if (undefined === linkCreeps[2].creepName) {
                        console.log(creeps[i].name, "in linik2");
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

    linkActive: function (currentPolicy) {
        console.log("In link active");

        var room = Game.rooms[currentPolicy.room];
        if (!this.checkCreepsStillAlive(currentPolicy, 3)) {
            this.findNewLinkers(currentPolicy);
           // console.log("checkCreepsStillAlive returned fasle");
           // room.memory.linkState = "linkForming";
           // this.linkForming(currentPolicy);
        }


        var numberOfLinkers =3;
        //Turn everyone into energy porters
        //Calculate current workers vrs needed workers.
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
              //  if (this.doWeNeedRepairer(currentPolicy)) {
               //     console.log("spawning repairer");
               //     this.convertStorageRepairer(Game.creeps[name]);
             //   } else {
                    console.log("spawning porter");
                    this.convertPorter(Game.creeps[name]);
              //  }
            }
        } else if (externalCommitments) {
           // var nextBuildItem  = room.memory.nextRequisition(room);
         //   console.log(room,"about to build contract creep", JSON.stringify(nextBuildItem));
         //   name = stats.createCreep(spawns[0], nextBuildItem.body, undefined, currentPolicy.id);
        }

        npcInvaderBattle.defendRoom(room);
        console.log("LEAVING LINKS ACTIVE LEAVING LINKS ACTIVE");
    },

    doWeNeedRepairer: function (currentPolicy) {

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == currentPolicy.id
                && ( creep.memory.role == gc.ROLE_STORAGE_REPAIRER
                || creep.memory.role == gc.ROLE_ENERGY_PORTER );
        });
        console.log(room,"doWeNeedRepairer", creeps.length);
        if (creeps.length <2) return false;
        for (var i = 0 ; i < creeps.length ; i++ ) {
            if (creeps[i].memory.role != gc.ROLE_STORAGE_REPAIRER) {
                return false;
            }
        }
        return true;
    },

    porterShortfall: function (room,currentPolicy) {
        var energyCost = 0;
        var porters = _.filter(Game.creeps, function (creep) {
            return (creep.memory.policyId == currentPolicy.id
            &&  (creep.memory.role == gc.ROLE_ENERGY_PORTER
                ||creep.memory.role == gc.ROLE_HARVESTER
            || creep.memory.role == gc.ROLE_BUILDER
            || creep.memory.role == gc.ROLE_UPGRADER
            || creep.memory.role == gc.ROLE_ENERGY_PORTER ));
        });
        for (var i in porters) {
            var energyI = raceBase.getEnergyFromBody(porters[i].body);
            energyCost = energyCost + energyI;
            //     console.log(porters[i],"cost", energyI);
        }

        var porterSize = Math.min(5, raceWorker.maxSizeRoom(room));
        var existingPorterParts = energyCost / 200;
        var externalCommitments = poolSupply.getEnergyInBuildQueue(room.name);
        console.log(room, "Energy in build queue", externalCommitments);

        var portersNoCommitmentsEnergyLT = roomOwned.energyLifeTime(room, 1,  gc.ROLE_ENERGY_PORTER);

        var sourceEnergyLT  = roomOwned.allSourcesEnergy(room) *5;
        var energyBuildLinkersAndRepairer = 4*1000;

        var energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer - externalCommitments;
        var numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);
        var porterShortfall = numPortersPartsNeeded - existingPorterParts;

        console.log("porterSize",porterSize,"existingPorterParts",existingPorterParts
            ,"externalCommitments",externalCommitments);
        console.log("portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT,"sourceEnergyLT",sourceEnergyLT
            ,"energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer);
        console.log("energyForUpgrading",energyForUpgrading,"numPortersPartsNeeded",numPortersPartsNeeded,
            "porterShortfall",porterShortfall);
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

    

    //this.makeFromLinker(creeps[i] ,fromLinks[1], toLink);
  //  this.makeToLinker(creeps[i], toLink);
    
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


    noLinksEconomy: function (currentPolicy, numlinkers) {
        var room = Game.rooms[currentPolicy.room];
        console.log(room,"In noLinksEconomy");
        room.memory.policyId = currentPolicy.id;
        var energy  = roomOwned.allSourcesEnergy(room) *5;
       // energy -= 15000*linksEnabled;
        var toSupply = policy.supportBurden(room) + numlinkers;
        //if (toSupply > 0) {
            var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
            toSupply = Math.floor(Math.min(toSupply, supportable));
        //}
        console.log("Room can support", supportable,"workers for ",supportable*1000
            ,"energy and",supportable*5,"parts. Support burder is",toSupply,"workers.");
        if (toSupply > 0)
        {
            var nLinkers = 2;
            var nHavesters = roomOwned.supportHavesters(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.supportUpgraders(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy,  (nHavesters + nUpgraders + toSupply) , nHavesters, numlinkers);
        }  else {
            var nHavesters = roomOwned.peaceHavesters(room,  policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.peaceUpgraders(room,  policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy, (nHavesters + nUpgraders), nHavesters,numlinkers);;
        }
    },



    spawnWorkerCreep: function(room, currentPolicy, equilbriumCreeps, nEqHavesters,numlinkers) {
        console.log("Support Harvesters",nEqHavesters,"Support from stats",roomOwned.calaculateSuplly(room)
            ,"Equilibrium creeps",equilbriumCreeps);
        console.log(room,"Supply level",roomOwned.calaculateSuplly(room),"yard capacity",room.energyCapacityAvailable);
        poolSupply.updateSupplyLevel(room.name,roomOwned.calaculateSuplly(room),room.energyCapacityAvailable);
        
        //var creeps = room.find(FIND_MY_CREEPS, { filter: { policyId: currentPolicy.id }});
        //var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        var nCreeps = creeps.length;
        console.log("creeps assigned to peace", creeps.length)
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        console.log("Number of creeps",nCreeps,"with a total of ",nWorkParts,"parts looking for ",
                     equilbriumCreeps * policy.LINKING_WORKER_SIZE ,"parts" );
        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE < nWorkParts )
        {
            if (policy.energyStorageAtCapacity(room))
            {
                //nHavesters = Math.floor(nEqHavesters);
                var nHavesters = 0;
            } else {
                var nHavesters = Math.ceil(nEqHavesters);
            }
        } else {/*
           // console.log("Count source acces ponts", roomOwned.countSiteAccess(room, FIND_SOURCES),
            //"spawnWorkerSize",raceWorker.spawnWorkerSize(room,(equilbriumCreeps)*1000) ,"equilibium energy",
              //  equilbriumCreeps*1000);
            if (nCreeps <= 3 * roomOwned.countSiteAccess(room, FIND_SOURCES)) {
                var spawns = room.find(FIND_MY_SPAWNS);
                raceBase.spawn(raceWorker
                    , currentPolicy
                    , spawns[0]
                    , raceWorker.spawnWorkerSize(room, (equilbriumCreeps) * 1000));
            }*/
            nHavesters = Math.max(Math.ceil(nEqHavesters), 2);
        }
        this.spawnCreep(room,currentPolicy, equilbriumCreeps);

        //Has not spawned but energy at capacty no need for havesters
        if (policy.energyStorageAtCapacity(room)){
            nHavesters = 0;
        }
        //console.log("workers size to spawn", raceWorker.spawnWorkerSize(room,(equilbriumCreeps)*1000));
        var nBuilders = 0;
        var nRepairers = 0;     
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        } 
        var nUpgraders = nCreeps - nHavesters - nRepairers - nBuilders;  
               
        console.log("Enact Peace with links roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers
                , "total creeps", nCreeps);

        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);

        var freeForContractWork = Math.max(0, nCreeps - Math.ceil(nEqHavesters) - numlinkers);
        policy.convertContractWorkers(room, currentPolicy, roleBase.Type.UPGRADER);
    },

    spawnCreep: function (room, currentPolicy, equilbriumCreeps){
        var creeps = _.filter(Game.creeps, function (creep) {return creep.memory.policyId == currentPolicy.id});
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE >= nWorkParts )
        {
            if (nCreeps <= 3 * roomOwned.countSiteAccess(room, FIND_SOURCES)) {
                var spawns = room.find(FIND_MY_SPAWNS);
                raceBase.spawn(raceWorker
                    , currentPolicy
                    , spawns[0]
                    , raceWorker.spawnWorkerSize(room, (equilbriumCreeps) * 1000));
            }
        }   
       // var energyInBuildQueue = poolSupply.getEnergyInBuildQueue();
      //  console.log(room,"Energy in build queue",energyInBuildQueue );
    },

    attachCreep: function (creep, policyId, role)
    {
        Game.creeps[creep].memory.role = role;
        Game.creeps[creep].memory.employerId = policyId;
    }
}


module.exports = policyPeace;




































