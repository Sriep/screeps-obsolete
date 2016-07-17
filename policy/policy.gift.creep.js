/**
 * Created by Piers on 02/07/2016.
 */
/**
 * Created by Piers on 29/06/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for Policy of building
 * roads in neutral territy
 * @author Piers Shepperson
 */
//Base object
var policy = require("policy");
var PoolRequisition = require("pool.requisition");
var TaskMoveRoom = require("task.move.room");
var TaskSwitchOwner = require("task.switch.owner");
/**
 * Abstract object for Policy of building
 * roads in neutral territy
 * @module policyGiftCreep
 */
var policyGiftCreep = {

    initialisePolicy: function (newPolicy) {
        var taskList = [];
        var moveToRoom = new TaskMoveRoom(newPolicy.room);
        var give = new TaskSwitchOwner(newPolicy.giveId, newPolicy.room);
        taskList.push(moveToRoom);
        taskList.push(give);
        var order = new PoolRequisition(
            newPolicy.id
            , newPolicy.body
            , taskList
            , undefined
            , undefined
        );
        //console.log("initialisePolicy policyForeignHarvest", JSON.stringify(order));
        PoolRequisition.prototype.placeRequisition(order);
        return true;
    },

    draftNewPolicyId: function(oldPolicy) {
        return null;
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
    }

}

module.exports = policyGiftCreep;







































