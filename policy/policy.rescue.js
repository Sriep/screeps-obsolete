/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when the room needs rescuing.
 * @author Piers Shepperson
 */
    //Base object
var   policy = require("policy");
var  policyConstruction = require("policy.construction");
var  policyDefence = require("policy.defence");
var policyFrameworks = require("policy.frameworks");
var   raceBase = require("race.base");
var   raceWorker = require("race.worker");
var   raceInfantry = require("race.infantry");
var   roleBase = require("role.base");
var policyBuildspawn = require("policy.buildspawn");
var roomController = require("room.controller");
var   stats = require("stats");

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
        if (!policyBuildspawn.spawnFound(oldPolicy))      {
             return policyFrameworks.createBuildspawn(room.name);
        }
        if (policyDefence.beingAttaced(room)) {
            return policyFrameworks.createDefendPolicy(room.name);
        }
        if (this.needsRescue(room)) {
            return oldPolicy;
        }
        if (policyConstruction.startConstruction(room)) {
            return policyFrameworks.createConstructionPolicy(room.name);
        }
        return  policyFrameworks.createPeacePolicy(room.name);
    },

    initilisePolicy: function (newPolicy) {
        return true;
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
        room.memory.policyId = currentPolicy.id;
       // stats.updateStats(room);
        var creeps = room.find(FIND_MY_CREEPS);
        var workerSize = 0;
        if (creeps.length = 0) {
            console.log("Rescue build first worker size", raceWorker.maxSizeFromEnergy(room));
            workerSize = raceWorker.maxSizeFromEnergy(room);
        } else {
            var workparts = 0;
            for (var i in creeps) {
                var workparts = workparts + creeps[i].getActiveBodyparts(WORK);
            }
            workerSize = Math.min(raceWorker.maxSizeRoom(room), workparts+1);
        }

        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns == undefined || spawns == []) {return;}
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
        case policyFrameworks.Type.RESCUE:
            break;
        case policyFrameworks.Type.CONSTRUCTION:
            break;
        case policyFrameworks.Type.DEFEND:
            break;
        case policyFrameworks.Type.PEACE:
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
        //console.log("In neeeeds rescue work parts",workParts,"compare number"
        //    , raceWorker.maxSize(room.controller.level));
        //maxWorkerSize = Math.floor(roomController.maxProduction[room.roomcontroller.level]
        //                /raceWorkers.BLOCKSIZE);
        //console.log("Needs rescue, max worker size", raceWorker.MaxWorkerControllerLevel[room.controller.level])


        return workParts < Math.min(raceWorker.MaxWorkerControllerLevel[room.controller.level]
                                        ,policy.LINKING_WORKER_SIZE);
    },





}

module.exports = policyRescue;





























