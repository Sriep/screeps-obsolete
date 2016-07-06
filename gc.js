

var gc = {
    //Creep Actions
    HARVEST: "harvest",
    BUILD : "build",
    DROP : "drop",
    REPAIR : "repair",
    TRANSFER : "transfer",
    UPGRADE : "upgrade",
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
    
    //Tasks
    TASK_MOVE_FIND: "move.find",
    TASK_OFFLOAD: "offload",
    TASK_HARVEST: this.HARVEST,
    TASK_MOVE_POS: "move.pos",
    TASK_MOVE_XY: "move.xy",
    
    //TaskMoveFind.prototype.FindMethod
    FIND_ID : "id",
    FIND_ROOM_OBJECT : "find.id",
    FIND_STRUCTURE : "structure.id",
    FIND_FILTER : "filter.function",
    FIND_FUNCTION : "find.function",

    //Unit types
    CREEP: "creep",
    TOWER: "tower",
    SPAWN: "spawn",
    LINK: "link",
    
    //RANGES
    RANGE_HAVEST: 1,
    RANGE_BUILD: 3,
    RANGE_REPAIR: 3,
    RANGE_UPGRADE: 3,
    RANGE_TRANSGER: 1

};

module.exports = gc;