/**
 * Created by Piers on 08/08/2016.
 */
/**
 * Created by Piers on 19/07/2016.
 */
/**
 * @fileOverview Requisition object for using the pool
 * @author Piers Shepperson
 */
"use strict";
var routeBase = require("route.base");
var RouteRepairer = require("route.repairer");
var gc = require("gc");
var policy = require("policy");
var RouteWallBuilder = require("route.wall.builder");
/**
 * Requisition object for using the pool
 * @module economyRepair
 */

var economyRepair = {

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
            return routeBase.attachRoute(room.name, gc.ROUTE_REPAIRER,order,gc.PRIORITY_REPAIRER);
        }
    },

    attachWallBuilder: function (room) {
        var matches = routeBase.filterBuilds(room,"type", gc.ROUTE_WALL_BUILDER);
        var previous;
        if (matches && matches[0]) {
            previous = matches[0]
        }
        var order = new RouteWallBuilder(room.name);
        if ( previous && previous.size != order.size) {
            routeBase.removeRoute(room.name,previous.id);
            previous = undefined;
        }
        if (!previous) {
            return routeBase.attachRoute(room.name, gc.ROUTE_WALL_BUILDER,order,gc.PRIORITY_WALL_BUILDER);
        }
    },

    maintenanceGen: function (room) {
        var toMaintain = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_CONTAINER
                    || struc.structureType == STRUCTURE_RAMPART
                    || struc.structureType == STRUCTURE_ROAD;
            }
        });
        var energyNeeded = 0;
        for ( var i = 0 ; i < toMaintain.length ; i ++ ) {
            var decayPerGen;
            switch (toMaintain[i].structureType) {
                case STRUCTURE_CONTAINER:
                    decayPerGen = CREEP_LIFE_TIME * CONTAINER_DECAY / CONTAINER_DECAY_TIME;
                    break;
                case STRUCTURE_RAMPART:
                    decayPerGen = CREEP_LIFE_TIME * RAMPART_DECAY_AMOUNT / RAMPART_DECAY_TIME;
                    break;
                case STRUCTURE_ROAD:
                    decayPerGen = CREEP_LIFE_TIME * ROAD_DECAY_AMOUNT / ROAD_DECAY_TIME;
                    break;
                default:
            }
            energyNeeded += decayPerGen / REPAIR_POWER;
        }
        return energyNeeded;

    },

    numberMaintain: function (room) {
        var toMaintain = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return struc.structureType == STRUCTURE_CONTAINER
                    || struc.structureType == STRUCTURE_RAMPART
                    || struc.structureType == STRUCTURE_ROAD;
            }
        });
        return toMaintain.length;
    },

    energyBuildWalls: function (room) {
        var toBuild = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return (struc.structureType == STRUCTURE_WALL
                    && struc.hits < struc.hitsMax)
                    || ( struc.structureType == STRUCTURE_RAMPART
                    && struc.hits < struc.hitsMax);
            }
        });
        var energyNeeded = 0;
        for ( var i = 0 ; i < toBuild.length ; i ++ ) {
            energyNeeded += toBuild[i].hitsMax - toBuild[i].hits;
        }
        return energyNeeded;
    },

    countWallsToBuild: function (room) {
        var toBuild = room.find(FIND_STRUCTURES, {
            filter: function(struc) {
                return (struc.structureType == STRUCTURE_WALL
                    && struc.hits < struc.hitsMax)
                    || ( struc.structureType == STRUCTURE_RAMPART
                    && struc.hits < struc.hitsMax);
            }
        });
        return toBuild.length;
    }

};



module.exports = economyRepair;


























