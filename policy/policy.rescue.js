/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room needs rescuing.
 * @author Piers Shepperson
 */
"use strict";
var   policy = require("policy");
var  policyConstruction = require("policy.construction");
var  policyDefence = require("policy.defence");
var policyFrameworks = require("policy.frameworks");
var   raceBase = require("race.base");
var   raceWorker = require("race.worker");
var   roleBase = require("role.base");
var policyBuildspawn = require("policy.buildspawn");
var roomController = require("room.controller");
var   stats = require("stats");
var roomOwned = require("room.owned");
var npcInvaderBattle = require("npc.invader.battle");
var gc = require("gc");

/**
 * Abstract object for handling  decisions when the room needs rescuing.
 * Typically this will be when a rooms creeps has fallen to zero or one. 
 * This might occur due to an invasion or software bug.
 * @module policyRescue
 */
var policyRescue = {
    /**
     * Determins what the new polciy of or the comming tick should be. 
     * Last tick production was too low in comparison with contoller level.
     * Has a new worker improved production enough. 
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(oldPolicy) {
        var room =  Game.rooms[oldPolicy.room];

        //if (readyForMAny2OneLinker)

        if (!policyBuildspawn.spawnFound(oldPolicy))      {
             return policyFrameworks.createBuildspawn(room.name);
        }
        if (policyDefence.beingAttaced(room)) {
            return policyFrameworks.createDefendPolicy(room.name);
        }
        if (this.needsRescue(room)) {
            return oldPolicy;
        }
        return  policyFrameworks.createPeacePolicy(room.name                
            , room.memory.links.info);
    },

    initialisePolicy: function (newPolicy) {
        this.convertCreepsToHarvester(newPolicy);
        return true;
    },

    convertCreepsToHarvester: function(newPolicy) {
        var creeps = _.filter(Game.creeps, function (creep) {
            return (creep.memory.policyId == newPolicy.id
                    && raceWorker.isWorker(creep.body));
        });
        for (var i = 0 ; i < creeps.length ; i ++ )
        {
            roleBase.switchRoles(creeps[i], gc.ROLE_HARVESTER);
        }
    },



    /**
     * Preforms resuce measures. Try to build a creep with size one more than
     * total work parts available or bigger one if energy available.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(currentPolicy) {
        var room = Game.rooms[currentPolicy.room];
        console.log("ENACT POLICY RESCUE",room);
        room.memory.policyId = currentPolicy.id;
       // stats.updateStats(room);
        //var creeps = room.find(FIND_MY_CREEPS);
        console.log(room,"about to callnpcInvaderBattle.defendRoom in rescue");
        npcInvaderBattle.defendRoom(room);
        console.log(room,"AftercallnpcInvaderBattle.defendRoom in rescue")
        var creeps = _.filter(Game.creeps,
            function (creep) {return creep.memory.policyId == currentPolicy.id;});

        var workerSize = 0;
        console.log(room,"ccccccccreeplength",creeps.length  );
        if (creeps.length == 0) {
            console.log("RRRRRRRRRRRRescue build first worker size", raceWorker.maxSizeFromEnergy(room));
            workerSize = raceWorker.maxSizeFromEnergy(room);
        } else {
            var workparts = 0;

            if (1 < roomOwned.countSiteAccess(room, FIND_SOURCES) ){
                for (var i in creeps) {
                    console.log(room, "acces sites >1",roomOwned.countSiteAccess(room, FIND_SOURCES));
                    workparts = workparts + creeps[i].getActiveBodyparts(WORK);
                }
                workerSize = Math.min(raceWorker.maxSizeRoom(room), workparts+1);              
            } else {
                console.log(room,"worker size", raceWorker.spawnWorkerSize(room,creeps.length*1000)
                ,"energy num creeps x1000",creeps.length*1000)
               workerSize = raceWorker.spawnWorkerSize(room,creeps.length*1000)
            }
        }

        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns == undefined || spawns == []) {return;}

        var name = raceBase.spawn(raceWorker, currentPolicy, spawns[0], workerSize);
        if (_.isString(name)) {
            roleBase.switchRoles(Game.creeps[name], gc.ROLE_HARVESTER);
        }
        console.log(room,"result of spawn",name,"workerSize",workerSize);


/*
        var nHavesters = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders = 0;
        console.log("enact rescue roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers);
        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);*/
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
        switch(oldPolicy.type) {
            case policyFrameworks.Type.RESCUE:
                break;
            case policyFrameworks.Type.CONSTRUCTION:
                break;
            case policyFrameworks.Type.DEFEND:
                break;
            case policyFrameworks.Type.POLICY_MANY2ONE_LINKERS:
                //policy.breakUpLinks(oldPolicy);
                break;
            default:
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
    },

     /**
     * Determins if the production capacity has fallen to such an unexpectedly
     * low level that rescue measures are necessary. 
     * The number of WORK parts are used
     * to indicate production capacity and contoller level to measure what 
     * it should be. 
     * @function needsRescue
     * @param   {Object} room  The room that might need rescuing.
     * @returns {Bool} True inidcates we should use a rescue policy. 
     */
    needsRescue: function(room) {
        if (room === undefined) {
            return false;
        }
        var creeps = room.find(FIND_MY_CREEPS);
        var youngCreeps = [];
        for (var i = 0 ; i < creeps.length ; i++ ) {
            if (creeps[i].ticksToLive > gc.OLD_CREEP_LIFETOLIVE) {
                youngCreeps.push(creeps[i]);
            }
        }
        //var workParts = raceBase.countBodyParts(creeps, WORK);
        var numLinks;
        if (undefined === room.memory.links || undefined === room.memory.links.info) {
            numLinks = 0;
        } else {
            numLinks = room.memory.links.info.length;
        }

        var needsRescue = youngCreeps.length < 2 && youngCreeps.length < numLinks + 1;
        console.log(room,"Needs rescue",needsRescue,",yongCreeps lenght",  youngCreeps.length, "numLinks", numLinks);
        return needsRescue;
    }
};

module.exports = policyRescue;





























