/**
 * Created by Piers on 29/06/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for Policy of building
 * roads in neutral territy
 * @author Piers Shepperson
 */
"use strict";
//Base object
var _ = require('lodash');
var raceWorker = require("race.worker");
var PoolRequisition = require("pool.requisition");
var gc = require("gc");
var roleNeutralBuilder = require("role.neutral.builder");
/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyRescue
 */
var policyNeutralBuilder = {

    initialisePolicy: function (newPolicy) {
        var body =  raceWorker.body(newPolicy.workerSize*gc.BLOCKSIZE_COST_WORKER);
        var taskList = roleNeutralBuilder.getTaskList(newPolicy.workRoom, newPolicy.sourceRoom);
        console.log("policyNeutralBuilder newPolicy.buildRoomy", newPolicy.buildRoom, newPolicy.sourceRoom)

        var order = new PoolRequisition(newPolicy.id
                                                , body
                                                , taskList
                                                , undefined
                                                , undefined
        );
        //console.log("initialisePolicy myrequisitio", JSON.stringify(order));
        PoolRequisition.prototype.placeRequisition(order);
    },

    draftNewPolicyId: function(oldPolicy) {
        // No sites to build left in rooom
        var room = Game.rooms[oldPolicy.workRoom]

        if (undefined !== room) {
            var sites = room.find(FIND_MY_CONSTRUCTION_SITES);
            if (undefined !== sites && sites.length == 0) {
                this.cleanUp(oldPolicy);
                return null;
            }
        }
        /*
        // Still waiting for worker

        if (0 == PoolRequisition.prototype.getMyRequisition(oldPolicy.id).length) {
            console.log("draftNewPolicyId oldpoicyid", oldPolicy.id,oldPolicy)
            this.cleanUp(oldPolicy);
            return null;
        }

        // Worker died
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == oldPolicy.id
        });
        if (0 == creeps.length) {
            this.cleanUp(oldPolicy);
            return null;
        }
*/
        return oldPolicy;

    },

    cleanUp: function(oldPolicy)
    {
        var creeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.policyId == oldPolicy.id
        });
        for ( var i = 0 ;  i < creeps.length ; i++ ) {
            PoolRequisition.prototype.returnToPool(creeps[i].name);
        }
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
    }

}

module.exports = policyNeutralBuilder;







































