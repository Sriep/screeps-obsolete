/**
 * Created by Piers on 08/07/2016.
 */
/**
 * Created by Piers on 08/07/2016.
 */
/**
 * @fileOverview Screeps module. Template.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var gc = require("gc");
/**
 * Abstract Policy
 * @module PolicyTemplate
 */
function PolicyTemplate () {
    this.type = gc.POLICY_TEMPLATE;
    this.roomName = undefined;
}

PolicyTemplate.prototype.initialisePolicy = function (newPolicy) {
    return true;
};

PolicyTemplate.prototype.draftNewPolicyId = function(oldPolicy) {
    //return null;
    return oldPolicy;
};

PolicyTemplate.prototype.switchPolicy = function(oldPolicy, newPolicy) {
    policy.reassignCreeps(oldPolicy, newPolicy);
};

PolicyTemplate.prototype.enactPolicy = function(currentPolicy) {
};

module.exports = PolicyTemplate;