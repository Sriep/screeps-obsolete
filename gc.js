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
    
    //Roles
    ROLE_HARVESTER: "harvester",
    ROLE_UPGRADER: "upgrader",
    ROLE_BUILDER: "builder",
    ROLE_REPAIRER: "repairer",
    ROLE_LINKER: "linker",
    ROLE_CLAIMER: "claimer",
    ROLE_NEUTRAL_BUILDER: "neutral.builder",
    ROLE_UNASSIGNED: "unassigned",
    ROLE_SPAWN_BUILDER: "spawn.builder",
    ROLE_MINER: "miner",
    ROLE_TRAVELLER: "traveller",
    ROLE_ENERGY_PORTER: "energy.porter",
    ROLE_LINKER_SOURCE: "linker.source",
    ROLE_LINKER_MINER_STORAGE:  "linker.miner.storage",
    ROLE_STORAGE_REPAIRER: "storage.repairer",
    
    //Tasks
    TASK_MOVE_FIND: "move.find",
    TASK_OFFLOAD: "offload",
    TASK_HARVEST:  "harvest",//this.HARVEST,
    TASK_MOVE_POS: "move.pos",
    TASK_MOVE_XY: "move.xy",
    TASK_HARVEST_LINK: "harvest.linker",
    TASK_HARVEST_STORAGE_LINK_MINER: "storage,linker.miner",
    TASK_LOADUP: "loadup",
    
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
    
    //task results
    RESULT_FINISHED: "finished",
    RESULT_UNFINISHED: "unfinished",
    RESULT_FAILED: "failed",
    RESULT_ROLLBACK: "rollback",
    
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
    POLICY_GIFT_WORKERS: "gift.workers",
    POLICY_MANY2ONE_LINKERS: "setup.linkers",
    
    //misc
    LINKING_WORKER_SIZE: 5,
    BLOCKSIZE_COST_WORKER: 200

};

module.exports = gc;










































