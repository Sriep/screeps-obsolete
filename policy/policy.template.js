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

/**
 * Abstract Policy
 * @module policyTemplate
 */
var policyTemplate = {

    initialisePolicy: function (newPolicy) {
        return true;
    },

    draftNewPolicyId: function(oldPolicy) {
        //return null;
        return oldPolicy;
    },

    assignWorker: function(creep, policy)
    {
    },

    clearCreep: function(creep) {
    },

    cleanUp: function(oldPolicy)
    {
    },

    switchPolicy: function(oldPolicy, newPolicy)
    {
    },

    enactPolicy: function(currentPolicy) {
    }

}

module.exports = policyTemplate;