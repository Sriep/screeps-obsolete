/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for handling statistics. 
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for handling statistics. 
 * @module raceBase
 */
var stats = {

    NOTIFYPERIOD: 120,
    on: true,

    startTick: function(room) {
        if (Memory.stats === undefined) {
            Memory.stats= [];
        }
        var now = new Date();
        Memory.stats.push({tick: Game.time, time: now});
    },

    build: function (creep,target) {
        var rtv = creep.build(target);
        if (this.on && OK == rtv) {
            index = Memory.stats.length -1;
            if (undefined == Memory.stats[index].buildEnergy) {
                Memory.stats[index].build = BUILD_POWER;
            } else {
                Memory.stats[index].build
                         = Memory.stats[index].build + BUILD_POWER;
            }
        } 
        return rtv;
    },

    harvest: function(creep, target) {
        var rtv = creep.harvest(target);
        if (this.on && OK == rtv) {
            index = Memory.stats.length -1;
            if (undefined == Memory.stats[index].harvest) {
                Memory.stats[index].harvest = HARVEST_POWER;
            } else {
                Memory.stats[index].harvest
                         = Memory.stats[index].harvest + HARVEST_POWER;
            }
        } 
        return rtv;
    },

    upgradeController: function(creep, target) {
        var rtv = creep.upgradeController(target);
        if (this.on && OK == rtv) {
            index = Memory.stats.length -1;
            if (undefined == Memory.stats[index].upgradeController) {
                Memory.stats[index].upgradeController = UPGRADE_CONTROLLER_POWER;
            } else {
                Memory.stats[index].upgradeController
                         = Memory.stats[index].upgradeController + UPGRADE_CONTROLLER_POWER;
            }
        } 
        return rtv;
    },


    repair: function(creep, target) {
        var rtv = creep.repair(target);
        if (this.on && OK == rtv) {
            index = Memory.stats.length -1;
            if (undefined == Memory.stats[index].repair) {
                Memory.stats[index].repair = REPAIR_POWER;
            } else {
                Memory.stats[index].repair
                         = Memory.stats[index].repair + REPAIR_POWER;
            }
        } 
        return rtv;
    },

    endTick: function(room) {
        index = Memory.stats.length -1;
        Memory.stats[index].cpuUsed = Game.cpu.getUsed();
        Memory.stats[index].gclProgress = Game.gcl.progress;
        Memory.stats[index].controllerProgress = room.controller.progress;
        Memory.stats[index].energyAvailable = room.energyAvailable;

        var sources = room.find(FIND_SOURCES)
        if (sources.length >= 1) {
            Memory.stats[index].source1 = sources[0].energy ;
            if (sources.length >= 2) {
                Memory.stats[index].source2 = sources[1].energy ;
            }  
        }
        this.notify(room);
    },

    notify: function(room) {
        var message = JSON.stringify(Memory.stats);
        console.log("Memory.stats length ", message.length); 
        if (message.length > 1000) {
            console.log("PROBLEM STATS TOO LONG!!!!!!!!!!!!!!!!!!!!!!!!!!!! "
            , message.length);
        }
        Game.notify(message, this.NOTIFYPERIOD);    
        Memory.stats=[];    
    } 

}

module.exports = stats;