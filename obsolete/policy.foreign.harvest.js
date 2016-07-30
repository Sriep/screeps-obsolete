/**
 * @fileOverview Screeps module. Abstract object for handling the foreign 
 * harvest policy. 
 * @author Piers Shepperson
 */
var _ = require('lodash');
var raceWorker = require("race.worker");
var PoolRequisition = require("pool.requisition");
var gc = require("gc");
var roleNeutralHarvester = require("role.neutral.harvester");

/**
 * Abstract object to support the policy of minig a source in an unoccumpied 
 * room
 * @module policyForeignHarvest
 */
var policyForeignHarvest = {

    initialisePolicy: function (newPolicy) {
        var body =  raceWorker.body(newPolicy.workerSize, true);
       // var taskList = roleNeutralBuilder.getTaskList(
        var taskList = roleNeutralHarvester.getTaskList(
            undefined,
            newPolicy.harvestRoom,
            newPolicy.storageRoom,
            newPolicy.sourceId,
            newPolicy.offLoadId);
       // console.log("policyNeutralBuilder newPolicy.buildRoomy", newPolicy.buildRoom, newPolicy.sourceRoom)

        var order = new PoolRequisition(
            newPolicy.id
            , body
            , taskList
            , undefined
            , undefined
        );
       // console.log("initialisePolicy policyForeignHarvest", JSON.stringify(order));
        PoolRequisition.prototype.placeRequisition(order);
    },
    
    draftNewPolicyId: function(currentPolicy)
    {
       return null;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
    }

}

module.exports = policyForeignHarvest;