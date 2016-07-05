/**
 * @fileOverview Screeps module. Abstract base object containing data and 
 * functions for handling statistics. 
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for handling statistics. 
 * @module raceBase
 */

function RoomStats (tick
                    ,tickRange
                    ,controllerProgress
                    ,energyAvailable
                    ,sourceEnergy
                    ,minerals
                    ,creeps
                    ,harvester 
                    ,upgrader 
                    ,builder 
                    ,repairer 
                    ,linker 
                    ,spawnBuilder 
                    ,otherRoles ) {
    this.tick = Game.time;
    this.controllerProgress = controllerProgress;
    this.energyAvailable = energyAvailable;
    this.sourceEnergy  = sourceEnergy;
    this.minerals = minerals;
    this.creeps = creeps;
    this.harvester = harvester;
    this.upgrader = upgrader;
    this.builder = builder;
    this.repairer = repairer;
    this.linker = linker;
    this.spawnBuilder = spawnBuilder;
    this.otherRoles = otherRoles;
}

function RoomStatsTick (room) {
    this.tick = Game.time;
    this.range = 1;
    this.controllerProgress = room.controller.progress;
    this.energyAvailable = room.energyAvailable;
    //console.log(room, "stats",stats,"json",JSON.stringify(stats));
    var sourceEnergy = 0;
    var sources = room.find(FIND_SOURCES)
    for (var i in sources) {
        sourceEnergy += sources[i].energy;
    }
    this.sourceEnergy = sourceEnergy;
    var countMinerals = 0;
    var minerals = room.find(FIND_MINERALS)
    for (var i in minerals) {
        countMinerals += minerals[i].energy;
    }
    stats.minerals = countMinerals;

    var creeps = room.find(FIND_CREEPS);
    this.creeps = creeps.length;
/*
    var harvester = 0;
    var upgrader = 0;
    var builder = 0;
    var repairer = 0;
    var linker = 0;
    var miner= 0;
    var spawnBuilder = 0;
    var otherRoles = 0;
*/
    var tharvester = 0;
    var tupgrader = 0;
    var tbuilder = 0;
    var trepairer = 0;
    var tlinker = 0;
    var tminer= 0;
    var tspawnBuilder = 0;
    var totherRoles = 0;

    for (var creep in creeps)
    {
        switch (creeps[creep].memory.role) {
            case"harvester":
                tharvester =  tharvester  + 1; break;
            case "upgrader":
                tupgrader++; break;
            case "builder":
                tbuilder = tbuilder  + 1; break;
            case "repairer":
                trepairer = trepairer  + 1; break;
            case "linker":
                tlinker = tlinker  + 1; break;
            case "miner":
                tminer = tminer  + 1; break;
            case "spawn.builder":
                tspawnBuilder = tspawnBuilder  + 1; break;
            default:
                totherRoles++;
        }
    }
/*
    this.harvester = 0;
    this.upgrader = 0;
    this.builder = 0;
    this.repairer = 0;
    this.linker = 0;
    this.spawnBuilder = 0;
    this.spawnBuilder = 0;
    this.otherRoles = 0;*/

    this.harvester = tharvester;
    this.upgrader = tupgrader;
    this.builder = tbuilder;
    this.repairer = trepairer;
    this.linker = tlinker;
    this.spawnBuilder = tspawnBuilder;
    this.otherRoles = totherRoles;
}

