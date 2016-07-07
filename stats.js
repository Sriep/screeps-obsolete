/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for handling statistics. 
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for handling statistics. 
 * @module raceBase
 */

var updateThisTicksStats = function (room) {
    //console.log(room,"strange error");
    var index = room.memory.stats["ticks"].length-1;
    room.memory.stats["ticks"][index].controllerProgress = room.controller.progress;
    room.memory.stats["ticks"][index].energyCapacityAvailable = room.energyCapacityAvailable;
    room.memory.stats["ticks"][index].energyAvailable = room.energyAvailable;

    var energyRemaining = 0;
    var sources = room.find(FIND_SOURCES);
    for (var source in sources) {
        energyRemaining = energyRemaining +  sources[source].energy;
    }
    room.memory.stats["ticks"][index].energyHarvested = room.memory.stats.sourceEnergyLastTick - energyRemaining;

    var countMinerals = 0;
    var minerals = room.find(FIND_MINERALS);
    for (var mineral in minerals) {
        countMinerals = countMinerals + minerals[mineral].mineralAmount;
    }
    room.memory.stats["ticks"][index].mineralsHarvested = room.memory.stats.mineralsLastTick - countMinerals;


    var creeps = room.find(FIND_CREEPS);
    room.memory.stats["ticks"][index].creeps = creeps.length;

    var _harvester = 0;
    var _upgrader = 0;
    var _builder = 0;
    var _repairer = 0;
    var _linker = 0;
    var _miner= 0;
    var _spawnBuilder = 0;
    var _otherRoles = 0;

    for (var creep in creeps)
    {
        if (creeps[creep].memory === undefined)
        //    console.log(creep, "stats",creeps[creep]);
        if (creeps[creep].memory !== undefined)
        {
            switch (creeps[creep].memory.role) {
                case"harvester":
                    _harvester++; break;
                case "upgrader":
                    _upgrader++; break;
                case "builder":
                    _builder++; break;
                case "repairer":
                    _repairer++; break;
                case "linker":
                    _linker++; break;
                case "miner":
                    _miner ++; break;
                case "spawn.builder":
                    _spawnBuilder = _spawnBuilder  + 1; break;
                default:
                    _otherRoles++;
            }
        }

    }

    room.memory.stats["ticks"][index].harvester = _harvester;
    room.memory.stats["ticks"][index].upgrader = _upgrader;
    room.memory.stats["ticks"][index].builder = _builder;
    room.memory.stats["ticks"][index].repairer = _repairer;
    room.memory.stats["ticks"][index].linker = _linker;
    room.memory.stats["ticks"][index].miner = _miner;
    room.memory.stats["ticks"][index].spawnBuilder = _spawnBuilder;
    room.memory.stats["ticks"][index].otherRoles = _otherRoles;
}


function RoomStatsTick (room) {
    this.tick = Game.time;
    this.time = new Date();
    this.range = 1;
    this.creepActions  = stats.EMPTY_CREEP_ACTIONS;
}

