"use strict";

var gc = {
    //Creep Actions
    HARVEST: "harvest",
    BUILD : "build",
    DROP : "drop",
    REPAIR : "repair",
    TRANSFER : "transfer",
    UPGRADE_CONTROLLER : "upgradeController",
    PICKUP: "pickup",
    DISMANTLE: "dismantle",
    CLAIM: "claim",
    REVERSE: "reverse",
    ATTACK_CONTROLLER: "attack.controller",
    ATTACK: "attack",
    RANGED_ATTACK: "ranged.attack",
    RANGED_HEAL: "ranged.heal",
    HEAL: "heal",
    MASS_ATTACK: "mass.attack",
    MOVE: "move",
    SUICIDE: "suicide",
    WITHDRAW: "withdraw",
    
    //Races
    RACE_WORKER:  "worker",
    RACE_SWORDSMAN: "swordsman",
    
    //Roles
    ROLE_HARVESTER: "harvester",
    ROLE_UPGRADER: "upgrader",
    ROLE_BUILDER: "builder",
    ROLE_REPAIRER: "repairer",
    ROLE_LINKER: "linker",
    ROLE_CLAIMER: "claimer",
    ROLE_NEUTRAL_BUILDER: "neutral.builder",
    ROLE_NEUTRAL_HARVESTER: "neutral.harvester",
    ROLE_UNASSIGNED: "unassigned",
    ROLE_SPAWN_BUILDER: "spawn.builder",
    ROLE_MINER: "miner",
    ROLE_TRAVELLER: "traveller",
    ROLE_ENERGY_PORTER: "energy.porter",
    ROLE_LINKER_SOURCE: "linker.source",
    ROLE_LINKER_MINER_STORAGE:  "linker.miner.storage",
    ROLE_STORAGE_REPAIRER: "storage.repairer",
    ROLE_FLEXI_STORAGE_PORTER: "flexi.storage.porter",
    ROLE_PATROL_ROOM: "patrol.room",
    ROLE_GIFT: "gift",
    ROLE_NEUTRAL_PORTER: "neutral.porter",
    ROLE_SCOUT: "scout",
    
    //Tasks
    TASK_MOVE_FIND: "move.find",
    TASK_OFFLOAD: "offload",
    TASK_HARVEST:  "harvest",//this.HARVEST,
    TASK_MOVE_POS: "move.pos",
    TASK_MOVE_XY: "move.xy",
    TASK_HARVEST_LINK: "harvest.linker",
    TASK_HARVEST_STORAGE_LINK_MINER: "storage,linker.miner",
    TASK_LOADUP: "loadup",
    TASK_MOVE_ROOM: "move.room",
    TASK_OFFLOAD_SWITCH: "offload.switch",
    TASK_ATTACK_ID: "attack.id",
    TASK_ATTACK_TARGET: "attack.target",
    TASK_WAIT: "wait",
    TASK_ACTION_TARGET: "action.target",
    TASK_SWITCH_OWNER: "switch.owner",
    TASK_MOVE_ATTACK_POS: "move.attack.pos",
    TASK_FIND_MOVE_LINKER_POS: "find.move.linker.pos",
    TASK_FLEXI_LINK: "flexi.link",
    TASK_HEAL: "heal",
    TASK_LINKER_BUILD: "linker.build",
    TASK_LINKER_DUMP: "linker.build",
    TASK_LINKER_DUMP_LINK_DUMP: "task.linker.dump.link.dump",
    TASK_LINKER_LINK_DUMP: "task.linker.link.dump",
    TASK_LINKER_LINK_LINK: "task.linker.link.link",
    TASK_LINKER_REPAIR_DUMP: "task.linker.repair.dump",


//Offload switch task's states
    SWITCH_STATE_PRODUCTION:  "production",
    SWITCH_STATE_CONSTRUCTION:  "construction",
    SWITCH_STATE_FILLUP:  "fillup",
    SWITCH_STATE_UPGRADE:  "upgrade",
    
    //TaskMoveFind.prototype.FindMethod
    FIND_ID : "find.id",
    FIND_ROOM_OBJECT : "find.object",
    FIND_STRUCTURE : "structure.id",
    FIND_FILTER : "filter.function",
    FIND_FUNCTION : "find.function",

    //Unit types
    CREEP: "creep",
    TOWER: "tower",
    SPAWN: "spawn",
    LINK: "link",
    
    //RANGES
    RANGE_HARVEST: 1,
    RANGE_BUILD: 3,
    RANGE_REPAIR: 3,
    RANGE_UPGRADE: 3,
    RANGE_TRANSFER: 1,
    RANGE_ATTACK: 1,
    RANGE_RANGED_ATTACK: 3,
    RANGE_HEAL: 1,
    
    //task results
    RESULT_FINISHED: "finished",
    RESULT_UNFINISHED: "unfinished",
    RESULT_FAILED: "failed",
    RESULT_ROLLBACK: "rollback",
    RESULT_RESET: "reset",

    //policies
    POLICY_POLICY_THE_POOL: "the.pool",
    POLICY_PEACE: "peace",
    POLICY_CONSTRUCTION: "construction",
    POLICY_DEFEND: "defence",
    POLICY_RESCUE: "rescue",
    POLICY_FOREIGN_HARVEST: "foreign.harvest",
    POLICY_FOREIGN_ROAD: "neutral.road",
    POLICY_NEUTRAL_ROOM: "neutral.room",
    POLICY_CLAIM: "claim",
    POLICY_BUILD_SPAWN: "buildspawn",
    POLICY_GIFT_CREEP: "gift.creep",
    POLICY_NEUTRAL_BUILDER: "neutral.builder",
    POLICY_MANY2ONE_LINKERS: "many2one.linker",
    POLICY_ATTACK_STRUCTURES: "attack.structures",
    POLICY_PATROL_ROOM: "patrol.room",
    POLICY_HARVEST_NEUTRAL_ROOM: "harvest.neutral.room",
    POLICY_REMOTE_ACTIONS: "remote.actions",
    POLICY_HARVEST_KEEPER_SECTOR: "harvest.keeper.sector",

    // flags
    FLAG_SOURCE: "source",
    FLAG_MINERAL: "mineral",
    FLAG_CONTROLLER: STRUCTURE_CONTROLLER,
    FLAG_KEEPERS_LAIR: "keeperlair",
    FLAG_LINK: STRUCTURE_LINK,

    //Recurring orders
    ROUTE_NEUTRAL_HARVEST: "neutral.harvest",
    ROUTE_PATROL_ROOM: "patrol.room",
    ROUTE_REMOTE_ACTIONS: "remote.actions",
    ROUTE_GIFT_CREEP: "gift.creep",
    ROUTE_LINKER: "linker",
    ROUTE_NEUTRAL_PORTER: "neutral.porter",
    ROUTE_FLEXI_STORAGE_PORTER: "flexi.storage.porter",
    ROUTE_REPAIRER: "repairer",
    ROUTE_SCOUT:    "scout",

    // Linker types
    LINKER_DUMP: "linker.dump",
    LINKER_REPAIR_DUMP: "linker.repair.dump",
    LINKER_LINK_LINK: "linker.link.link",
    LINKER_LINK_DUMP: "linker.link.dump",
    LINKER_DUMP_LINK_DUMP: "linker.dump.link.dump",
    LINKER_BUILD: "linker.build",
    
    //misc
    LINKING_WORKER_SIZE: 5,
    REPAIRER_WORKER_SIZE: 5,
    LINKING_MINER_SIZE: 5,
    WORKER_SLOW_MAX_SIZE: 16,
    WORKER_FAST_MAX_SIZE: 12,
    SWORDSMAN_NEUTRAL_PATROL_SIZE: 6,

    REPAIRER_THRESHOLD: 5,
    BLOCKSIZE_COST_WORKER: 200,
    EMERGENCY_DOWNGRADING_THRESHOLD: 1500,
    MANY2ONE_REQUIRED_LIFE: 5000,
    STORAGE_STOCKPILE: 30000,
    OLD_CREEP_LIFETOLIVE: 200,
    LINKER_AGE_THRESHOLD: 10,
    DEFAULT_ROUTE_PRIORITY: 10,
    REVERSE_CLAIM_SAFETYNET: 100,
    MIDDLE_AGE_CREEP_LIFE_TO_LIVE: 750,
    THE_POOL: 0,
    MAX_TASK_ACTIONS: 5,
    PORTER_PRIORITY_THRESHOLD: 750,//this.MIDDLE_AGE_CREEP_LIFE_TO_LIVE,
    MIN_ENERGY_CAPACITY_LINKERS: 400,
    MAX_QUICK_BATTLE_LENGTH: 20,

    ROOM_UPDATE_RATE: 2,
    FLAG_UPDATE_RATE: 53,
    LINKER_RESET_RATE: 27,
    CHECK_FOR_ORPHANED_BUILDS_RATE: 17,

    //Build priorities
    PRIORITY_EMERGENCY_HOME_PORTER: 2,
    PRIORITY_LINKER: 4,
    PRIORITY_NEUTRAL_PORTER: 12,
    PRIORITY_HOME_PORTER: 6,
    PRIORITY_NEUTRAL_LINKER: 10,
    PRIORITY_REVERSE_CONTROLLER: 14,
    PRIORITY_REPAIRER: 8,
    PRIORITY_ROOM_PATROL: 14,
    PRIORITY_SCOUT: 9,

    //flag colours
    FLAG_PERMANENT_COLOUR: COLOR_BLUE,
    FLAG_SOURCE_COLOUR: COLOR_YELLOW,
    FLAG_CONTROLLER_COLOUR: COLOR_PURPLE,
    FLAG_MINERAL_COLOUR: COLOR_GREY,
    FLAG_KEEPERS_LAIR_COLOUR: COLOR_ORANGE,
    FLAG_STRUCTURE_COLOUR: COLOR_BROWN,
    FLAG_LINK_COLOUR: COLOR_CYAN,
    FLAG_HARVEST_KEEPER_COLOUR: COLOR_RED,

    //AI
    AI_CONSTRUCTION: true,

    //Room permeates

    //Flexi storage mode
   // FLEXIMODE_STORAGE: 0,
    FLEXIMODE_CONTAINER: 1,
    FLEXIMODE_HARVEST: 2,

    // For find spots to put a linker. B
    // Between resource node and resource dump
    ADJACENCIES: {
        "2" : {
            "2"  : [ { dx : 1, dy : 1 } ],
            "1"  : [ { dx : 1, dy : 1 } , { dx : 1, dy : 0 } ],
            "0"  : [ { dx : 1, dy : 1 } , { dx : 1, dy : 0 }, { dx : 1 , dy : -1 } ],
            "-1" : [ { dx : 1, dy : 0 } , { dx : 1, dy : -1 } ],
            "-2" : [ { dx : 1, dy : -1 } ]
        },
        "1" : {
            "2"  : [ { dx : 1, dy : 1 } , { dx : 0 , dy : 1 } ],
            "1"  : [ { dx : 0, dy : 1 } , { dx : 1, dy : 1 }, { dx : 1, dy : 0 }, { dx : 0, dy : 0 } ],
            "0"  : [ { dx : 0, dy : 1 } , { dx : 1, dy : 1 }, { dx : 1, dy : 1 }, { dx : 1 , dy : -1 },
                { dx : 0 , dy : -1 }, { dx : 0, dy : 0 } ],
            "-1" : [ { dx : 1, dy : 0 } , { dx : 1, dy : -1 }, { dx : 0, dy : -1 }, { dx : 0, dy : 0 } ],
            "-2" : [ { dx : 1, dy : -1 }, { dx : 0 , dy : -1 } ]
        },
        "0" : {
            "2"  : [ { dx : -1, dy : 1 } , { dx : 0, dy : 1 }, { dx : 1 , dy : 1 } ],
            "1"  : [ { dx : -1, dy : 0 } , { dx : -1, dy : 1 } , { dx : 0, dy : 1 },
                { dx : 1 , dy : 1 }, { dx : 1 , dy : 0 }, { dx : 0, dy : 0 } ],
            "-1" : [ { dx : -1, dy : 0 } , { dx : -1, dy : -1 } , { dx : 0, dy : 1 }, { dx : 1 , dy : -1 },
                { dx : 1 , dy : 0 }, { dx : 0, dy : 0 } ],
            "-2" : [ { dx : -1, dy : -1 } , { dx : 0, dy : -1 }, { dx : 1 , dy : -1 } ]
        },
        "-1" : {
            "2"  : [ { dx : -1, dy : 1 } , { dx : 0 , dy : 1 } ],
            "1"  : [ { dx : -1, dy : 0 } , { dx : -1, dy : 1 }, { dx : 0, dy : 1 } , { dx : 0, dy : 0 }],
            "0"  : [ { dx : 0, dy : 1 } , { dx : -1, dy : 1 }, { dx : -1, dy : 0 }, { dx : -1 , dy : -1 },
                { dx : 0 , dy : -1 } , { dx : 0, dy : 0 }],
            "-1" : [ { dx : -1, dy : 0 }, { dx : -1, dy : -1 } , { dx : 0, dy : -1 }, { dx : 0, dy : 0 } ],
            "-2" : [ { dx : -1, dy : -1 }, { dx : 0 , dy : -1 } ]
        },
        "-2" : {
            "2"  : [ { dx : -1, dy : 1 } ],
            "1"  : [ { dx : -1, dy : 1 } , { dx : -1, dy : 0 } ],
            "0"  : [ { dx : -1, dy : 1 } , { dx : -1, dy : 0 }, { dx : -1 , dy : -1 } ],
            "-1" : [ { dx : -1, dy : 0 } , { dx : -1, dy : -1 } ],
            "-2" : [ { dx : -1, dy : -1 } ]
        }
    },

    TWO_MOVES: [
     {x :2, y:2},
     {x:2,y:1},
     {x :2, y:0},
     {x:2,y:-1},
     {x :2, y:-2},
     {x :1, y:2},
     {x:0,y:2},
     {x :-1, y:2},
     {x:-2,y:2},
     {x:-2,y:1},
     {x :-2, y:0},
     {x:-2,y:-1},
     {x :-2, y:-2},
     {x :1, y:-2},
     {x:0,y:-2},
     {x :-1, y:-2}
     ],

    SOURCE_KEEPER_BODY: [{"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"tough","hits":100},{"type":"tough","hits":100},
        {"type":"tough","hits":100},{"type":"move","hits":100},{"type":"move","hits":100},
        {"type":"move","hits":100},{"type":"move","hits":100},{"type":"move","hits":100},
        {"type":"move","hits":100},{"type":"move","hits":100},{"type":"move","hits":100},
        {"type":"move","hits":100},{"type":"move","hits":100},{"type":"move","hits":100},
        {"type":"move","hits":100},{"type":"move","hits":100},{"type":"attack","hits":100},
        {"type":"ranged_attack","hits":100},{"type":"attack","hits":100},
        {"type":"ranged_attack","hits":100},{"type":"attack","hits":100},{"type":"ranged_attack","hits":100},
        {"type":"attack","hits":100},{"type":"ranged_attack","hits":100},
        {"type":"attack","hits":100},{"type":"ranged_attack","hits":100},{"type":"attack","hits":100},
        {"type":"ranged_attack","hits":100},{"type":"attack","hits":100},
        {"type":"ranged_attack","hits":100},{"type":"attack","hits":100},{"type":"ranged_attack","hits":100},
        {"type":"attack","hits":100},{"type":"ranged_attack","hits":100},
        {"type":"attack","hits":100},{"type":"ranged_attack","hits":100}]



};

module.exports = gc;










