function SumStatsArray (room, name) {
  //  if (!statsArray || statsArray.length == 0)
  //      return;
 //   if (statsArray[0] == null) {return;}
  // console.log(room,name,"room.memory.stats[name]", JSON.stringify( room.memory.stats[name]));
 //   return;
    console.log(name,"test Sunstatearra", room.memory.stats["ticks"][0]);
    this.tick = room.memory.stats[name][0].tick;
  //var room = Game.rooms["W26S21"];

    this.range = room.memory.stats[name][0].range *  room.memory.stats[name][0].length;
    _controllerProgress = 0;
    _energyAvailable = 0;
    _sourceEnergy  = 0;
    _minerals = 0;
    _creeps = 0;
    _harvester = 0;
    _upgrader = 0;
    _builder = 0;
    _repairer = 0;
    _linker = 0;
    _miner= 0;
    _spawnBuilder = 0;
    _otherRoles = 0;

    for (var stats in room.memory.stats[name]) {
        _controllerProgress = _controllerProgress + room.memory.stats[name][stats].controllerProgress;
        _energyAvailable = _energyAvailable + room.memory.stats[name][stats].energyAvailable;
        _sourceEnergy  = _sourceEnergy + room.memory.stats[name][stats].sourceEnergy;
        _minerals = _minerals + room.memory.stats[name][stats].minerals;
        _creeps = _creeps + room.memory.stats[name][stats].creeps;
        _harvester = _harvester + room.memory.stats[name][stats].harvester;
        _upgrader = _upgrader + room.memory.stats[name][stats].upgrader;
        _builder = _builder + room.memory.stats[name][stats].builder;
        _repairer = _repairer + room.memory.stats[name][stats].repairer;
        _linker = _linker + room.memory.stats[name][stats].linker;
        _spawnBuilder = _spawnBuilder + room.memory.stats[name][stats].spawnBuilder;
        _otherRoles = _otherRoles + room.memory.stats[name][stats].otherRoles;
    }

    this.controllerProgress = _controllerProgress;
    this.energyAvailable = _energyAvailable;
    this.sourceEnergy  = _sourceEnergy;
    this.minerals = _minerals;
    this.creeps = _creeps;
    this.harvester = _harvester;
    this.upgrader = _upgrader;
    this.builder = _builder;
    this.repairer = _repairer;
    this.linker = _linker;
    this.spawnBuilder = _spawnBuilder;
    this.otherRoles = _otherRoles;
    console.log("tenTicksStats constuctor end of",this.upgrader );
}
/*
function SunStatsArray (statsArray) {
    if (!statsArray || statsArray.length == 0)
        return;
    if (statsArray[0] == null) {return;}
    this.tick = statsArray[0].tick;
    this.range = statsArray[0].range *  statsArray.length;
    this.controllerProgress = 0;
    this.energyAvailable = 0;
    this.sourceEnergy  = 0;
    this.minerals = 0;
    this.creeps = 0;

    for (var stats in statsArray) {
        this.controllerProgress = this.controllerProgress + statsArray[stats].controllerProgress;
        this.energyAvailable = this.energyAvailable + statsArray[stats].energyAvailable;
        this.sourceEnergy  = this.sourceEnergy + statsArray[stats].sourceEnergy;
        this.minerals = this.minerals + statsArray[stats].minerals;
        this.creeps = this.creeps + statsArray[stats].creeps;
        this.harvester = this.harvester + statsArray[stats].harvester;
        this.upgrader = this.upgrader + statsArray[stats].upgrader;
        this.builder = this.builder + statsArray[stats].builder;
        this.repairer = this.repairer + statsArray[stats].repairer;
        this.linker = this.linker + statsArray[stats].linker;
        this.spawnBuilder = this.spawnBuilder + statsArray[stats].spawnBuilder;
        this.otherRoles = this.otherRoles + statsArray[stats].otherRoles;
    }
}
*/

var stats = {

    NOTIFYPERIOD: 120,
    on: false,

    updateStats: function (room) {
        //room.memory.stats = { ticks : [], tenTicks : [], hundredTicks : [], generations : [] };
        if (undefined === room.memory.stats) {
            room.memory.stats = { ticks : [], tenTicks : [], hundredTicks : [], generations : [] };
        }
        var thisTicksStats = new RoomStatsTick(room);
        room.memory.stats["ticks"].push(thisTicksStats);
        if ( (room.memory.stats["ticks"]).length >= 5) {
            var tenTicksStats = new SumStatsArray(room, "ticks");
            room.memory.stats["tenTicks"].push(tenTicksStats);
            room.memory.stats["ticks"] = [];
        }
        if  (room.memory.stats["tenTicks"].length >= 10) {
            var hundredTicksStats = new SumStatsArray(room,"tenTicks");
            room.memory.stats["hundredTicks"].push(hundredTicksStats);
            room.memory.stats.tenTicks = [];
        }
        if  (room.memory.stats.hundredTicks.length >= 15) {
            var generationStats = new SumStatsArray(room,"hundredTicks");
            room.memory.stats["generations"].push(generationStats);
            room.memory.stats.hundredTicks = [];
        }
        if (room.memory.stats["generations"].length > 100)
            room.memory.stats["generations"].shift();
    },

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