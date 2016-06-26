/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */


/**
 * Abstract base object for deceison when at peace decisions.
 * @module raceBase
 */
var policyPeace = {

    //Bace object
    policy: require("policy"),

    policyPeace: require("policy.peace"),
    policyConstruction : require("policy.construction"),
    policyDefend: require("policy.defence"),
    policyRescue: require("policy.rescue"),
    raceWorker: require("race.worker"),


    draftNewPolicyId: function(room) {
        console.log("In draft newe policy");
        if (policyDefend.beingAttaced(room)) {         
            //return policy.Policy.DEFEND;
        }
        if (2 > room.find(FIND_MY_CREEPS).length) {
            //return policy.Policy.RESCUE;
        }
        return policy.Policy.PEACE;
    },

    enactPolicy: function(room) {
        console.log("In enact policy");
        spawns = currentRoom.find(FIND_MY_SPAWNS);
        var workerSize = raceWorker.maxSize(room.controller);
        raceBase.spawn(raceWorker, room, spawns[0], workerSize);
        raceWorker.assignRoles(room);
        raceWorker.moveCreeps(room);
    }

}

module.exports = policyPeace;