/**
 * Created by Piers on 18/07/2016.
 */
/**
 * Created by Piers on 12/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. policyAttackStructures.
 * @author Piers Shepperson
 */
"use strict";
var gc = require("gc");
var raceSwordsman = require("race.swordsman");
var PoolRequisition = require("pool.requisition");
var TaskMovePos = require("task.move.pos");
var TaskAttackId = require("task.attack.id");
var TaskAttackTarget = require("task.attack.target");
var TaskMoveFind = require("task.move.find");
var TaskWait = require("task.wait");
var TaskMoveRoom = require("task.move.room");
var Battle = require("combat.quick.estimate");
var raceBase = require("race.base");
var battle = require("combat.quick.estimate");
var TaskHeal = require("task.heal");
var TaskMoveAttackPos = require("task.move.attack.pos");
/**
 * Abstract Policy
 * @module policyAttackStructures
 */
var policyHarvestKeeperSector = {
    MARSHALLING_RANGE: 2,
    MARSHALLING_COLOUR_1: COLOR_RED,
    MARSHALLING_COLOUR_2: COLOR_ORANGE,
    KEEPER_OWNER: "Source Keeper",
    State: {
        MovingOut: "moving.out",
        Marshalling: "marshalling",
        AttackKeeper: "attack.keeper",
        SuppressLair: "suppress.lair",
        AfterAction: "after.action"
    },

    flag: undefined,

    keeper: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
            TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
            ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
            RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,
            ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,
            RANGED_ATTACK,ATTACK,RANGED_ATTACK,ATTACK,RANGED_ATTACK],

    initialisePolicy: function (newPolicy) {
        newPolicy.marshallingPreActionPos.createFlag(newPolicy.id ,
            gc.FLAG_HARVEST_KEEPER_COLOUR, gc.FLAG_KEEPERS_LAIR_COLOUR);
        this.flag = Game.flags[newPolicy.id];
        Memory.policies[newPolicy.id].state = this.State.Marshalling;
        return true;
    },

    marshalCreeps: function (policy) {
        var creeps = _.filter(Game.creeps, function(creep) { return creep.memory.policyId == policy.id});
        for ( var i = 0 ; i < creeps.length ; i++ ) {
            var moveToFlag = TaskMovePos (flag.pos, this.MARSHALLING_RANGE);
            creeps[i].memory.taskList = [];
            creeps[i].memory.taskList.push(moveToFlag);
        }
    },

    draftNewPolicyId: function(oldPolicy) {
        //return null;
        return oldPolicy;
    },

    enactPolicy: function(currentPolicy) {
       // console.log(currentPolicy.id,"keeper harvest flag", JSON.stringify(this.flag));
       // console.log(currentPolicy.id,"keeper harvest flag", JSON.stringify(currentPolicy));
        this.marshalCreeps(currentPolicy);
        switch(Memory.policies[currentPolicy.id].state){
            case this.State.Marshalling:
                this.marshalling(currentPolicy);
                break;
            case this.State.MovingOut:
                this.movingOut(currentPolicy);
                break;
            case this.State.AttackKeeper:
                this.attackKeeper(currentPolicy);
                break;
            case this.State.SuppressLair:
                this.suppressLair(currentPolicy);
                break;
            case this.State.AfterAction:
                this.afterAction(currentPolicy);
                break;
            default:
        }
    },

    marshalling: function (policy) {
        if (this.readyAttackKeeper(policy)) {
            this.flag.setPosition(policy.marshallingActivePos);
            this.toMovingOut(policy);
        }
    },

   toMovingOut: function(policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
            && creep.pos.room == this.flag.pos.roomName;
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            creeps[i].memory.tasks.taskList = this.moveKeeperRoomTaskList(flag.pos, creeps[i]);
        }
        Memory.policies[policy.id].state = this.State.MovingOut;
        this.movingOut(policy);
    },

    toSuppressLair: function(policy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.pos.room == this.flag.pos.roomName;
        });
        for (var i = 0 ; i < creeps.length ; i++ ) {
            creeps[i].memory.tasks.taskList = this.moveKeeperRoomTaskList(flag.pos, creeps[i]);
        }
        Memory.policies[policy.id].state = this.State.MovingOut;
        this.suppressLair(policy);
    },


    movingOut: function (policy) {
        if (this.readyAttackKeeper(policy)) {
            var keeper = this.flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: function(creep) {
                    return creep.owner == this.KEEPER_OWNER;
                }
            });
            if (keeper) {
                this.flag.setPosition(keeper.pos);
                this.attackKeeper(keeper);
                Memory.policies[policy.id].state = this.State.AttackKeeper;
                Memory.policies[policy.id].targetKeeper = keeper.id;
                this.attackKeeper(policy);
            } else {
                var lairs = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_KEEPER_LAIR }
                });
                lairs.sort(function (a, b) {
                    return b.ticksToSpawn - a.ticksToSpawn;
                });
                this.flag.setPosition(lairs[0].pos);
                Memory.policies[policy.id].state = this.State.SuppressLair;
                Memory.policies[policy.id].targetLair = lairs[0].id;
                this.toSuppressLair(policy);
            }
            return true;
        }
        return false;
    },

    attackKeeper: function (policy) {
        var keeperId = Memory.policies[policy.id].targetKeeper;
        if (Game.getObjectById(keeperId)) {
            var myAttackCreeps = _.filter(Game.creeps, function (creep) {
                return creep.memory.policyId == policy.id
                    && creep.getActiveBodyparts(ATTACK) > 0
                    && creep.room == this.flag.room;
            });
            var attackTaskList = this.attackKeeperTaskList(policy);
            for (var i = 0 ; i < myAttackCreeps.length ; i++ ) {
                myAttackCreeps[i].memory.tasks.taskList = attackTaskList;
            }
        } else {
            Memory.policies[policy.id].safatetate = this.State.afterAction;
            this.afterAction(policy);
        }
    },

    attackKeeperTaskList: function(policy) {
        var keeperId = Memory.policies[policy.id].targetKeeper;
        var taskList = [];
        var attackKeeper = TaskAttackId(keeperId);
        var moveToKeeper = new TaskMoveFind(gc.FIND_ID,gc.RANGE_ATTACK, keeperId);
        taskList.push(attackKeeper);
        taskList.push(moveToKeeper);
        taskList.push(attackKeeper);
        return taskList;
    },

    afterAction: function (policy) {
        var keepers = this.flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(creep) {
                return creep.owner == this.KEEPER_OWNER;
            }
        });
        if (keepers.length > 0  && this.readyAttackKeeper(policy)) {
            this.toMovingOut(policy);
        }
        if (!this.restAndHeal(policy)) {
            this.toMovingOut(policy);
        }
    },

    restAndHeal: function(policy) {
        var healers = _.filter(Game.creeps, function (creep) {
                        return creep.memory.policyId == policy.id
                            && creep.getActiveBodyparts(HEAL) > 0
                            && creep.room == this.flag.room;
        });

        if (healers.length > 0) {
            var injured = _.filter(Game.creeps, function (creep) {
                return creep.memory.policyId == policy.id
                    && creep.hits < creep.hitsMax
                    && creep.room == this.flag.room;
            });
            if (injured.length > 0) {
                this.assignTreatment(healers, injured);
                return true;
            }
        }
        return false;
    },

    assignTreatment: function (healers, injured) {
        var healeraskList = [];
        var heal = new TaskHeal();
        var moveToPatient = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findPatient","policy.harvest,keeper.sector");
        healeraskList.push(heal);
        healeraskList.push(moveToPatient);
        healeraskList.push(heal);
        for ( var i = 0 ; i < healers.length ; i++ ) {
            healers[i].memory.tasks.taskList = healeraskList;
        }

        var patientsTaskList = {};
        var moveToHealer = new TaskMoveFind(gc.FIND_FUNCTION ,gc.RANGE_HARVEST
            , "findHealer","policy.harvest,keeper.sector");
        patientsTaskList.push(moveToHealer);
        for ( var i = 0 ; i < injured.length ; i++ ) {
            injured[i].memory.tasks.taskList = patientsTaskList;
        }
    },

    findHealer: function (creep) {
        return creep.pos.findClosestByRange(FIND_MY_CREEPS, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.getActiveBodyparts(HEAL) > 0
        });
    },

    findPatient: function (creep) {
        return creep.pos.findClosestByRange(FIND_MY_CREEPS, function (creep) {
            return creep.memory.policyId == policy.id
                && creep.hits < creep.hitsMax
        });
    },

    suppressLair: function (lair) {
        var keepers = this.flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(creep) {
                return creep.owner == this.KEEPER_OWNER;
            }
        });
        if (keepers > 0) {
            this.toMovingOut(policy);
        } else {

        }

    },

    moveKeeperRoomTaskList: function (pos, creep) {
        var taskList = [];
        var moveToPosition = new TaskMoveAttackPos(pos, this.MARSHALLING_RANGE);
        if (creep.getActiveBodyparts(HEAL) > 0) {
            var heal = new TaskHeal();
            taskList.push(heal);
            taskList.push(moveToPosition);
            taskList.push(heal);

        } else if (creep.getActiveBodyparts(ATTACK) > 0) {
            taskList.push(moveToPosition)
        } else {
            var defensiveToPosition = new TaskMovePos(pos, this.MARSHALLING_RANGE);
            taskList.push(defensiveToPosition)
        }
        creep.memory.tasks.taskList = taskList;
    },

    readyAttackKeeper: function (policy) {
        console.log("In readyAttackKeeper0", policy.id);
        var myAttackCreeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == policy.id
                    && creep.getActiveBodyparts(ATTACK) > 0
                    && creep.pos.inRangeTo(this.flag,this.MARSHALLING_RANGE);
        });
        if (0 > myAttackCreeps.length) {
            var battleOutcome = battle.quickCombat(this.keeper, myAttackCreeps);
            return  battleOutcome.length == myAttackCreeps.length;
        } else {
            return false;
        }
    }

};

module.exports = policyHarvestKeeperSector;


















