function SumStatsArray (room, name) {
    var lastEntry = room.memory.stats[name].length - 1;

    this.tick = room.memory.stats[name][0].tick;
    this.range = room.memory.stats[name][lastEntry].range *  room.memory.stats[name].length;

    this.controllerProgress = room.memory.stats[name][lastEntry].controllerProgress;
    this.energyCapacityAvailable  = room.memory.stats[name][lastEntry].energyCapacityAvailable;
    this.energyAvailable = room.memory.stats[name][lastEntry].energyCapacityAvailable;
    this.creepActions   = { harvest : 0, build : 0, upgrade : 0, repair : 0, extract : 0 };
    var _energyHarvested= 0;
    var _mineralsHarvested = 0;
    var _creeps = 0;
    var _harvester = 0;
    var _upgrader = 0;
    var _builder = 0;
    var _repairer = 0;
    var _linker = 0;
    var _miner= 0;
    var _spawnBuilder = 0;
    var _otherRoles = 0;
    
    var _harvest = 0;
    var _buld = 0;
    var _upgrade = 0;
    var _repair = 0;
    var _extract= 0;

    for (var stats in room.memory.stats[name]) {
        _energyHarvested  = _energyHarvested + room.memory.stats[name][stats].energyHarvested;
        _mineralsHarvested = _mineralsHarvested + room.memory.stats[name][stats].mineralsHarvested;
        _creeps = _creeps + room.memory.stats[name][stats].creeps;
        _harvester = _harvester + room.memory.stats[name][stats].harvester;
        _upgrader = _upgrader + room.memory.stats[name][stats].upgrader;
        _builder = _builder + room.memory.stats[name][stats].builder;
        _repairer = _repairer + room.memory.stats[name][stats].repairer;
        _linker = _linker + room.memory.stats[name][stats].linker;
        _miner = _miner + room.memory.stats[name][stats].miner;
        _spawnBuilder = _spawnBuilder + room.memory.stats[name][stats].spawnBuilder;
        _otherRoles = _otherRoles + room.memory.stats[name][stats].otherRoles;
        if (undefined !== room.memory.stats[name][stats].creepActions)
        {
            _harvest = _harvest + room.memory.stats[name][stats].creepActions["harvest"];
            _buld = _buld + room.memory.stats[name][stats].creepActions["build"];
            _upgrade = _upgrade + room.memory.stats[name][stats].creepActions["upgrade"];
            _repair = _repair + room.memory.stats[name][stats].creepActions["repair"];
            _extract= _extract + room.memory.stats[name][stats].creepActions["extract"];
        }
    }

    this.energyHarvested  = _energyHarvested;
    this.mineralsHarvested = _mineralsHarvested;
    this.creeps = _creeps;
    this.harvester = _harvester;
    this.upgrader = _upgrader;
    this.builder = _builder;
    this.repairer = _repairer;
    this.linker = _linker;
    this.spawnBuilder = _spawnBuilder;
    this.otherRoles = _otherRoles;

    this.creepActions["harvest"] = _harvest;
    this.creepActions["build"] = _buld;
    this.creepActions["upgrade"] = _upgrade;
    this.creepActions["repair"] = _repair;
    this.creepActions["extract"] = _extract;
}

