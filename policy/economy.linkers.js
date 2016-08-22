/**
 * Created by Piers on 19/07/2016.
 */
/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
var roomOwned = require("room.owned");
var routeBase = require("route.base");
var RouteLinker = require("route.linker");
var RouteNeutralPorter = require("route.neutral.porter");
var RouteRemoteActions = require("route.remote.actions");
var RouteRepairer = require("route.repairer");
var RouteFlexiStoragePorter = require("route.flexi.storage.porter");
var gc = require("gc");
var policy = require("policy");
var raceClaimer = require("race.claimer");
var RoutePatrolRoom = require("route.patrol.room");
var RouteGiftCreep  = require("route.gift.creep");
var raceSwordsman = require("race.swordsman");
var raceWorker = require("race.worker");
var RouteMiner = require("route.miner");
var roomController = require("room.controller")
var RouteSuppressKeepers = require("route.suppress.keepers");
var RouteNeutralHarvester = require("route.neutral.harvest");
var flagBase = require("flag.base");

/**
 * Requisition object for using the pool
 * @module economyLinkers
 */

var economyLinkers = {
    LINK_TO_SOURCE_RANGE: 2,

    attachLocalFlaggedRoutes: function(room, policy) {
        if (!this.readyForLinkers(room))
            return;

        var flags = _.filter(Game.flags, function (flag) {
            return ( flag.memory.linkerFrom
            && room.name == flag.pos.roomName
            && flag.memory.linkerFrom.room == room.name );
        });
        for ( var j = 0 ; j < flags.length ; j++ ) {
            //console.log("attachFlaggedRoutes this rooms flags",flags[j]);
            if ( gc.FLAG_SOURCE == flags[j].memory.type
                || (gc.FLAG_MINERAL == flags[j].memory.type
                && this.useLinkerMiner(room, flags[j])) )  {

                this.attachHarvestLinker(room, flags[j], policy);

            } else if (gc.FLAG_MINERAL == flags[j].memory.type) {
                this.attachFlaggedMiner(room, flags[j]);
            }
        }
    } ,

    attachForeignFlaggedRoutes: function (room, policy) {
        if (!this.readyForForeignLinkers(room)) return;
        var flags = _.filter(Game.flags, function (f) {
            return (flagBase.linkerFrom(f, room.name)
                || flagBase.porterFrom(f, room.name)
                || flagBase.reverseControllerFrom(f, room.name))
                && room.name != f.pos.roomName;
        });
        var roomNames = flagBase.roomNamesFromFlags(flags);
        var orderRooms = this.orderForeignRooms(room, roomNames, flags);
        //console.log("attachForeignRoutes ordered rooms", JSON.stringify(orderRooms) );
        var spawnTime = room.find(FIND_MY_SPAWNS).length * CREEP_LIFE_TIME;
        var maxSpawnAvaliable = spawnTime * gc.SPAWN_RESERVE_MULTIPLIER - gc.SPAWN_RESERVE_TIME;
        spawnTime = 0;
       // console.log("maxSpawn", maxSpawnAvaliable,"spawnTime", spawnTime);
        for ( var i = 0 ; i < orderRooms.length ; i++) {
            spawnTime += orderRooms[i].spawnTime;
            //console.log("maxSpawn", maxSpawnAvaliable,"spawnTime", spawnTime);
            if (spawnTime > maxSpawnAvaliable) {
                return;
            }
            //console.log("roomnames attachForeignFlaggedRoutes", roomNames[i],orderRooms[i].roomName);
            var roomFlags = _.filter(flags, function(fl) {
                return fl.pos.roomName == orderRooms[i].roomName
            });
            if (roomFlags.length > 0) {
               // console.log("attachForeignFlaggedRoutes ready for keeper",this.readyForKeeperSuppress(room)
               // , "laier?",roomFlags[0].memory.keeperLairRoom );
                if (roomFlags[0].memory.keeperLairRoom
                    && this.readyForKeeperSuppress(room)) {
                   //console.log("attachForeignFlaggedRoutes keeper supppress");
                    this.attachKeeperRoomRoutes(room, orderRooms[i].roomName, roomFlags, policy,i);
                } else {
                    this.attachForeignRoomRoutes(room, orderRooms[i].roomName, roomFlags, policy,i);
                    //this.attachForeignRoomRoutes(myRoom.name, roomFlags, policy);
                }
            }
        }
    },

    orderForeignRooms: function(myRoom, roomNames, flags) {
        var orderedRooms = [];
        for ( var i = 0 ; i < roomNames.length ; i++ ) {
            if (!myRoom.memory.roomsToAvoid
                || myRoom.memory.roomsToAvoid.indexOf(roomName[i]) == -1 )
            {
                var roomFlags = _.filter(flags, function(fl) {
                    return fl.pos.roomName == roomNames[i]
                });
                var avDistance = 0, sourceEnergy = 0, count = 0;
                for ( var j = 0 ; j < roomFlags.length ; j++ ) {
                    //console.log(myRoom,"roomFlag outside if ",JSON.stringify(roomFlags[j].memory));
                    if (flagBase.linkerFrom(roomFlags[j], myRoom.name)) {
                        avDistance += roomFlags[j].memory.linkerFrom.distance;
                        sourceEnergy += roomFlags[j].memory.energyCapacity;
                        count++;
                        //console.log(myRoom,"roomFlag inside if",roomFlags[j]);
                    }
                }
                avDistance = Math.ceil(avDistance / count);
                //console.log(myRoom,"orderForeignRooms ",roomNames[i], avDistance, sourceEnergy);
                var spawnTime = this.spawnTimeForeignRoutes(avDistance, 5*sourceEnergy);
                if (roomFlags[0].memory.keeperLairRoom ) {
                    spawnTime += MAX_CREEP_SIZE * CREEP_SPAWN_TIME;
                }
                if( avDistance > 0 ) {
                    orderedRooms.push( {
                        roomName : roomNames[i],
                        avDistance : avDistance,
                        spawnTime : spawnTime
                    });
                }
            }
        }
        return orderedRooms.sort( function( r1, r2) { return r1.avDistance - r2.avDistance });
    },

    spawnTimeForeignRoutes: function(distance, energy) {
        var spawnTime;
        var workParts = energy/(HARVEST_POWER * CREEP_LIFE_TIME);
        var linkerParts = workParts * 3;
        spawnTime = linkerParts * CREEP_SPAWN_TIME *(CREEP_LIFE_TIME)/(CREEP_LIFE_TIME-distance);

        var carryParts = energy * (2*distance) /(CREEP_LIFE_TIME * CARRY_CAPACITY);
        var porterParts =  carryParts * 1.5 + 1;
        spawnTime += porterParts * CREEP_SPAWN_TIME;

        var claimParts = CREEP_LIFE_TIME / (CREEP_CLAIM_LIFE_TIME - distance);
        spawnTime += claimParts * 2;
        //console.log( "spawnTimeForeignRoutes", distance,"energy", energy,"spawn time", spawnTime);

        return Math.ceil(spawnTime);
    },

    attachForeignRoomRoutes: function(myRoom, roomName, roomFlags, policy, deltaPriority) {
        var room = Game.rooms[roomName];

        var contollerFlag = _.filter(roomFlags, function (f) {
            return f.memory && gc.FLAG_CONTROLLER ==  f.memory.type;
        })[0];
        if (contollerFlag && this.readyForReservContorller(myRoom) ) {
            //console.log(myRoom, "attach cvontoller", contollerFlag);
            var controllerRouteId = this.attachFlaggedReverseController(contollerFlag, myRoom, policy);
        }
        var linkers  = [];
        //console.log(roomName,"attachForeignRoomRoutes",roomFlags.length);//,JSON.stringify(roomFlags) );
        for ( var i = 0 ; i < roomFlags.length ; i++ ) {
            //console.log("attachForeignRoutes flags for room", roomName, JSON.stringify(roomFlags[i].memory));
            //console.log(i,"inside for loop porter",roomFlags[i], roomName, "myroom", myRoom,
            //   flagBase.porterFrom(roomFlags[i], myRoom.name), "linkerfrom"
           //     , flagBase.linkerFrom(roomFlags[i], myRoom.name));

            if (flagBase.porterFrom(roomFlags[i], myRoom.name)) {
                var porterRouteId = this.attachNeutralPorter(myRoom,roomFlags[i]);
            }

            if (porterRouteId && flagBase.linkerFrom(roomFlags[i], myRoom.name)) {
                var linkerRouteId = this.attachHarvestLinker(myRoom, roomFlags[i], policy, deltaPriority);

                linkers.push(linkerRouteId);
                var dependencies = [];
                if (controllerRouteId) {
                    dependencies.push( { id : controllerRouteId, priority : gc.PRIORITY_NEUTRAL_LINKER -3 } );
                }
                if (porterRouteId) {
                    dependencies.push( { id : porterRouteId, priority : gc.PRIORITY_NEUTRAL_LINKER -6 } );
                }
               // console.log("attachForeignRoomRoutes likerID",linkerRouteId,
               //     "dependancies", JSON.stringify(dependencies));
                if (dependencies.length > 0 && myRoom.memory.routes.details[linkerRouteId]) {
                    myRoom.memory.routes.details[linkerRouteId].dependancies = dependencies;
                }
            }
        }
        if (Game.time % gc.CHECK_FOR_ORPHANED_BUILDS_RATE == 0 ){
            this.checkForOrphanedBuilds(room);
        }
        //console.log("attachForeignRoomRoutes end linkers", JSON.stringify(linkers));
        return linkers;
    },

    attachKeeperRoomRoutes: function(myRoom, keeperRoomName, roomFlags, policy, deltaPriority) {
       // var room = Game.rooms[roomName];
        var suppresorId = this.suppressKeeperRoom(myRoom, roomFlags[0], deltaPriority);
        if (suppresorId) {
                          //this.attachForeignRoomRoutes(room, roomNames[i], roomFlags, policy);
            var linkers = this.attachForeignRoomRoutes(myRoom, keeperRoomName, roomFlags, policy, deltaPriority);
           // console.log("attachKeeperRoomRoutes linkers length", linkers.length);
            var dependants = [];
            for ( var i = 0 ; i < linkers.length ; i++ ) {
                dependants.push(  { id : linkers[i], priority : gc.PRIORITY_NEUTRAL_LINKER -4 } )
            }
            myRoom.memory.routes.details[suppresorId].dependancies = dependants;
        }
    },

    attachHarvestLinker: function(room, flag, policy, deltaPriority) {
        console.log(room,"attachHarvestLinker",flag);
        var healUnits = flag.memory.keeperLairRoom ? gc.KEEPER_HARVESTER_HEALER_PARTS : 0;
        var defensive = (room.name != flag.pos.roomName);

        //var defensive = room.name != flag.pos.roomName;
        var order = new RouteLinker(
            room.name,
            flag.name,
            policy ? policy.id : undefined,
            defensive,
            false,
            healUnits
        );
        deltaPriority = deltaPriority ? deltaPriority : 0;
        if (!this.keepMatchedBuildWithSameSize(
                room, "flagName", flag.name, order)) {
            var priority;
            if (flag.pos.roomName == room.name)
                priority = gc.PRIORITY_LINKER;
            else
                priority = gc.PRIORITY_NEUTRAL_LINKER;

            if (gc.FLAG_MINERAL == flag.memory.type)
                priority = gc.PRIORITY_MINER;
            if (flag.memory.keeperLairRoom)
                priority = gc.PRIORITY_KEEPER_HARVEST;

            var id = routeBase.attachRoute(
                room.name,
                gc.ROLE_LINKER,
                order,
                priority + deltaPriority,
                flag.name
            );
            console.log(flag,"attachHarvestLinker id is", id);
            return id;
        }
    },

    attachNeutralPorter: function(room, flag) {
        var priority;
        //var healParts;
        var respawnMultiplyer;
        if (flag.memory.keeperLairRoom) {
            if (!this.keeperRoomSuppressed(flag.pos.roomName))
                return;
            priority = gc.PRIORITY_KEEPER_PORTER;
           // healParts = gc.KEEPER_PORTER_HEALER_PARTS;
            respawnMultiplyer = gc.RESPAWN_MULTIPLYER_KEEPER;
        } else {
            priority = gc.PRIORITY_NEUTRAL_PORTER;
            //healParts = 0;
            respawnMultiplyer = gc.RESPAWN_MULTIPLYER_NEUTRAL;
        }

        var harvesters = routeBase.filterBuildsF(room, function(build) {
            return build.type == gc.ROUTE_NEUTRAL_PORTER
                && build.flagName == flag.name;
        });
        if (!harvesters || harvesters.length == 0) {
            if (!flag.memory.keeperLairRoom) { // Already got protection
                this.attachPatrolCreep(flag, room);
            }
            var order = new RouteNeutralPorter(
                room.name,
                flag.name,
                respawnMultiplyer
            );
            var id = routeBase.attachRoute(
                room.name,
                gc.ROUTE_NEUTRAL_HARVEST,
                order,
                priority,
                flag.name
            );
            //console.log("attachNeutralPorter id is", id);
            return id;
        }
    },

    useLinkerMiner: function (room, flag) {
        //console.log(flag,"useLinkerMiner",flag.memory.type);
        if (flag.memory.type != gc.FLAG_MINERAL) return false;
        //console.log(flag,"useLinkerMiner extractor",flag.memory.extractor);
        if (!flag.memory.extractor) return false;

        var storage = room.find(FIND_STRUCTURES, {
            filter: function(store) {
                return store.structureType == STRUCTURE_STORAGE
                    || store.structureType == STRUCTURE_TERMINAL
                    && store.storeCapacity - _.sum(store.store) > gc.KEEP_FREE_STORAGE_SPACE
            }
        });
        var storageInRange = flag.pos.findInRange(storage,2);
        //console.log(flag,"useLinkerMiner",storageInRange);
        if (!storageInRange || storageInRange.length == 0) return false;

        var mineral = Game.getObjectById(flag.name);
        //console.log(flag,"useLinkerMiner mineralAmount",mineral.mineralAmount);
        if (mineral.mineralAmount > 0) return true;

        var links = room.find(FIND_STRUCTURES, {
            filter: function(store) {
                return store.structureType == STRUCTURE_LINK
            }
        });
        var linksInRange = flag.pos.findInRange(links,2);
        //console.log(flag,"useLinkerMiner links",linksInRange);
        return linksInRange.length > 0;
    },

    attachFlaggedMiner: function (room, flag) {
        console.log(room,"attach miner",flag);
        var matches = routeBase.filterBuildsF(room, function(build) {
            return build.mineId == flag.name;
        });
        var exhausted = (Game.getObjectById(flag.name).mineralAmount == 0);
        if ( (matches && matches[0] && gc.ROUTE_LINKER == matches[0].type)
              || exhausted ) {
                console.log(room,"remove miner route",flag);
                routeBase.removeRoute(room, matches[0].id);
        }

        if (!matches || matches.length == 0 && !exhausted) {
            if (flag.memory.keeperLairRoom
                && !this.keeperRoomSuppressed(flag.pos.roomName))
                return;

            var storage = room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return (s.structureType == STRUCTURE_STORAGE
                        || s.structureType == STRUCTURE_TERMINAL)
                        && s.storeCapacity - _.sum(s.store) > gc.KEEP_FREE_STORAGE_SPACE
                }
            });
            if (storage.length > 0) {
                var order = new RouteMiner(
                    room.name,
                    flag.name,
                    flag.memory.resourceType,
                    flag.pos,
                    CREEP_LIFE_TIME
                );
                return routeBase.attachRoute(room.name, gc.ROLE_MINER, order, gc.PRIORITY_MINER);
            }
        }
    },

    keeperRoomSuppressed: function (roomName) {
        if (!Memory.rooms[roomName].suppressed) return false;
        return Memory.rooms[roomName].suppressed - Game.time < CREEP_LIFE_TIME;
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
                        routeBase.resetDueIfRouteNotActive(room, matches[i], matches[i].flagName);
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

    attachFlaggedReverseController: function (flag, room, policy)
    {
        var reservers = routeBase.filterBuildsF(room, function(build) {
            return build.type == gc.ROUTE_REMOTE_ACTIONS
                && build.reference == flag.name;
        });
        if (reservers.length > 0) return reservers[0].id;

        // console.log(flag,"attachFlaggedReverseController");
        var claimerBody = raceClaimer.body(raceClaimer.maxSizeRoom(room));
        var actions = {
            room : flag.pos.roomName,
            action : "reserveController",
            findFunction : "findController",
            findFunctionsModule : "policy.remote.actions"
        };
        var size = claimerBody.length/2;
        var timeReversing = CREEP_CLAIM_LIFE_TIME - flag.memory.claimerFrom.distance;
        var ticksReversedLifetime = size * timeReversing;
        var respawn = ticksReversedLifetime - Math.ceil(gc.REVERSE_CLAIM_SAFETYNET / size);
        var order = new RouteRemoteActions(
            room.name,
            actions,
            claimerBody,
            respawn,
            policy ? policy.id : undefined,
            flag.name,
            size
        );
      //  console.log(flag,"attachFlaggedReverseController",JSON.stringify(order));
        return routeBase.attachRoute(room.name, gc.ROUTE_REMOTE_ACTIONS,order,
            gc.PRIORITY_REVERSE_CONTROLLER,flag.name);
    },

    attachPatrolCreep: function (flag, room) {
        var soldierBody = raceSwordsman.body(gc.SWORDSMAN_NEUTRAL_PATROL_SIZE);
        var patrols = routeBase.filterBuildsF(room, function(build) {
            return build.type == gc.ROUTE_PATROL_ROOM
                && build.patrolRoom == flag.pos.roomName;
        });
        if (patrols.length > 0) return patrols[0].id;

        var respawn = CREEP_LIFE_TIME - flag.memory.linkerFrom.distance;
        var order = new RoutePatrolRoom(
            room.name,
            flag.pos.roomName,
            {roomName: flag.pos.roomName, x: 25, y: 25},
            soldierBody,
            respawn,
            flag.name,
            gc.SWORDSMAN_NEUTRAL_PATROL_SIZE
        );
        //   console.log(flag,"attachPatrolCreep",JSON.stringify(order));
        return routeBase.attachRoute(room.name, gc.ROUTE_PATROL_ROOM,
            order,gc.PRIORITY_ROOM_PATROL,flag.name);

    },

    readyForLinkers: function (room) {
        return room.energyCapacityAvailable >= gc.MIN_ENERGY_CAPACITY_LINKERS;
    },

    readyForForeignLinkers: function (room) {
        return room.energyCapacityAvailable > gc.MIN_ENERGY_CAPACITY_FOREIGN_LINKERS;
    },

    readyForReservContorller: function (room) {
        return room.energyCapacityAvailable >= gc.MIN_ENERGY_CAPACITY_FOREIGN_LINKERS;
    },


    readyForKeeperSuppress: function (room) {
        //console.log("readyForKeeperSuppress  room energy",room.energyCapacityAvailable,
        //    ">",gc.MIN_ENERGY_CAPACITY_KEEPER_ROOM);
        return room.energyCapacityAvailable >= gc.MIN_ENERGY_CAPACITY_KEEPER_ROOM;
    },

    attachFlexiStoragePorters: function (room, policy) {

       // console.log(room, "attachFlexiStoragePorters, 0 < porterShortfall",
      //      this.porterShortfall(room,policy), "existing parts",  this.existingPorterParts(policy)
      //      ,"quick partsNeeded",this.quickPorterPartsNeeded(room));

    //    console.log(room, "attachFlexiStoragePorters, 0 < porterShortfall",
    ///        this.porterShortfall(room,policy), "existing parts",  this.existingPorterParts(policy)
    //        ,"porterPartsNeeded",this.porterPartsNeeded(room));

        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.memory.role == gc.ROLE_FLEXI_STORAGE_PORTER});
       // console.log(room, "attachFlexiStoragePorters, 0 < porterShortfall",
      //      this.porterShortfall(room,policy), "existing parts",  this.existingPorterParts(policy),
      //      "creeps", creeps.length ,
      //      "< max can fit in room",this.maxCreepsCanFitInRoom(room),"policy.id",policy.id );

     //  console.log(room,"number of porter parts needed",this.porterPartsNeeded(room));

      //  console.log(room,"partsForBuildQueue",this.partsForBuildQueue(room,0),
      //   "parts for upgarde",this.partsForUpgrade(room,0));
        //if (this.existingPorterParts(policy) < this.porterPartsNeeded(room))


        if ( 0 < this.porterShortfall(room,policy)
            && routeBase.filterBuilds(room,"type",gc.ROUTE_FLEXI_STORAGE_PORTER).length == 0) {

           if (creeps.length <= this.maxCreepsCanFitInRoom(room)) {
                var order = new RouteFlexiStoragePorter(room.name, 0, policy.id);
               // console.log("attachFlexiStoragePorters creeplife", this.creepLifeTicks(policy),
              //      "< middale age", gc.PORTER_PRIORITY_THRESHOLD);
               var creepLifeTicks = this.creepLifeTicks(policy);
               if (creepLifeTicks < gc.PORTER_PRIORITY_THRESHOLD) {
                    var priority = gc.PRIORITY_EMERGENCY_HOME_PORTER;
                } else {
                    priority = gc.PRIORITY_HOME_PORTER
                }
                return routeBase.attachRoute(room.name, gc.ROUTE_FLEXI_STORAGE_PORTER,order,priority);
           }
        }
        //console.log(room,"End of attachFlexiStoragePorters");
    },

    suppressKeeperRoom: function(room, flag, deltaPriority) {
        var keeperRoom = flag.pos.roomName;
        var distance = flag.memory.linkerFrom.distance;
         console.log("suppressKeeperRoom", room, keeperRoom, distance);
        //if (room.energyCapacityAvailable < roomController.maxProduction[7])
        //    return;

        var suppressors = routeBase.filterBuildsF(room, function(build) {
           return build.type == gc.ROUTE_SUPPRESS_KEEPERS
               && build.keeperRoom == keeperRoom;
        });
        deltaPriority = deltaPriority ? deltaPriority : 0;
        //console.log("suppressKeeperRoom", JSON.stringify(suppressors));
        if (suppressors.length == 0) {
            var respawnRate = CREEP_LIFE_TIME - gc.KEEPER_ATTACK_SPAWN_RATE_BUFFER - distance;
            var order = new RouteSuppressKeepers(keeperRoom, undefined, respawnRate, 14, 11);
            //console.log(room.name,"suppressKeeperRoom order", JSON.stringify(order));
            var id = routeBase.attachRoute(
                room.name,
                gc.ROUTE_SUPPRESS_KEEPERS,
                order,
                gc.PRIORITY_KEEPER_ATTACK + deltaPriority
            );
           // console.log(room.name,"suppressKeeperRoom id of route",id)
            return id;
        }
    },

    maxCreepsCanFitInRoom: function (room) {
        if (!room.storage) {
            return roomOwned.accessPointsType(room, FIND_SOURCES) +  room.find(FIND_SOURCES).length;
        } else {
            return roomOwned.accessPointsType(room, FIND_SOURCES)
                +  room.find(FIND_SOURCES).length + 6;
        }
    },

    creepLifeTicks: function (policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id});
        var life = 0;
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            if (creeps[i] && creeps[i].ticksToLive)
                life = life + creeps[i].ticksToLive;
        }
        return life;
    },

    checkForOrphanedBuilds: function (room ) {
        if (!room.memory.routes) return;
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
                            if (flag.memory.linkerFrom && flag.memory.linkerFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                            break;
                        case gc.ROUTE_NEUTRAL_PORTER:
                            if (flag.memory.porterFrom && flag.memory.porterFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                            break;
                        case gc.ROUTE_REMOTE_ACTIONS:
                        case gc.ROUTE_PATROL_ROOM:
                            if (flag.memory.claimerFrom && flag.memory.claimerFrom.room != room.name) {
                                routeBase.removeRoute(room.name, builds[i].id);
                            }
                            break;
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

    porterPartsNeeded: function (room) {
        var avProductionSupplyDistance = roomOwned.avProductionSupplyDistance(room);
        var productionEnergyPerPart = CREEP_LIFE_TIME  * CARRY_CAPACITY
            / (2 * avProductionSupplyDistance + gc.TIME_TRANSFER_LOAD);

        var avUpgradeDistance = roomOwned.avUpgradeDistance(room)
        var upgradeEnergyPerPart = CREEP_LIFE_TIME * CARRY_CAPACITY
            / ( 2 * avUpgradeDistance + gc.TIME_UPGRADE_LOAD);

        var energyAvailable = this.energyFromLinkersGen(room);
        var buildQueueEnergy = routeBase.buildQueueEnergyPerGen(room);
        var WORKER_PART_COST = raceWorker.BLOCKSIZE;
     //   console.log("production distance",avProductionSupplyDistance,"productio energy",productionEnergyPerPart,
    //        "upgrade distance", avUpgradeDistance, "upgrade energy",upgradeEnergyPerPart,
      //      "energy avaliabel",energyAvailable,"buildqueue", buildQueueEnergy);

        var denominator = WORKER_PART_COST * productionEnergyPerPart
                            - WORKER_PART_COST * upgradeEnergyPerPart
                            + productionEnergyPerPart * upgradeEnergyPerPart;

        var productionParts = ( WORKER_PART_COST * energyAvailable + upgradeEnergyPerPart * buildQueueEnergy )
                                / denominator;


        var upgradeParts = ( productionEnergyPerPart *  energyAvailable
                            - WORKER_PART_COST * energyAvailable - productionEnergyPerPart * buildQueueEnergy )
                            / denominator;
        console.log("porterPartsNeeded poductin", productionParts, "upgrade", upgradeParts,
            "total", productionParts + upgradeParts);
        return productionParts + upgradeParts;
    },

    processBuildQueue: function(room) {
        var spawns = room.find(FIND_MY_SPAWNS);
        //console.log(room,spawns,"processBuildQueue");
            var i = spawns.length-1;
            //console.log(room,spawns,"i",i);
            do {
                var nextBuild = routeBase.nextBuild(room);
                //console.log(room,spawns[i],"processBuildQueue",JSON.stringify(nextBuild));
                if (undefined !== nextBuild) {
                    var result = routeBase.spawn(spawns[i], room, nextBuild);
                }
            } while ( result == ERR_BUSY && i--)
    },

    existingPorterParts: function (currentPolicy) {
        var parts = 0;
        var porters = _.filter(Game.creeps, function (creep) {
            return (creep.memory.policyId == currentPolicy.id
            &&  creep.memory.role == gc.ROLE_FLEXI_STORAGE_PORTER );
        });
        // console.log("existingPorterParts number creeps",porters.length);
        parts = 0;
        for (var i in porters) {
            parts = parts + porters[i].getActiveBodyparts(WORK);
        }
        //   console.log("existingPorterParts  parts",parts);
        return parts;
    },

    porterShortfall: function (room,currentPolicy) {
        //var porterSize = this.porterSize(room);
        var existingPorterParts = this.existingPorterParts(currentPolicy);

        //var externalCommitments = poolSupply.getEnergyInBuildQueue();

        var energyInStorage;
        if ( room.storage !== undefined) {
            energyInStorage = room.storage.store[RESOURCE_ENERGY];
        } else {
            energyInStorage = 0;
        }
        var portersNoCommitmentsEnergyLT = roomOwned.energyLifeTime(room, 1, gc.ROLE_FLEXI_STORAGE_PORTER);
        var sourceEnergyLT  = roomOwned.allSourcesEnergy(room) *5;
        var energyBuildLinkersAndRepairer = 4*1000;
        var energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer;// - externalCommitments;
        var numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);

        var extraPartsForStorage = existingPorterParts - numPortersPartsNeeded;
        // console.log("extraPartsForStorage",extraPartsForStorage,"existingPorterParts"
        //                  ,existingPorterParts,"numPortersPartsNeeded",numPortersPartsNeeded);

        var availableInStorage = Math.max(0, energyInStorage - gc.STORAGE_STOCKPILE - extraPartsForStorage * portersNoCommitmentsEnergyLT);
        //    console.log("available InStorage",availableInStorage,"energyInStorage",energyInStorage,"extraPartsForStorage",
        //                     extraPartsForStorage,"portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT);

        energyForUpgrading = sourceEnergyLT - energyBuildLinkersAndRepairer + availableInStorage ;//externalCommitments
        numPortersPartsNeeded = Math.max(5,energyForUpgrading / portersNoCommitmentsEnergyLT);
        //console.log("porterShortfall number of parts needed", numPortersPartsNeeded);

        var porterShortfall = numPortersPartsNeeded - existingPorterParts;
        //  console.log(room,"many2one portorparts",numPortersPartsNeeded);
        //*policy.creepsAgeFactor(currentPolicy);

        /*
         console.log("existingPorterParts",existingPorterParts,"externalCommitments",externalCommitments);
         console.log("portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT,"sourceEnergyLT",sourceEnergyLT
         ,"energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer);

         console.log("energyForUpgrading",energyForUpgrading,"sourceEnergyLT",sourceEnergyLT,
         "energyBuildLinkersAndRepairer",energyBuildLinkersAndRepairer,"externalCommitments",externalCommitments,
         "energyInStorage",energyInStorage);
         console.log("numPortersPartsNeeded",numPortersPartsNeeded,"energyForUpgrading",energyForUpgrading,
         "portersNoCommitmentsEnergyLT",portersNoCommitmentsEnergyLT);
         console.log(room,"porterShortfall",porterShortfall,"numPortersPartsNeeded",numPortersPartsNeeded,"existingPorterParts"
         ,existingPorterParts,"age factor",policy.creepsAgeFactor(currentPolicy));
         */
        return porterShortfall;
    },
};

module.exports = economyLinkers;





















