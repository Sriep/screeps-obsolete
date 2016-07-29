/**
 * Created by Piers on 19/07/2016.
 */
/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
var policyThePool = require("policy.the.pool");
var raceBase = require("race.base");
var roomOwned = require("room.owned");
var routeBase = require("route.base");
var RouteLinker = require("route.linker");
var RouteNeutralPorter = require("route.neutral.porter");
var RouteRemoteActions = require("route.remote.actions");
var RouteRepairer = require("route.repairer");
var RouteFlexiStoragePorter = require("route.flexi.storage.porter");
var gc = require("gc");
var policyMany2oneLinker = require("policy.many2one.linker");
var policy = require("policy");
var raceClaimer = require("race.claimer");
var RoutePatrolRoom = require("route.patrol.room");
var raceSwordsman = require("race.swordsman");
/**
 * Requisition object for using the pool
 * @module policy
 */

var linkers = {
    LINK_TO_SOURCE_RANGE: 2,

    attachFlaggedRoutes: function (room, policy) {
      //  console.log(room,"attachFlaggedRoutes check notReadyForLinkers");
        if (!this.notReadyForLinkers(room))
            return;

        var flags = _.filter(Game.flags, function (flag) {
            return ( flag.memory.linkerFrom
                    && (flag.memory.linkerFrom.room == room.name
                    || flag.memory.porterFrom.room == room.name) );
        });
        for ( var i = 0 ; i < flags.length ; i++ ) {
            var order;
            //console.log("attachFlaggedRoutes");

            if ( gc.FLAG_MINERAL == flags[i].memory.type
                    && !flags[i].memory.extractor) {

            } else {
                order = new RouteLinker(room.name, flags[i].name, policy.id);
                if (!this.keepMatchedBuildWithSameSize(
                            room, "flagName", flags[i].name, order)) {
                    var priority;
                    if (flags[i].pos.roomName == room.name)
                        priority = gc.PRIORITY_LINKER;
                    else
                        priority = gc.PRIORITY_NEUTRAL_LINKER;
                    routeBase.attachRoute(room.name, gc.ROLE_LINKER, order
                        , priority,flags[i].name);
                }
            }


            if (flags[i].pos.roomName != room.name
                && flags[i].memory.porterFrom
                && room.name == flags[i].memory.porterFrom.room) {
                order = new RouteNeutralPorter(room.name, flags[i].name, policy.id);
                if (!this.keepMatchedBuildWithSameSize(
                        room, "flagName", flags[i].name, order))
                    routeBase.attachRoute(room.name, gc.ROLE_NEUTRAL_PORTER,
                        order, gc.PRIORITY_NEUTRAL_PORTER,flags[i].name);
            }
        }
        this.attachFlaggedControlRoutes(room, policy);

        if (Game.time % gc.CHECK_FOR_ORPHANED_BUILDS_RATE == 0 ){
            this.checkForOrphanedBuilds(room);
        }

    },

    keepMatchedBuildWithSameSize: function(room, indexField, fieldValue, order) {
        var matches = routeBase.filterBuilds(room, indexField, fieldValue);
        for (var i = 0 ; i < matches.length ; i++ ) {
            if (matches[i].type == order.type) {
                if (matches[i].size == order.size
                    && matches[i].respawnRate == order.respawnRate) {
                  //  console.log("keepMatchedBuildWithSameSize")
                    // todo If linkers die need new ones quick. Should put somewhere else.
                    if (matches[i].priority == gc.PRIORITY_LINKER && matches[i].due >0 ) {
                        routeBase.resetDueIfRoureNotActive(room, matches[i], matches[i].flagName);
                    }
                    return true;
                } else {
                    routeBase.removeRoute(room.name, matches[i].id);
                    return false;
                }
            }
        }
        return false;
    },

    attachFlaggedControlRoutes: function (room, policy) {
        var flags = _.filter(Game.flags, function (flag) {
            return ( gc.FLAG_CONTROLLER == flag.memory.type
            && flag.memory.claimerFrom
            && flag.memory.claimerFrom.room == room.name
            && flag.memory.upgradeController);
        });
        for ( var  i = 0 ; i < flags.length ; i++ ) {
           // console.log(flags[i],flags,flags.length,"start gfor loop attachFlaggedControlRoutes",i);

            var matches = routeBase.filterBuilds(room, "reference", flags[i].name);
            var foundMatchingController = false, foundMatchingPatrol = false;
            var claimerBody = raceClaimer.body(raceClaimer.maxSizeRoom(room));
            var soldierBody = raceSwordsman.body(gc.SWORDSMAN_NEUTRAL_PATROL_SIZE);
           // console.log(flags,"0 attachFlaggedControlRoutes i = ",i);
            for (var j = 0; j < matches.length; j++) {
                if (gc.ROUTE_REMOTE_ACTIONS == matches[j].type) {
                    if (claimerBody.length == matches[j].body.length) {
                        foundMatchingController = true;
                    } else {
                        console.log(room,"attachFlaggedControlRoutes type",matches[j].type,"lengths",
                            claimerBody.length,matches[j].body.length);
                        routeBase.removeRoute(room.name, matches[j].id);
                    }
                } else if (gc.ROUTE_PATROL_ROOM == matches[j].type) {
                    if (soldierBody.length == matches[j].body.length) {
                        foundMatchingPatrol = true;
                    } else {
                        routeBase.removeRoute(room.name, matches[j].id);
                    }
                }
            }
          //  console.log(flags,"1 attachFlaggedControlRoutes i = ",i);
            if (!foundMatchingController) {
                this.attachFlaggedReverseController(flags[i], room, policy, claimerBody);
            }
        //    console.log(flags,"2 attachFlaggedControlRoutesii =",i);
            if (!foundMatchingPatrol) {
               // console.log(room,"attachPatrolCreep flag",flags[i],JSON.stringify(flags[i]));
                this.attachPatrolCreep(flags[i], room, soldierBody);
            }
        }
    },


    attachFlaggedReverseController: function (flag, room, policy, body)
    {
       // console.log(flag,"attachFlaggedReverseController");
        var actions = {
            room : flag.pos.roomName,
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        var size = body.length/2;
        var timeReversing = CREEP_CLAIM_LIFE_TIME - flag.memory.claimerFrom.distance;
        var ticksReversedLifetime = size * timeReversing;
        var respawn = ticksReversedLifetime - Math.ceil(gc.REVERSE_CLAIM_SAFETYNET / size);
        var order = new RouteRemoteActions(
            room.name,
            actions,
            body,
            respawn,
            policy.id,
            flag.name,
            size
        );
      //  console.log(flag,"attachFlaggedReverseController",JSON.stringify(order));
        routeBase.attachRoute(room.name, gc.ROUTE_REMOTE_ACTIONS,order,
            gc.PRIORITY_REVERSE_CONTROLLER,flag.name);
    },

    attachPatrolCreep: function (flag, room, body) {

        var respawn = CREEP_LIFE_TIME - flag.memory.claimerFrom.distance;
        var order = new RoutePatrolRoom(
            room.name,
            flag.pos.roomName,
            {roomName: flag.pos.roomName, x: 25, y: 25},
            body,
            respawn,
            flag.name,
            gc.SWORDSMAN_NEUTRAL_PATROL_SIZE
        );
     //   console.log(flag,"attachPatrolCreep",JSON.stringify(order));
        routeBase.attachRoute(room.name, gc.ROUTE_PATROL_ROOM,
            order,gc.PRIORITY_ROOM_PATROL,flag.name);
    },

    notReadyForLinkers: function (room) {
        return room.energyCapacityAvailable > gc.MIN_ENERGY_CAPACITY_LINKERS;
    },

    alreadyInBulidQueue: function(room, flag) {
        return routeBase.filterBuilds(room,"flagName", flag.name).length > 0;
    },

    attachFlexiStoragePorters: function (room, policy) {

        console.log(room, "attachFlexiStoragePorters, 0 < porterShortfall",
            policyMany2oneLinker.porterShortfall(room,policy));

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.memory.role == gc.ROLE_FLEXI_STORAGE_PORTER});

        console.log(room,"attachFlexiStoragePorters creeps", creeps.length ,
            "< max can fit in room",this.maxCreepsCanFitInRoom(room),"policy.id",policy.id );

     //  console.log(room,"number of porter parts needed",this.porterPartsNeeded(room));

      //  console.log(room,"partsForBuildQueue",this.partsForBuildQueue(room,0),
      //   "parts for upgarde",this.partsForUpgrade(room,0));


        if ( 0 < policyMany2oneLinker.porterShortfall(room,policy)
            && routeBase.filterBuilds(room,"type",gc.ROUTE_FLEXI_STORAGE_PORTER).length == 0) {


           if (creeps.length <= this.maxCreepsCanFitInRoom(room)) {
                var order = new RouteFlexiStoragePorter(room.name, 0, policy.id);
              //  console.log("attachFlexiStoragePorters creeplife", this.creepLifeTicks(policy),
              //      "< middale age", gc.PORTER_PRIORITY_THRESHOLD);
                if (this.creepLifeTicks(policy) < gc.PORTER_PRIORITY_THRESHOLD) {
                    var priority = gc.PRIORITY_EMERGENCY_HOME_PORTER;
                } else {
                    priority = gc.PRIORITY_HOME_PORTER
                }
                routeBase.attachRoute(room.name, gc.ROUTE_FLEXI_STORAGE_PORTER,order,priority);
           }
        }
        //console.log(room,"End of attachFlexiStoragePorters");
    },

    maxCreepsCanFitInRoom: function (room) {
        if (!room.storage) {
            return roomOwned.accessPointsType(room, FIND_SOURCES) +  room.find(FIND_SOURCES).length;
        } else {
            return roomOwned.accessPointsType(room, FIND_SOURCES)
                +  room.find(FIND_SOURCES).length + 6;
        }
    },

    attachRepairer: function (room) {
        var matches = routeBase.filterBuilds(room,"type", gc.ROUTE_REPAIRER);
        var previous;
        if (matches && matches[0]) {
            previous = matches[0]
        }
        var order = new RouteRepairer(room.name, policy.id);
        if ( previous && previous.size != order.size) {
            routeBase.removeRoute(room.name,previous.id);
            previous = undefined;
        }
        if (!previous) {
            routeBase.attachRoute(room.name, gc.ROUTE_REPAIRER,order,gc.PRIORITY_REPAIRER);
        }
    },

    creepLifeTicks: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id})
        var life = 0;
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            life = life + creeps[i].ticksToLive;
        }
        return life;
    },

    checkForOrphanedBuilds: function (room ) {
        var builds = _.filter(room.memory.routes.details, function (build) {
            return ( build !== undefined && build.owner == room.name );
        });
        //console.log(room,"checkForOrphanedBuilds",builds.length);
        for ( var i = 0 ; i < builds.length ; i++ ) {
            var flagName;
            if (builds[i].flagName) {
                flagName = builds[i].flagName;
            } else if (builds[i].reference) {
                flagName = builds[i].reference;
            }
            //console.log(room,"checkForOrphanedBuilds",flagName,flag,"type",builds[i].type);
            if (flagName) {
                var flag = Game.flags[flagName];

                if (flag ) {
                    switch (builds[i].type) {
                        case gc.ROUTE_LINKER:
                          //  console.log(room,"checkForOrphanedBuilds",flag.memory.linkerFrom.room,flagName);
                            if (flag.memory.linkerFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                            break;
                        case gc.ROUTE_NEUTRAL_PORTER:
                            if (flag.memory.porterFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                            break;
                        case gc.ROUTE_REMOTE_ACTIONS:
                        case gc.ROUTE_PATROL_ROOM:
                            if (flag.memory.claimerFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                        default:
                    } //switch
                } //if (flag )
            } //if (flagName)
        } // for
    },

    energyFromLinkersGen: function (room) {
        var linkers = routeBase.filterBuilds(room,"type",gc.ROUTE_LINKER);
        var energyCycle = 0;
        for ( var i = 0 ; i < linkers.length ; i++ ) {
            //console.log("energyFromLinkersGen", linkers.length);
            var flagName = linkers[i].flagName;
            if (flagName) {
                var flag = Game.flags[flagName];
                if (flag) {
                    if (flag.memory.energyCapacity) {
                      //  console.log(room,"energyFromLinkersGen",energyCycle);
                        energyCycle = energyCycle + flag.memory.energyCapacity;
                    }
                }
            }
        }
        return energyCycle * CREEP_LIFE_TIME / ENERGY_REGEN_TIME;
    },

    partsForBuildQueue: function(room, porterCosts, avProductionSupplyDistance, buildQueueEnergyPerGen) {
        if (!porterCosts) porterCosts = 0;
        if (!avProductionSupplyDistance) avProductionSupplyDistance = roomOwned.avProductionSupplyDistance(room);
        if (!buildQueueEnergyPerGen) buildQueueEnergyPerGen = routeBase.buildQueueEnergyPerGen(room);

        var distance = avProductionSupplyDistance;
        var energyPerPart = CREEP_CLAIM_LIFE_TIME  * CARRY_CAPACITY / (2*distance);
       // console.log(room,"partsforupgrade distance",distance,"energyPerPart",energyPerPart);
        return (buildQueueEnergyPerGen + porterCosts)/ energyPerPart;
    },

    partsForUpgrade: function(room, porterCosts, avUpgradeDistance, buildQueueEnergyPerGen, energyFromLinkersGen) {
        if (!porterCosts) porterCosts = 0;
        if (!avUpgradeDistance) avUpgradeDistance = roomOwned.avUpgradeDistance(room);
        if (!buildQueueEnergyPerGen) energyFromLinkersGen = this.energyFromLinkersGen(room);
        if (!buildQueueEnergyPerGen) buildQueueEnergyPerGen = routeBase.buildQueueEnergyPerGen(room);

        var distance = avUpgradeDistance;
        var energyPerPart = CREEP_CLAIM_LIFE_TIME * CARRY_CAPACITY / (2*distance+50);
        var upgraderEnergy = energyFromLinkersGen
                                - buildQueueEnergyPerGen - porterCosts ;
        //console.log(room,"partsforupgrade distance",distance,"energyPerPart",energyPerPart
       //                     ,"upgraderEnergy",upgraderEnergy);
        return upgraderEnergy / energyPerPart;
    },

    porterPartsNeeded: function (room, avProductionSupplyDistance, avUpgradeDistance,
                                 buildQueueEnergyPerGen, energyFromLinkersGen) {
        if (!avProductionSupplyDistance) avProductionSupplyDistance = roomOwned.avProductionSupplyDistance(room);
        if (!avUpgradeDistance) avUpgradeDistance = roomOwned.avUpgradeDistance(room);
        if (!energyFromLinkersGen) energyFromLinkersGen = this.energyFromLinkersGen(room);
        if (!buildQueueEnergyPerGen) buildQueueEnergyPerGen = routeBase.buildQueueEnergyPerGen(room);
        console.log(avProductionSupplyDistance,avUpgradeDistance,energyFromLinkersGen,buildQueueEnergyPerGen);

        var WORKER_PART_COST = 200;
        var buildParts = this.partsForBuildQueue(room,0,avProductionSupplyDistance,buildQueueEnergyPerGen);
        var upgradeParts = this.partsForUpgrade(room,0,avUpgradeDistance,
                                        buildQueueEnergyPerGen,energyFromLinkersGen);
        var porterCost = WORKER_PART_COST*(buildParts+upgradeParts);
        console.log(room,"porterPartsNeede build", buildParts,"upgrade",upgradeParts,"  porterCost iteration1", porterCost);
        buildParts = this.partsForBuildQueue(room,porterCost);
        upgradeParts = this.partsForBuildQueue(room,porterCost);
        console.log(room,"porterPartsNeede after itteration  build", buildParts,"upgrade",upgradeParts,
        "eneergy",WORKER_PART_COST*(buildParts+upgradeParts));
        return buildParts+upgradeParts;

/*
        var distance = roomOwned.avUpgradeDistance(room)+50 + roomOwned.avProductionSupplyDistance(room);
        var energyPerPart = CREEP_CLAIM_LIFE_TIME * CARRY_CAPACITY / distance;
        var energy = this.energyFromLinkersGen(room);
        return energy / energyPerPart;*/

    },


    processBuildQueue: function(room) {
        var spawns = room.find(FIND_MY_SPAWNS);
        var nextBuild = routeBase.nextBuild(room);

        if (undefined !== nextBuild) {
            var i = spawns.length-1;
            do {
                var result = routeBase.spawn(spawns[i], room, nextBuild);
               // console.log(room,"processBuildQueue",i,result);
            } while ( result == ERR_BUSY && i--)
        }
    }
};



module.exports = linkers;


























