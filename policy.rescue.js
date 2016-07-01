/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room needs rescuing.
 * @author Piers Shepperson
 */
    //Base object
    policy = require("policy");

    policyConstruction = require("policy.construction");
    policyDefence = require("policy.defence");
    //policyPeace= require("policy.peace");
    raceBase = require("race.base");
    raceWorker = require("race.worker");
    raceInfantry = require("race.infantry");
    roleBase = require("role.base");


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
        //var policyDefend = require("policy.defend");
        if (policyDefend.beingAttaced(room)) {
            return policy.createDefendPolicy(room.name);
        }
        if (this.needsRescue(room)) {
            return oldPolicy;
        }
        if (policyConstruction.startConstruction(room)) {
            return policy.createConstructionPolicy(room.name);
        }
        return  policy.createPeacePolicy(room.name);
    },


    /**
     * Preforms resuce measures. Try to build a creep with size one more than
     * total work parts available or bigger one if energy available.
     * @function enactPolicy
     * @param   {Object} room  The room that might need rescuing.
     * @returns {none} 
     */
    enactPolicy: function(currentPolicy) {
        currentPolicy.room = "W26S21";
        var room = Game.rooms[currentPolicy.room];
        room.memory.policyId = currentPolicy.id;
        
        var workerSize = 0;
        if (creeps.length = 0) {
            workerSize = raceWorker.maxSizeFromEnergy(room);
        } else {
            var workParts = 0;
            for (var i in creeps) {
                workparts = workparts + creeps[i].getActiveBodyparts(WORK);
            }
            workerSize = Math.min(raceWorker.maxSizeRoom(room), workParts+1);
        }

        var spawns = room.find(FIND_MY_SPAWNS);
        raceBase.spawn(raceWorker, currentPolicy, spawns[0], workerSize);

        var nHavesters = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;
        var nUpgraders = 0;
        console.log("enact rescue roles havesters", nHavesters, "builders", nBuilders,
            "upgraders", nUpgraders, "and repairers", nRepairers);
        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
        switch(oldPolicy.type) {
        case policy.Type.RESCUE:
            break;
        case policy.Type.CONSTRUCTION:
            break;
        case policy.Type.DEFEND:
            break;
        case policy.Type.PEACE:   
            policy.breakUpLinks(Game.rooms[oldPolicy.room]);
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
        creeps = room.find(FIND_MY_CREEPS);
        workParts = raceBase.countBodyParts(creeps, WORK);
        return workParts < raceWorker.maxSize(room.controller.level) - 2;
    },





}

module.exports = policyRescue;