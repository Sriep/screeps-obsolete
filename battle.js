/**
 * @fileOverview Screeps module. Abstract base object for battles.
 * @author Piers Shepperson
 */
"use strict";
var raceBase = require("race.base");
/**
 * Abstract base object for battles.
 * @module policy
 */
var battle = {

    quickCombat: function ( enemyCreeps, friendlyCreeps ) {
        var enemies = this.convert(enemyCreeps);
        var friends = this.convert(friendlyCreeps);
        console.log("quickCombat convets",enemies,friends);
        var turn = 1, range = 3;
        while (enemies.length > 0 && friends.length > 0) {
            var damagedEnemies, damagedFriends;
            damagedEnemies = this.applyRangedDamage(enemies, friends, range);
            damagedFriends = this.applyRangedDamage(friends, enemies, range);
            if (range <= 1) {
                damagedEnemies = this.applyDamage(enemies, friends);
                damagedFriends = this.applyDamage(friends, enemies);
            }
            enemies = damagedEnemies;
            friends = damagedFriends;
            turn++;
            if (range > 1) range--;
        }
    },

    convert: function (creeps) {
        var formattedCreeps = [];
        console.log("convert", JSON.stringify(creeps));
        for ( var i = 0 ; i < creeps ; i++ ) {
            console.log(creeps,"convert",i)
            var parts = creeps[i].hits;
            var attackParts = raceBase.occurrencesInBody(creeps[i].body, ATTACK);
            var rangedParts = raceBase.occurrencesInBody(creeps[i].body, RANGED_ATTACK);
            formattedCreeps.push( {  parts : parts, attackParts : attackParts, rangedParts : rangedParts} );
        }
        formattedCreeps.sort( function (a,b) { return a.parts - b.parts; });
        return formattedCreeps;
    },

    applyRangedDamage: function(attackers, defenders, range) {
        if (3 == range) {
            for (var i = 0 ; i < attackers.length ; i++ ){
                this.damageWeakest(defenders, attackers[i].rangedParts*RANGED_ATTACK_POWER);
            }
        } else if (2 == range) {
            for (var i = 0 ; i < attackers.length ; i++ ){
                this.damageWeakest(defenders, attackers[i].rangedParts*RANGED_ATTACK_POWER);
            }
        } else if (1 <= range) {
            for (var i = 0 ; i < attackers.length ; i++ ){
                this.damageAll(defenders, attackers[i].rangedParts*RANGED_ATTACK_POWER);
            }
        }
    },

    damageWeakest: function(defenders, damage) {
        for ( var i = 0 ; i < defenders.length ; i++ ) {
            if (damage < defenders[i].hits) {
                if (0 == i) {
                    this.damageCreep(defenders[0], damage);
                } else {
                    this.damageCreep(defenders[i-1], damage);
                }
                return;
            }
        }
        this.damageCreep(defenders[defenders.length - 1], damage);
    },

    damageAll: function (defenders, damage) {
        for ( var i = 0 ; i < defenders.length ; i++ ) {
            this.damageCreep(defenders[i], damage);
        }
    },

    damageCreep: function (creepInfo, damage) {
        creepInfo.hits = creepInfo.hits = damage;
        var partsLeft = Math.floor(creepInfo.hits/100);
        var damagedParts = creepInfo.attackParts + creepInfo.rangedParts - partsLeft;
        if (damagedParts > 0){
            creepInfo.attackParts = creepInfo.attackParts - damagedParts/2 - (damagedParts % 2);
            creepInfo.rangedParts = creepInfo.rangedParts - damagedParts/2;
        }
        return creepInfo;
    },


    applyDamage: function (attackers, defenders) {
        for (var i = 0 ; i < attackers.length ; i++ ){
            this.damageWeakest(defenders, attackers[i].attackParts*ATTACK_POWER);
        }
    }

};

module.exports = battle;































