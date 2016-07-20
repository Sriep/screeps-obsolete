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

    //Recurring orders
    ROUTE_NEUTRAL_HARVEST: "neutral.harvest",
    ROUTE_PATROL_ROOM: "patrol.room",
    ROUTE_REMOTE_ACTIONS: "remote.actions",
    ROUTE_GIFT_CREEP: "gift.creep",
    
    //misc
    LINKING_WORKER_SIZE: 5,
    REPAIRER_WORKER_SIZE: 5,
    REPAIRER_THRESHOLD: 2,
    BLOCKSIZE_COST_WORKER: 200,
    EMERGENCY_DOWNGRADING_THRESHOLD: 5000,
    MANY2ONE_REQUIRED_LIFE: 5000,
    STORAGE_STOCKPILE: 30000,
    OLD_CREEP_LIFETOLIVE: 200,
    LINKER_AGE_THRESHOLD: 10,
    
    //Flexi storage mode
   // FLEXIMODE_STORAGE: 0,
    FLEXIMODE_CONTAINER: 1,
    FLEXIMODE_HARVEST: 2

};

module.exports = gc;










































