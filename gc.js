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
    ROLE_WALL_BUILDER: "wall.builder",
    ROLE_SUPPRESS_KEEPERS: "suppress.keepers",
    ROLE_DISMANTLE_ROOM: "dismantle.room",
    ROLE_ATTACK_ROOM: "attack.room",
    ROLE_MOVE_RESOURCE: "move.resource",
    
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
    TASK_LINKER_DUMP_LINK_DUMP: "linker.dump.link.dump",
    TASK_LINKER_LINK_DUMP: "linker.link.dump",
    TASK_LINKER_LINK_LINK: "linker.link.link",
    TASK_LINKER_REPAIR_DUMP: "linker.repair.dump",
    TASK_SWITCH_ROLE: "switch.role",
    TASK_FLEXI_LOADUP: "flexi.loadup",
    TASK_SUPPRESS_KEEPERS: "suppress.keepers",
    TASK_FOLLOW: "follow",
    TASK_DISMANTLE: "dismantle",


//Offload switch task's states
    SWITCH_STATE_PRODUCTION:  "production",
    SWITCH_STATE_CONSTRUCTION:  "construction",
    SWITCH_STATE_FILLUP:  "fillup",
    SWITCH_STATE_UPGRADE:  "upgrade",
    SWITCH_STATE_REPAIR: "repair",
    SWITCH_STATE_MINERAL_TRANSPORT: "mineral",
    
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
    RANGE_HEAL: 3,
    RANGE_REACTION: 2,
    
    //task results
    RESULT_FINISHED: "finished",
    RESULT_UNFINISHED: "unfinished",
    RESULT_ROLLBACK: "rollback",
    RESULT_RESET: "reset",

    // Room policies
    POLICY_PEACE: "peace",
    POLICY_DEFENCE: "defence",
    POLICY_RESCUE: "rescue",
    POLICY_NEUTRAL_ROOM: "neutral.room",
    POLICY_BUILD_SPAWN: "build.spawn",

    // Custom policies
    POLICY_TEMPLATE: "template",
    POLICY_COORDINATE_ATTACK: "coordinate.attack",

    // Obsolete policies
    POLICY_POLICY_THE_POOL: "the.pool",
    POLICY_CONSTRUCTION: "construction",
    POLICY_FOREIGN_HARVEST: "foreign.harvest",
    POLICY_FOREIGN_ROAD: "neutral.road",
    POLICY_CLAIM: "claim",
    POLICY_GIFT_CREEP: "gift.creep",
    POLICY_NEUTRAL_BUILDER: "neutral.builder",
    POLICY_MANY2ONE_LINKERS: "many2one.linker",
    POLICY_ATTACK_STRUCTURES: "attack.structures",
    POLICY_PATROL_ROOM: "patrol.room",
    POLICY_HARVEST_NEUTRAL_ROOM: "harvest.neutral.room",
    POLICY_REMOTE_ACTIONS: "remote.actions",
    POLICY_KEEPER_SECTOR_MARSHAL: "keeper.sector.marshal",
    POLICY_KEEPER_SECTOR_ATTACK: "keeper.sector.attack",
    POLICY_KEEPER_SECTOR_AFTER_ACTION: "keeper.sector.after.action",
    POLICY_KEEPER_SECTOR_SUPPRESS: "keeper.sector.suppress",

    // flags
    FLAG_SOURCE: "source",
    FLAG_MINERAL: "mineral",
    FLAG_CONTROLLER: STRUCTURE_CONTROLLER,
    FLAG_KEEPERS_LAIR: "keeperlair",
    FLAG_LINK: STRUCTURE_LINK,
    FLAG_PORTAL: STRUCTURE_PORTAL,
    FLAG_LAB: STRUCTURE_LAB,
    FLAG_TERMINAL: STRUCTURE_TERMINAL,
    FLAG_TOWER: STRUCTURE_TOWER,


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
    ROUTE_WALL_BUILDER: "wall.builder",
    ROUTE_SUPPRESS_KEEPERS: "suppress.keepers",
    ROUTE_MINER: "miner",
    ROUTE_DISMANTLE_ROOM: "dismantle.room",
    ROUTE_ATTACK_ROOM: "attack.room",
    ROUTE_MOVE_RESOURCE: "move.resource",

    BUILDING_LINK: "building." + STRUCTURE_LINK,
    BUILDING_LAB: "lab." + STRUCTURE_LAB,

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
    PORTER_SLOW_MAX_SIZE: 32,
    PORTER_FAST_MAX_SIZE: 25,
    SWORDSMAN_NEUTRAL_PATROL_SIZE: 5,

    // How much free spawn time to leave
    SPAWN_RESERVE_MULTIPLIER: 0.90,
    SPAWN_RESERVE_TIME: 500,

    REPAIRER_THRESHOLD: 5,
    SOURCES_REVERSE_CONTROLLER: 1,
    LAB_REFILL_ENERGY_THRESHOLD: 0.5,
    LAB_REFILL_MINERAL_THRESHOLD: 1500,
    TERMINAL_ENERGY_REFILL_THRESHOLD: 1500,
    MAX_DEPTH_ROOM_SEARCH: 5,
    KEEP_FREE_STORAGE_SPACE: 80000,
    BLOCKSIZE_COST_WORKER: 200,
    EMERGENCY_DOWNGRADING_THRESHOLD: 1500,
    MANY2ONE_REQUIRED_LIFE: 5000,
    LOAD_FROM_CONTAINER_RATIO: 0.4,
    STORAGE_STOCKPILE: 15000,
    OLD_CREEP_LIFETOLIVE: 200,
    LINKER_AGE_THRESHOLD: 10,
    DEFAULT_ROUTE_PRIORITY: 10,
    REVERSE_CLAIM_SAFETYNET: 100,
    MIDDLE_AGE_CREEP_LIFE_TO_LIVE: 750,
    THE_POOL: 0,
    MAX_TASK_ACTIONS: 5,
    PORTER_PRIORITY_THRESHOLD: 750,//this.MIDDLE_AGE_CREEP_LIFE_TO_LIVE,

    MIN_ENERGY_CAPACITY_LINKERS: 400,
    MIN_ENERGY_CAPACITY_FOREIGN_LINKERS: 800,
    MIN_ENERGY_CAPACITY_RESERVE_CONTROLLER: 1300,
    MIN_ENERGY_CAPACITY_KEEPER_ROOM: 5600,

    MAX_SIM_BATTLE_LENGTH: 20,
    MAX_SIM_DEFENCE_LENGTH: 40,
    RESPAWN_MULTIPLYER_NEUTRAL: 0.9,
    RESPAWN_MULTIPLYER_KEEPER: 0.7,

    TIME_TRANSFER_LOAD: 1,
    TIME_BUILD_LOAD: 10,
    TIME_UPGRADE_LOAD: 50,


    ROOM_UPDATE_RATE: 307,
    FLAG_UPDATE_RATE: 133,
    LINKER_RESET_RATE: 503,
    CHECK_FOR_ORPHANED_BUILDS_RATE: 191,
    ATTACH_FLAGGED_ROUTES_RATE: 171,
    SEND_SCOUT_FREQUENCY_GEN: 3,

    //Build priorities
    PRIORITY_EMERGENCY_HOME_PORTER: 20,
    PRIORITY_LINKER: 40,
    PRIORITY_NEUTRAL_PORTER: 110,
    PRIORITY_HOME_PORTER: 60,
    PRIORITY_NEUTRAL_LINKER: 100,
    PRIORITY_REVERSE_CONTROLLER: 110,
    PRIORITY_REPAIRER: 160,
    PRIORITY_WALL_BUILDER: 160,
    PRIORITY_ROOM_PATROL: 110,
    PRIORITY_SCOUT: 90,
    PRIORITY_KEEPER_ATTACK: 110,
    PRIORITY_KEEPER_HARVEST: 140,
    PRIORITY_KEEPER_PORTER: 140,
    PRIORITY_MINER: 180,

    //flag colours
    FLAG_PERMANENT_COLOUR: COLOR_BLUE,
    FLAG_SOURCE_COLOUR: COLOR_YELLOW,
    FLAG_CONTROLLER_COLOUR: COLOR_PURPLE,
    FLAG_MINERAL_COLOUR: COLOR_GREY,
    FLAG_KEEPERS_LAIR_COLOUR: COLOR_ORANGE,
    FLAG_STRUCTURE_COLOUR: COLOR_BROWN,
    FLAG_LINK_COLOUR: COLOR_CYAN,
    FLAG_HARVEST_KEEPER_COLOUR: COLOR_RED,
    FLAG_PORTAL_COLOUR: COLOR_BLUE,
    FLAG_TERMINAL_COLOUR: COLOR_PURPLE,
    FLAG_LAB_COLOUR: COLOR_GREY,

    TARGET_ID: 1,
    TARGET_FIND_TYPE: 2,
    TARGET_STRUCTURE: 3,

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

    ONE_MOVE: [
        {x:1, y:1},
        {x:1, y:0},
        {x:1, y:-1},
        {x:0, y:1},
        {x:0, y:0},
        {x:0, y:-1},
        {x:-1, y:1},
        {x:-1, y:0},
        {x:-1, y:-1},
    ],

    OPPOSITE_DIRECTION: {
        1 : [BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT],
        2 : [LEFT, BOTTOM_LEFT, BOTTOM],
        3 : [TOP_LEFT, LEFT, BOTTOM_LEFT],
        4 : [LEFT, TOP_LEFT, TOP],
        5 : [TOP_LEFT, TOP, TOP_RIGHT],
        6 : [TOP, TOP_RIGHT, RIGHT],
        7 : [TOP_RIGHT, RIGHT, BOTTOM_RIGHT],
        8 : [RIGHT, BOTTOM_RIGHT, BOTTOM]
    },

    SIDEWAYS_DIRECTION: {
        1 : [LEFT, BOTTOM],
        2 : [TOP_LEFT, BOTTOM_RIGHT],
        3 : [TOP, BOTTOM],
        4 : [BOTTOM_LEFT, TOP_RIGHT],
        5 : [LEFT, RIGHT],
        6 : [TOP_LEFT, BOTTOM_RIGHT],
        7 : [TOP, BOTTOM],
        8 : [TOP_RIGHT, BOTTOM_LEFT]
    },

    PLAIN: "plain",
    SWAMP: "swamp",
    WALL: "wall",

    DELTA_DIRECTION: {
        1 : {x:0, y:-1},
        2 : {x:1, y:-1},
        3 : {x:1, y:0 },
        4 : {x:1, y:1 },
        5 : {x:0, y:1 },
        6 : {x:-1, y:1 },
        7 : {x:-1, y:0 },
        8 : {x:-1, y:-1 }
    },

    KEEPER_OWNER: "Source Keeper",
    KEEPER_CYCLE_MAX_WAIT: 30,
    KEEPER_HARVEST_MIN_CONTROLLER_LEVEL: 6,
    KEEPER_SWORDSMAN_PARTS_NEEDED_GEN: 50,
    KEEPER_ATTACK_SPAWN_RATE_BUFFER: 150,
    KEEPER_HARVESTER_HEALER_PARTS: 1,
    KEEPER_PORTER_HEALER_PARTS: 0,
    KEEPER_MARSHALING_RANGE: 2,
    KEEPER_SUPPRESSOR_HEAL_RANGE: 4,
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
        {"type":"attack","hits":100},{"type":"ranged_attack","hits":100}],

    SOURCE_KEEPER_BODY_ARRAY: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
        TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
        ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
        RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,
        ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
        RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK]



};

module.exports = gc;










































