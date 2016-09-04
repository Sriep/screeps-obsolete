/**
 * Created by Piers on 21/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to owned rooms.
 * @author Piers Shepperson
 */
"use strict";
var RouteScout = require("route.scout");
var routeBase = require("route.base");
var gc = require("gc");
var gf = require("gf");

/**
 * Abstract object containing data and functions
 * related to owned rooms.
 * @module roomBase
 */
var roomBase = {
    // Always flagged as permanent
    // FIND_SOURCES, FIND_MINERALS, STRUCTURE_CONTROLLER
    // STRUCTURE_KEEPER_LAIR,
    //
    // Also Flagged in neutral rooms but not permeate
    // STRUCTURE_PORTAL, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN


    examineRooms: function () {
        var force;
        if (Game.time % gc.ROOM_UPDATE_RATE == 0 ){
            force = true;
        }
        for ( var room in Game.rooms ) {
            if (room.memory && !room.memory.flagged || force) {
                this.flagRoom(Game.rooms[room]);
            }
        }
        //var nearByRooms = this.nearByRooms();
        var nearByRooms = this.roomsInRange(2);
        for ( var i = 0 ; i < nearByRooms.length ; i++ ) {
            if (!this.isMyRoom(nearByRooms[i])) {
                if (Memory.rooms[nearByRooms[i]] === undefined
                    || !Memory.rooms[nearByRooms[i]].flagged) {
                    roomBase.sendScout(nearByRooms[i]);
                }
                if (roomBase.isEnemyRoom(nearByRooms[i])) {
                    roomBase.planInvasion();
                }
            }
        }
    },

    flagRoom: function (room) {
        this.flagPermanents(room);
        if (room.controller && room.controller.my) {
            this.flagMyRoomStructures(room);
        }
    },

    flagPermanents: function (room) {
        var flagName;

        var keeperLairs = room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_KEEPER_LAIR }
        });
        for ( i in keeperLairs ) {
            flagName = keeperLairs[i].id;
            if (!Game.flags[flagName])
                keeperLairs[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_KEEPERS_LAIR_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_KEEPERS_LAIR;
            Game.flags[flagName].memory.keeperLairRoom = true;
        }

        var sources = room.find(FIND_SOURCES);
        for ( var i in sources ) {
            flagName = sources[i].id;
            if (!Game.flags[flagName])
                sources[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_SOURCE_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_SOURCE;
            Game.flags[flagName].memory.resourceType = RESOURCE_ENERGY;
          //  console.log("flagPermanents flagName",flagName,"type",Game.flags[flagName].memory.type );
            Game.flags[flagName].memory.energyCapacity = sources[i].energyCapacity;
            if (room.controller && sources.length >= gc.SOURCES_REVERSE_CONTROLLER  && !this.isMyRoom(room.name)) {
                Game.flags[flagName].memory.upgradeController = true;
            }
            if (keeperLairs.length > 0) Game.flags[flagName].memory.keeperLairRoom = true;
        }
        if (room.controller) {
            flagName = room.controller.id;
            if (!Game.flags[flagName])
                room.controller.pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_CONTROLLER_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_CONTROLLER;
            if (!this.isMyRoom(room.name)) {
                Game.flags[flagName].memory.upgradeController = (sources.length >= gc.SOURCES_REVERSE_CONTROLLER);
            }
            if (keeperLairs.length > 0) Game.flags[flagName].memory.keeperLairRoom = true;
        }

        var minerals = room.find(FIND_MINERALS);
        for ( i in minerals ) {
            flagName =  minerals[i].id;
            if (!Game.flags[flagName])
                minerals[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_MINERAL_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_MINERAL;
            Game.flags[flagName].memory.resourceType = minerals[i].mineralType;
            Game.flags[flagName].memory.extractor = gf.isStructureTypeAtPos(minerals[i].pos, STRUCTURE_EXTRACTOR);
            if (keeperLairs.length > 0) Game.flags[flagName].memory.keeperLairRoom = true;
        }

        var walls = room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_WALL }
        });
        for ( i in walls ) {
            flagName = walls[i].id;
            if (!Game.flags[flagName])
                walls[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_WALL_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_WALL;
        }

        var portals = room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_PORTAL }
        });
        for ( i in portals ) {
            flagName = portals[i].id;
            if (!Game.flags[flagName])
                portals[i].pos.createFlag(flagName, gc.FLAG_PERMANENT_COLOUR, gc.FLAG_PORTAL_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_PORTAL;
            Game.flags[flagName].memory.destination = portals[i].destination;
            if (portals[i].ticksToDecay)
                Game.flags[flagName].memory.decay = Game.time + portals[i].ticksToDecay;
        }

        room.memory.flagged = true;
    },

    flagMyRoomStructures: function (room) {
        var structures = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_LINK;
            }
        });
        for ( var i = 0 ; i < structures.length ; i++ ) {
            var flagName = structures[i].id;
            if (!Game.flags[flagName])
                structures[i].pos.createFlag(flagName, gc.FLAG_STRUCTURE_COLOUR, gc.FLAG_LINK_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_LINK;
        }

        structures = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_LAB;
            }
        });
        for ( var i = 0 ; i < structures.length ; i++ ) {
            flagName = structures[i].id;
            if (!Game.flags[flagName])
                structures[i].pos.createFlag(flagName, gc.FLAG_LAB_COLOUR, gc.FLAG_LAB_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_LAB;
        }

        structures = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_TERMINAL;
            }
        });
        for ( var i = 0 ; i < structures.length ; i++ ) {
             flagName = structures[i].id;
            if (!Game.flags[flagName])
                structures[i].pos.createFlag(flagName, gc.FLAG_STRUCTURE_COLOUR, gc.FLAG_TERMINAL_COLOUR);
            Game.flags[flagName].memory.type = gc.FLAG_TERMINAL;
        }

    },

    isEnemyRoom: function (roomName) {
        if (!roomName) return undefined;
        if (!Game.rooms[roomName]) return undefined;
        if (!Game.rooms[roomName].controller) return false;
        if (!Game.rooms[roomName].controller.owner) return false;
        return !Game.rooms[roomName].controller.my
    },

    isNeutralRoom: function (roomName) {
        if (!Game.rooms[roomName]) return undefined;
        if (!Game.rooms[roomName].controller) return true;
        return !Game.rooms[roomName].controller.owner;
    },

    isMyRoom: function (roomName) {
        if (!Game.rooms[roomName]) return false;
        if (!Game.rooms[roomName].controller) return false;
        if (!Game.rooms[roomName].controller.owner)  return false;
        return Game.rooms[roomName].controller.my;
    },

    sendScout: function (roomName) {
        var adjacencies = this.findAdjacentOwnedRooms(roomName);
        if (adjacencies.length > 0) {
            this.sendScoutFromTo(adjacencies[0], roomName)
        }
    },

    findAdjacentOwnedRooms: function (roomName) {
        var myRooms = _.filter(Game.rooms, function (room) {
            return room.controller && room.controller.my
        });
        var adjacencies = [];
        for ( var i = 0 ; i < myRooms.length ; i++ )
        {
            var exits = Game.map.describeExits(myRooms[i].name);
            for ( var j in exits) {
                if (exits[j] == roomName)
                    adjacencies.push(myRooms[i].name);
            }
        }
        return adjacencies;
    },

    sendScoutFromTo: function(fromRoom, toRoom) {
        //console.log("send scout from",fromRoom,"to", toRoom);
        if (!Memory.rooms[fromRoom]) return;
        if (!Memory.rooms[fromRoom].scouts)
            Memory.rooms[fromRoom].scouts = {};
        if  (Memory.rooms[fromRoom].scouts[toRoom]
            && Game.time - Memory.rooms[fromRoom].scouts[toRoom]
                 < CREEP_LIFE_TIME * gc.SEND_SCOUT_FREQUENCY_GEN) {
            //console.log("dont send scout memroy", Memory.rooms[fromRoom].scouts[toRoom]);
            return;
        }

        var matches = routeBase.filterBuildsF(Game.rooms[fromRoom], function(build) {
            return build.type == gc.ROUTE_SCOUT
                && build.targetRoom == toRoom;
        });
        if ((!matches || matches.length == 0))  {
            //console.log("about to attach route memory",Memory.rooms[fromRoom].scouts[toRoom] );
            var order = new RouteScout(toRoom);
            routeBase.attachRoute(fromRoom, gc.ROLE_SCOUT, order, gc.PRIORITY_SCOUT);
            Memory.rooms[fromRoom].scouts[toRoom] = Game.time;
        }
    },



    planInvasion: function (room) {
        // TODO plan invasion of enemy room
      //  console.log("plan invasion of", room);
    },

    nearByRooms: function (){
        var myRooms = _.filter(Game.rooms, function (room) {
            return room.controller && room.controller.my
        });
        var nearByRooms = [];
        for ( var i = 0 ; i < myRooms.length ; i++ )
        {
            var exits = Game.map.describeExits(myRooms[i].name);
            for ( var j in exits) {
                if (nearByRooms.indexOf(exits[j]) == -1) {
                    nearByRooms.push(exits[j]);
                }
            }
        }
        return nearByRooms;
    },

    roomsInRange: function (range) {
        var myRooms = _.filter(Game.rooms, function (room) {
            return room.controller && room.controller.my
        });
        var nearByRooms = [];
        for ( var i = 0 ; i < myRooms.length ; i++ )
        {
            this.roomsInRangeRoom(myRooms[i].name, range-1, nearByRooms);
            if (nearByRooms.indexOf(myRooms[i].name) == -1) {
                nearByRooms.push(myRooms[i].name);
            }
        }
        return nearByRooms;
    },

    findClosestOwnedRooms: function (roomName, maxDepth) {
        var depth = 0;
        maxDepth = maxDepth ? maxDepth : 5;
        var closest = [];
        while ( 0 == closest.length  && depth++ < maxDepth ) {
            closest = this.findOwnedRooms(roomName,depth);
        }
        return gf.unique(closest);
    },



    findOwnedRooms: function (roomName, depth) {

        if (this.isMyRoom(roomName)) {
            //console.log("found my room",roomName, depth);
            return [ roomName ];
        }
        //console.log("findOwnedRooms",roomName, depth);
        if ( --depth <= 0 || this.isEnemyRoom(roomName)) return [];

        var rooms = [];
        var exits = Game.map.describeExits(roomName);
        //console.log("findOwnedRooms", roomName, depth, JSON.stringify(exits));
        for (var i in exits) {
            rooms = rooms.concat( this.findOwnedRooms(exits[i], depth) );
            //console.log(roomName, "findOwnedRooms rooms", JSON.stringify(rooms));
        }
        return rooms;
    },

    roomsInRangeRoom: function (roomName, range, foundSoFar) {
        if (this.isEnemyRoom(roomName)) return;
        var exits = Game.map.describeExits(roomName);
        //console.log("roomesinrange",range,roomName);
        for ( var i in exits) {
            if (foundSoFar.indexOf(exits[i]) == -1) {
                foundSoFar.push(exits[i]);
            }
            if (range > 0) this.roomsInRangeRoom(exits[i], range-1, foundSoFar);
        }
    },

    distanceBetween: function  (posFrom, posTo, route) {
        var DEFUALT_DISTANCE_ON_ERROR = 10;
        //console.log("distance between start", JSON.stringify(posFrom)
        //    , "posTo", JSON.stringify(posTo));
        route = Game.map.findRoute(posFrom.roomName, posTo.roomName, {
            routeCallback(roomName, fromRoomName) {
                if(!roomBase.canSeeRoom(roomName)
                    || roomBase.isEnemyRoom(roomName)) {	// avoid this room
                    return Infinity;
                }
                return 1;
            }
        });
        //console.log("distanceBetween route", JSON.stringify(route));
        if (ERR_NO_PATH == route)
            return route;
        var distance = 0;
        if (route.length > 0) {
            var exit = posFrom.findClosestByPath(route[0].exit);
           // console.log("distanceBetween exit",exit,"posFrom",posFrom,"route",JSON.stringify(route));
            if (exit)
                distance = posFrom.findPathTo(exit).length;
            else {
                //console.log("distanceBetween null path between" ,exit, "and", route[0].exit);
                distance = DEFUALT_DISTANCE_ON_ERROR;
                //todo hack think this is a bug in screeps code. Come with better fix.
            }
            var entrance = this.exitToEntrance(exit, route[0].room);
            if (!entrance) return distance + DEFUALT_DISTANCE_ON_ERROR;
            for (var i = 1; i < route.length; i++) {
                exit = entrance.findClosestByPath(route[i].exit);
                if (exit) {
                    distance += entrance.findPathTo(exit).length;
                    entrance = this.exitToEntrance(exit, route[i].room);
                }      else {
                    //console.log("distanceBetween null path between" ,exit, "and", route[i].exit);
                    distance += DEFUALT_DISTANCE_ON_ERROR;
                    //todo hack think this is a bug in screeps code. Come with better fix.
                    entrance = undefined;
                }
            }
        }
        //console.log(distance,"distance between from", posFrom,"to", posTo, "entrance", JSON.stringify(entrance));
        distance += posTo.findPathTo(entrance).length;
        return distance;
    },

    distanceBetweenApprox: function  (posFrom, posTo, route) {
       // console.log("distance between start", JSON.stringify(posFrom)
       //     , "posTo", JSON.stringify(posTo));
        route = Game.map.findRoute(posFrom.roomName, posTo.roomName, {
        routeCallback(roomName, fromRoomName) {
            if(roomBase.isEnemyRoom(roomName)) {	// avoid this room
                return Infinity;
            }
            return 1;
        }});
       // console.log("distanceBetween route", JSON.stringify(route));
        var distance = 0;
        if (route.length > 0) {
            var exit = posFrom.findClosestByRange(route[0].exit);
            distance = posFrom.getRangeTo(exit).length;
            var entrance = this.exitToEntrance(exit, route[0].room);

            for (var i = 1; i < route.length; i++) {
                exit = posFrom.findClosestByRange(route[i].exit);
                distance += entrance.getRangeTo(exit).length;
                entrance = this.exitToEntrance(exit, route[i].room);
            }
        }
       // console.log(distance,"distance between from", posFrom,"to", posTo, "entrance", JSON.stringify(entrance));
        distance += posTo.getRangeTo(entrance).length;
        return distance;
    },

    canSeeRoom: function(roomPos) {
        return Game.rooms[roomPos] !== undefined;
    },

    findClosest: function (pos, findType, Opts) {
        var exits = Game.map.describeExits(pos.roomName);
        //console.log("findCoslest exits",JSON.stringify(exits));
        var roomClosest, distanceClosest;
        for ( var i in exits ) {
            if (roomBase.isMyRoom(exits[i])) {

                var exit = pos.findClosestByPath(parseInt(i));
                //console.log("findClosest exit",i,JSON.stringify(exit));
                if (!exit) {
                    //console.log("findClosest using range",i,JSON.stringify(exit));
                    //todo some bug. for now arbitrarily set distance to 25, should do something cleverer
                    exit = pos.findClosestByRange(parseInt(i));
                    if (!distanceClosest || distanceClosest > 10) {
                        distanceClosest = 10;
                        roomClosest = exits[i];
                    }
                }
                if (exit) {
                    var entrance = this.exitToEntrance(exit, exits[i]);
                    var target = entrance.findClosestByRange(findType, Opts);
                    if (target) {
                      //  console.log("about to distance betwen pos",JSON.stringify(pos), JSON.stringify(target.pos) );
                        var distance = this.distanceBetween(pos, target.pos);
                   //     console.log("distance",distance );
                        if (!distanceClosest || distance < distanceClosest) {
                            distanceClosest = distance;
                            roomClosest = exits[i];
                        }
                    }
                }
            }
        }
        //console.log("findClosestSpawn retuncs",JSON.stringify({ room : roomClosest, distance : distanceClosest }) );
        return { room : roomClosest, distance : distanceClosest };
    },

    justInsideNextRoom: function (thisRoom, nextRoom, pos) {
        if (!thisRoom || !nextRoom) return undefined;
        if (!pos)
             pos = new RoomPosition(25,25,thisRoom);
        var exits = Game.map.describeExits(thisRoom);
        for ( var i in exits ) {
            if (exits[i] == nextRoom) {
                var exit = pos.findClosestByPath(nextRoom);
                return this.exitToEntrance(exit, exits[i], true);
            }
        }
        return undefined;
    },

    exitToEntrance: function (exitPos, newRoom, oneStep)
    {
        var step = oneStep ? 1 : 0;
        if (exitPos && newRoom) {
          //  console.log( "exitPos",JSON.stringify(exitPos),"newroom", newRoom );
            var newX = exitPos.x, newY=exitPos.y;
            if (exitPos.x == 0) newX = 49 - step;
            if (exitPos.x == 49) newX = 0 + step;
            if (exitPos.y == 0) newY = 49 - step;
            if (exitPos.y == 49) newY = 0 + step;
          //  console.log(newX,newY,newRoom);
            var entrance = new RoomPosition(newX, newY, newRoom);
            return entrance;
        }
    },

    centroid: function( posArray ) {
        if (posArray && posArray.length > 0) {
            var x = 0;
            var y = 0;
            for ( var i = 0 ; i < posArray.length ; i++ ) {
                x += posArray[i].x;
                y += posArray[i].y;
            }
            return new RoomPosition(
                Math.round(x),
                Math.round(y),
                posArray[0].roomName
            );
        } else {
            return undefined;
        }
    }

};

module.exports = roomBase;































