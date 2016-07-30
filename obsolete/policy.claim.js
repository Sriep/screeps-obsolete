/**
 * @fileOverview Screeps module. Abstract object for handling the foreign 
 * harvest policy. 
 * @author Piers Shepperson
 */
var policy = require("policy");
var policyFrameworks = require("policy.frameworks");

/**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module policy
 */
var policyClaim = {

    
    initialisePolicy: function (newPolicy) {
        if (undefined === newPolicy.rooms[0])
            newPolicy.rooms = [newPolicy.rooms];

    },


    draftNewPolicyId: function (oldPolicy) {
        return null;
    },


    enactPolicy: function (currentPolicy) { //CLAIMER_BODY
    },


};

module.exports = policyClaim;

























