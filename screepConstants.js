/**
 * Created by Piers on 30/06/2016.
 */

    OK = 0;
        ERR_NOT_OWNER = -1;
    ERR_NO_PATH = -2;
    ERR_NAME_EXISTS = -3;
    ERR_BUSY = -4;
    ERR_NOT_FOUND = -5;
    ERR_NOT_ENOUGH_ENERGY = -6;
    ERR_NOT_ENOUGH_RESOURCES = -6;
    ERR_INVALID_TARGET = -7;
    ERR_FULL = -8;
    ERR_NOT_IN_RANGE = -9;
    ERR_INVALID_ARGS = -10;
    ERR_TIRED = -11;
    ERR_NO_BODYPART = -12;
    ERR_NOT_ENOUGH_EXTENSIONS = -6;
    ERR_RCL_NOT_ENOUGH = -14;
    ERR_GCL_NOT_ENOUGH = -15;

    FIND_EXIT_TOP = 1;
    FIND_EXIT_RIGHT = 3;
    FIND_EXIT_BOTTOM = 5;
    FIND_EXIT_LEFT = 7;
    FIND_EXIT = 10;
    FIND_CREEPS = 101;
    FIND_MY_CREEPS = 102;
    FIND_HOSTILE_CREEPS = 103;
    FIND_SOURCES_ACTIVE = 104;
    FIND_SOURCES = 105;
    FIND_DROPPED_ENERGY = 106;
    FIND_DROPPED_RESOURCES = 106;
    FIND_STRUCTURES = 107;
    FIND_MY_STRUCTURES = 108;
    FIND_HOSTILE_STRUCTURES = 109;
    FIND_FLAGS = 110;
    FIND_CONSTRUCTION_SITES = 111;
    FIND_MY_SPAWNS = 112;
    FIND_HOSTILE_SPAWNS = 113;
    FIND_MY_CONSTRUCTION_SITES = 114;
    FIND_HOSTILE_CONSTRUCTION_SITES = 115;
    FIND_MINERALS = 116;
    FIND_NUKES = 117;

    TOP = 1;
    TOP_RIGHT = 2;
    RIGHT = 3;
    BOTTOM_RIGHT = 4;
    BOTTOM = 5;
    BOTTOM_LEFT = 6;
    LEFT = 7;
    TOP_LEFT = 8;

    COLOR_RED = 1;
    COLOR_PURPLE = 2;
    COLOR_BLUE = 3;
    COLOR_CYAN = 4;
    COLOR_GREEN = 5;
    COLOR_YELLOW = 6;
    COLOR_ORANGE = 7;
    COLOR_BROWN = 8;
    COLOR_GREY = 9;
    COLOR_WHITE = 10;

    LOOK_CREEPS = "creep";
    LOOK_ENERGY = "energy";
    LOOK_RESOURCES = "resource";
    LOOK_SOURCES = "source";
    LOOK_MINERALS = "mineral";
    LOOK_STRUCTURES = "structure";
    LOOK_FLAGS = "flag";
    LOOK_CONSTRUCTION_SITES = "constructionSite";
    LOOK_NUKES = "nuke";
    LOOK_TERRAIN = "terrain";

OBSTACLE_OBJECT_TYPES = ["spawn";
"creep";
"wall";
"source";
"constructedWall";
"extension";
"link";
"storage";
"tower";
"observer";
"powerSpawn";
"powerBank";
"lab";
"terminal";
"nuker"
]
MOVE = "move";
    WORK = "work";
    CARRY = "carry";
    ATTACK = "attack";
    RANGED_ATTACK = "ranged_attack";
    TOUGH = "tough";
    HEAL = "heal";
    CLAIM = "claim";

    BODYPART_COST = {
    "move" = 50;
        "work" = 100;
        "attack" = 80;
        "carry" = 50;
        "heal" = 250;
        "ranged_attack" = 150;
        "tough" = 10;
        "claim" = 600;
}
CREEP_LIFE_TIME = 1500;
        CREEP_CLAIM_LIFE_TIME = 500;
    CREEP_CORPSE_RATE = 0.2;

    CARRY_CAPACITY = 50;
    HARVEST_POWER = 2;
    HARVEST_MINERAL_POWER = 1;
    REPAIR_POWER = 100;
    DISMANTLE_POWER = 50;
    BUILD_POWER = 5;
    ATTACK_POWER = 30;
    UPGRADE_CONTROLLER_POWER = 1;
    RANGED_ATTACK_POWER = 10;
    HEAL_POWER = 12;
    RANGED_HEAL_POWER = 4;
    REPAIR_COST = 0.01;
    DISMANTLE_COST = 0.005;

    RAMPART_DECAY_AMOUNT = 300;
    RAMPART_DECAY_TIME = 100;
    RAMPART_HITS = 1;
RAMPART_HITS_MAX = {2 = 300000;
3 = 1000000;
4 = 3000000;
5 = 10000000;
6 = 30000000;
7 = 100000000;
8 = 300000000
}
ENERGY_REGEN_TIME = 300;
        ENERGY_DECAY = 1000;

    SPAWN_HITS = 5000;
    SPAWN_ENERGY_START = 300;
    SPAWN_ENERGY_CAPACITY = 300;
    CREEP_SPAWN_TIME = 3;

    SOURCE_ENERGY_CAPACITY = 3000;
    SOURCE_ENERGY_NEUTRAL_CAPACITY = 1500;
    SOURCE_ENERGY_KEEPER_CAPACITY = 4500;

    WALL_HITS = 1;
    WALL_HITS_MAX = 300000000;

    EXTENSION_HITS = 1000;