var stats = {

    NOTIFYPERIOD: 120,
    on: true,
    Act: {
        HARVEST: "harvest",
        BUILD: "build",
        UPGRADE: "upgrade",
        REPAIR: "repair",
        EXTRACT: "extract",
        TRANSFER: "transfer"
    },
    EMPTY_STATS: { ticks : [], tenTicks : [], hundredTicks : [], generations : [] },
    EMPTY_CREEP_ACTIONS: { harvest : 0, build : 0, upgrade : 0, repair : 0, extract : 0 },

    initilise: function(room) {
        if (undefined === room) {
            return false;
        } else if (undefined === room.controller) {
            return false;
        } else if ( !room.controller.my ){
            return false;
        } else {
            room.memory.stats = this.EMPTY_STATS;
          //  console.log(room,"in intilise mem",JSON.stringify( room.memory.stats));
            this.rememberThisTicksResouceCounts(room);

            return true;
        }
    },

    initiliseTick: function() {
        for (var name in Game.rooms) {
            var room = Game.rooms[name];
           // room.memory.stats = undefined;
            if (undefined === room.memory.stats
                || {} === room.memory.stats
                || !room.memory.stats ) {
              //  console.log("in || {} === room.memory.stats ;")
                if (!this.initilise(room)) {
                    continue;
                }
            }
            var thisTicksStats = new RoomStatsTick(room);
         //   console.log(room,"stats mem",JSON.stringify( room.memory.stats));
            var index = room.memory.stats["ticks"].push(thisTicksStats) -1;
        }
    },

    rememberThisTicksResouceCounts: function(room) {
        var energyAvalibale = 0;
        var sources = room.find(FIND_SOURCES);
        for (var source in sources) {
            if (1 == sources[source].ticksToRegeneration) {
                energyAvalibale = energyAvalibale + sources[source].energyCapacity
            } else {
                energyAvalibale = energyAvalibale + sources[source].energy;
            }
        }
        room.memory.stats.sourceEnergyLastTick = energyAvalibale;

        var countMinerals = 0;
        var minerals = room.find(FIND_MINERALS)
        for (var mineral in minerals) {
            if (1 == minerals[mineral].ticksToRegeneration) {
                countMinerals = undefined;
            } else {
                countMinerals = countMinerals + minerals[mineral].mineralAmount;
            }
        }
        room.memory.stats.mineralsLastTick = countMinerals;
    },

    updateAggregateStats: function(room)  {
        if ((room.memory.stats["ticks"]).length >= 10) {
            var tenTicksStats = new SumStatsArray(room, "ticks");
            room.memory.stats["tenTicks"].push(tenTicksStats);
            room.memory.stats["ticks"] = [];
        }
        if (room.memory.stats["tenTicks"].length >= 10) {
            var hundredTicksStats = new SumStatsArray(room, "tenTicks");
            room.memory.stats["hundredTicks"].push(hundredTicksStats);
            room.memory.stats.tenTicks = [];
        }
        if (room.memory.stats.hundredTicks.length >= 15) {
            var generationStats = new SumStatsArray(room, "hundredTicks");
            room.memory.stats["generations"].push(generationStats);
            room.memory.stats.hundredTicks = [];
        }
        if (room.memory.stats["generations"].length > 40)
            room.memory.stats["generations"].shift();
    },

    upadateTick: function() {
        //return;
        for (var name in Game.rooms) {
            var room = Game.rooms[name];
            updateThisTicksStats(room);
            this.rememberThisTicksResouceCounts(room);
            this.updateAggregateStats(room);
        }
    },

    updateCreepAction: function (room, action, power) {
        var index = room.memory.stats["ticks"].length-1;
        room.memory.stats["ticks"][index].creepActions[action] =
            room.memory.stats["ticks"][index].creepActions[action] + power
    },

    build: function (creep,target) {
        var rtv = creep.build(target);
        if (OK = rtv && this.on)
            this.updateCreepAction(creep.room, this.Act.BUILD, BUILD_POWER);
        return rtv;
    },

    harvest: function(creep, target) {
        var rtv = creep.harvest(target);
        if (OK = rtv && this.on)
            this.updateCreepAction(creep.room, this.Act.HARVEST, HARVEST_POWER);;
        return rtv;
    },

    upgrade: function(creep, target) {
        "use strict";
        this.upgradeController(creep,target);
    },

    upgradeController: function(creep, target) {
        var rtv = creep.upgradeController(target);
        if (OK = rtv && this.on)
            this.updateCreepAction(creep.room, this.Act.UPGRADE, UPGRADE_CONTROLLER_POWER);;
        return rtv;
    },

    repair: function(creep, target) {
        var rtv = creep.repair(target);
        if (OK = rtv && this.on)
            this.updateCreepAction(creep.room, this.Act.REPAIR, 1);
        return rtv;
    },

    transfer: function(creep, target, resourceType, amount) {
        return creep.transfer(target, resourceType, amount);
    },

    deleteStats: function () {
        for (var name in Game.rooms) {
            var room = Game.rooms[name];
            room.memory.stats.ticks = undefined;
            room.memory.stats.tenTicks = undefined;
            room.memory.stats.hundredTicks = undefined;
            room.memory.stats.generations = undefined;
            room.memory.stats.sourceEnergyLastTick = undefined;
            room.memory.stats.mineralsLastTick = undefined;
            rooom.memory.test = undefined;
            room.memory.stats = undefined;
        }
    }
    // stats = require("stats"); stats.deleteStats();

};



module.exports = stats;








































