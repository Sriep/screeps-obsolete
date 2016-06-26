/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related to rooms in which we are fighting a war.
 * @author Piers Shepperson
 */
 
 //var roomOwned = require("room.owned");

/**
 * Abstract object containing data and functions
 * related to rooms in which we are fighting a war.
 * @module raceWorker
 */
var roomWar = { 
    TOWER_DM_REDUCTION: 0.5,
    PESIMISIM_FACTOR: 0.8,

    enterWareState: function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length == 0 || this.existingForcesEnough(room)) {
            return false;
        } else {
            return true;
        }
    },

    existingForcesEnough: function(room)
    {
        enemyHits = this.creepHits(room, FIND_HOSTILE_CREEPS);
        enemyHits = enemyHits - this.yourTowerDm(room);
        if (enemyHits <= 0) {
            return ture;
        }

        enemyKillsIn = this.creepHits(room, FIND_MY_CREEPS) 
                    / this.creepDmps(room, FIND_HOSTILE_CREEPS);
        youKillIn = enemyHits / this.creepDmps(room, FIND_MY_CREEPS);
        return (youKillIn * this.PESIMISIM_FACTOR < enemyKillsIn);
    },


    creepDmps: function(room, findFilter) {
        console.log("room is",room," fine is ", findFilter);
        var creeps = room.find(findFilter);
        var attack = 0;
        var ranged = 0;
        for ( var i in creeps) {
            attacks = attacks + creeps[i].getActiveBodyparts(ATTACK);
            ranged = ranged + creeps[i].getActiveBodyparts(RANGED_ATTACK);
        }
        return 20 * attack + 10 * ranged;
    },
        
    creepHits: function(room, findFilter) {
        var creeps = room.find(findFilter)
        var hits = 0;
        for ( var i in creeps) {
            hits = hits + creeps[i].hits;
        }
        return hits;
    },

    yourTowerDm: function(room) {
        var towers = room.find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}); 
        var towersDm;
        for ( var i in towers)
        {
            var dmTick = TOWER_POWER_ATTACK / this.TOWER_DM_REDUCTION;
            var totalDm = dmTick * towers[i].energy / TOWER_ENERGY_COST
            
            towersDm = towersDm + totalDm;
        } 
        return towersDm; 
    },

};

module.exports = roomWar;    