EXTENSION_ENERGY_CAPACITY = {0 = 50;
1 = 50;
2 = 50;
3 = 50;
4 = 50;
5 = 50;
6 = 50;
7 = 100;
8 = 200
}
ROAD_HITS = 5000;
        ROAD_WEAROUT = 1;
    ROAD_DECAY_AMOUNT = 100;
    ROAD_DECAY_TIME = 1000;

    LINK_HITS = 1000;
    LINK_HITS_MAX = 1000;
    LINK_CAPACITY = 800;
    LINK_COOLDOWN = 1;
    LINK_LOSS_RATIO = 0.03;

    STORAGE_CAPACITY = 1000000;
    STORAGE_HITS = 10000;

    STRUCTURE_SPAWN = "spawn";
    STRUCTURE_EXTENSION = "extension";
    STRUCTURE_ROAD = "road";
    STRUCTURE_WALL = "constructedWall";
    STRUCTURE_RAMPART = "rampart";
    STRUCTURE_KEEPER_LAIR = "keeperLair";
    STRUCTURE_PORTAL = "portal";
    STRUCTURE_CONTROLLER = "controller";
    STRUCTURE_LINK = "link";
    STRUCTURE_STORAGE = "storage";
    STRUCTURE_TOWER = "tower";
    STRUCTURE_OBSERVER = "observer";
    STRUCTURE_POWER_BANK = "powerBank";
    STRUCTURE_POWER_SPAWN = "powerSpawn";
    STRUCTURE_EXTRACTOR = "extractor";
    STRUCTURE_LAB = "lab";
    STRUCTURE_TERMINAL = "terminal";
    STRUCTURE_CONTAINER = "container";
    STRUCTURE_NUKER = "nuker";

    CONSTRUCTION_COST = {
    "spawn" = 15000;
        "extension" = 3000;
        "road" = 300;
        "constructedWall" = 1;
        "rampart" = 1;
        "link" = 5000;
        "storage" = 30000;
        "tower" = 5000;
        "observer" = 8000;
        "powerSpawn" = 100000;
        "extractor" = 5000;
        "lab" = 50000;
        "terminal" = 100000;
        "container" = 5000;
        "nuker" = 100000;
}
CONSTRUCTION_COST_ROAD_SWAMP_RATIO = 5;

CONTROLLER_LEVELS = {1 = 200;
2 = 45000;
3 = 135000;
4 = 405000;
5 = 1215000;
6 = 3645000;
7 = 10935000
}
CONTROLLER_STRUCTURES = {
        "spawn" = {0 = 0;
1 = 1;
2 = 1;
3 = 1;
4 = 1;
5 = 1;
6 = 1;
7 = 2;
8 = 3
}
"extension" = {0 = 0;
1 = 0;
2 = 5;
3 = 10;
4 = 20;
5 = 30;
6 = 40;
7 = 50;
8 = 60
}
"link" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 2;
6 = 3;
7 = 4;
8 = 6
}
"road" = {0 = 2500;
1 = 2500;
2 = 2500;
3 = 2500;
4 = 2500;
5 = 2500;
6 = 2500;
7 = 2500;
8 = 2500
}
"constructedWall" = {1 = 0;
2 = 2500;
3 = 2500;
4 = 2500;
5 = 2500;
6 = 2500;
7 = 2500;
8 = 2500
}
"rampart" = {1 = 0;
2 = 2500;
3 = 2500;
4 = 2500;
5 = 2500;
6 = 2500;
7 = 2500;
8 = 2500
}
"storage" = {1 = 0;
2 = 0;
3 = 0;
4 = 1;
5 = 1;
6 = 1;
7 = 1;
8 = 1
}
"tower" = {1 = 0;
2 = 0;
3 = 1;
4 = 1;
5 = 2;
6 = 2;
7 = 3;
8 = 6
}
"observer" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 0;
6 = 0;
7 = 0;
8 = 1
}
"powerSpawn" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 0;
6 = 0;
7 = 0;
8 = 1
}
"extractor" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 0;
6 = 1;
7 = 1;
8 = 1
}
"terminal" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 0;
6 = 1;
7 = 1;
8 = 1
}
"lab" = {1 = 0;
2 = 0;
3 = 0;
4 = 0;
5 = 0;
6 = 3;
7 = 6;
8 = 10
}
"container" = {0 = 5;
1 = 5;
2 = 5;
3 = 5;
4 = 5;
5 = 5;
6 = 5;
7 = 5;
8 = 5
}
"nuker" = {1 = 0; 2 = 0; 3 = 0; 4 = 0; 5 = 0; 6 = 0; 7 = 0; 8 = 1}
}
CONTROLLER_DOWNGRADE = {1 = 20000;
2 = 50000;
3 = 50000;
4 = 50000;
5 = 50000;
6 = 50000;
7 = 50000;
8 = 50000
}
CONTROLLER_CLAIM_DOWNGRADE = 0.2;