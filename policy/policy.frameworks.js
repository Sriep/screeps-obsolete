/**
 * @fileOverview Screeps module. Declaration of policies.
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var gc = require("gc");
//raceClaimer = require("raceClaimer");

/**
 * Declaration of policies that can be created.
 * @module policyFrameworks
 */
var policyFrameworks = {
    Type: {
        THE_POOL: "the.pool",
        PEACE: gc.POLICY_PEACE,
      //  CONSTRUCTION: "construction",
      //  DEFEND: "defence",
        RESCUE: gc.POLICY_RESCUE,
       // FOREIGN_HARVEST: "foreign.harvest",
        //FOREIGN_ROAD: "neutral.road",
        NEUTRAL_ROOM: gc.NEUTRAL_ROOM,
       // CLAIM: "claim",
        BUILD_SPAWN: gc.POLICY_BUILD_SPAWN,
       // GIFT_CREEP: "gift.creep",
        NEUTRAL_BUILDER: gc.POLICY_NEUTRAL_BUILDER,
        //POLICY_MANY2ONE_LINKERS: gc.POLICY_MANY2ONE_LINKERS,
        POLICY_HARVEST_KEEPER_SECTOR: gc.POLICY_HARVEST_KEEPER_SECTOR
    },


    /**
     * Creates  and activates a policy to organise a link setup in a room between harvested or mined resouces and a storage object.
     * @function createMany2OneLinkersPolicy
     * @param   {number} roomName  The name of the room for which we are setting up links
     * @param   {Object} fromLinks  An array of objects containing information on each link.
     *          Each element of the array is of the from:
     *          { fromId : number, resource : number, x : number, y : number, fromLinkId : number }
     *   <ul>
     *   <li> fromId = Target id of the supply object, typically a source or mineral.
     *   <li> resource = A RESOURCE_* value: the resource being transported, e.g RESOURCE_ENERGY for a source.
     *   <li> x = The x coordinate to position the creep. Needs to touch both the from object and link.
     *   <li> y = The x coordinate to position the creep. Needs to touch both the from object and link.
     *   <li> fromLinkId = The id of the link object. This will send materials to the to link.
     *   </ul>
     * @param   {Object} toLink The cost of the creep. Takes the from
     *          { toLinkId : number, x : number, y : number, storageId : number, mineId : number, mineResource, nunber }
     *   <ul>
     *   <li> toLinkID = Id of the link object, resource from the from links will be transferred to here.
     *   <li> x = The x coordinate to position the creep. Needs to touch both the from storage and link.
     *   <li> y = The x coordinate to position the creep. Needs to touch both the from storage and link.
     *   <li> storage = The id of the storage object.
     *   </ul>
     * @param {number} mineId If the creep is next to a surce or mineral it can also harvest of mine.
     *          Set to undefined if not required.
     * @param {number} mineResource RESOURCE_* value: the resource optionally being mined. Set to undefined if mineId is undefined.
     * @returns {Object}  Copy of the policy created.
     * @example
     *   // Links two sources to a storage object next to a mine.
     *   var fromLink1 = { fromId : 55db3176efa8e3fe66e04a50, resource : RESOURCE_ENERGY
     *                  , x : 13, y : 16, fromLinkId : 577dfc4a028278ee71b2c875 }
     *   var fromLink2 = { fromId : 55db3176efa8e3fe66e04a52, resource : RESOURCE_ENERGY
     *                  , x : 8, y : 35, fromLinkId : 57711380ad3cbdff451970ec }
     *   var toLink = { "W26S21", toLinkId : 577ec1375a1c85636f551c4b, x : 42, y : 28, storageId : 577a8dd4b973e61c594592dc
     *                  , mineId : 56e14bf41f7d4167346e0a76, mineResource, RESOURCE_OXYGEN }
     *   createMany2OneLinkersPolicy([fromLink1,fromLink2],toLink)
     */
    /*createMany2OneLinkersPolicy: function(roomName, linksInfo)
    {
        var newPolicy = {id : policy.getNextPolicyId()
            ,type : this.Type.POLICY_MANY2ONE_LINKERS
            ,room : roomName
            ,linksInfo: linksInfo
        };
        if (true) {
            var module = policy.getModuleFromPolicy(newPolicy);
            //module.initialisePolicy(newPolicy)
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },*/

    createPeacePolicy: function(room, linksInfo)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.PEACE,
            room : room
            ,linksInfo: linksInfo
        };
        return p;
    },

    createRescuePolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.RESCUE,
            room : room};
        return p;
    },

    createNeutralRoomPolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.NEUTRAL_ROOM,
            room : room};
        return p;
    },

    createBuildspawn: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.BUILD_SPAWN,
            room : room};
        return p;
    },

    policyKeeperSectorMarshal: function(keeperRoom, marshallingPos, start, oldPolicy) {
        if (oldPolicy) {
            var newPolicy = {
                id : oldPolicy.id,
                type : gc.POLICY_KEEPER_SECTOR_AFTER_ACTION,
                flag: oldPolicy.flag,
                keeperRoom : oldPolicy.keeperRoom,
                marshallingPos : oldPolicy.marshallingPos,
                tickLastAttackStarted : undefined,
                cleared : false
            };
        } else {
            var newPolicy = {
                id : policy.getNextPolicyId(),
                type : gc.POLICY_KEEPER_SECTOR_MARSHAL,
                flag: undefined,
                keeperRoom : keeperRoom,
                marshallingPos : marshallingPos,
                cleared : false
            };
        }
        if (start) {
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    policyKeeperSectorAfterAction: function(oldPolicy, start) {
        var newPolicy = {
            id : oldPolicy.id,
            type : gc.POLICY_KEEPER_SECTOR_AFTER_ACTION,
            flag: oldPolicy.flag,
            keeperRoom : oldPolicy.keeperRoom,
            marshallingPos : oldPolicy.marshallingPos,
            tickLastAttackStarted : oldPolicy.tickLastAttackStarted,
            cleared : oldPolicy.cleared
        };
        if (start) {
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    policyKeeperSectorSuppress: function(oldPolicy, start) {
        var newPolicy = {
            id : oldPolicy.id,
            type : gc.POLICY_KEEPER_SECTOR_SUPPRESS,
            flag: oldPolicy.flag,
            keeperRoom : oldPolicy.keeperRoom,
            marshallingPos : oldPolicy.marshallingPos,
            tickLastAttackStarted : oldPolicy.tickLastAttackStarted,
            cleared : true
        };
        if (start) {
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    policyKeeperSectorAttack: function(oldPolicy, start) {
        var newPolicy = {
            id : oldPolicy.id,
            type : gc.POLICY_KEEPER_SECTOR_ATTACK,
            flag: oldPolicy.flag,
            keeperRoom : oldPolicy.keeperRoom,
            marshallingPos : oldPolicy.marshallingPos,
            cleared : oldPolicy.cleared
        };
        if (start) {
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    createAttackStructuresPolicy: function(structureIds, roomIds, creepSize, attackGroupSize
                                             , marshallingPoint, start)
    {
        var newPolicy = {
            id : policy.getNextPolicyId(),
            type : gc.POLICY_ATTACK_STRUCTURES,
            structureIds : structureIds,
            roomIds : roomIds,
            creepSize : creepSize,
            attackGroupSize : attackGroupSize,
            marshallingPoint : marshallingPoint
        };
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    createThePool: function() {
        var p  = {
            id : 0,
            type : this.Type.THE_POOL,
            requisitions : {},
            supplyCentres : {},
            nextRequisitionsId : 0,
            nextSupplyCentreId : 0
        }
        return p;
    }

/*
    createPotrolRoomPolicy: function(roomPos, creepSize, start)
    {
        var newPolicy = {
            id : policy.getNextPolicyId(),
            type : gc.POLICY_PATROL_ROOM,
            roomPos : roomPos,
            creepSize : creepSize
        };
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    
    createNeutralBuilderPolicy: function(workRoom, sourceRoom, workerSize, start)
    {
        var newPolicy = {
            id : policy.getNextPolicyId(),
            type : gc.POLICY_NEUTRAL_BUILDER,
            workRoom : workRoom,
            sourceRoom : sourceRoom,
            workerSize : workerSize
        };
        if (start) {
            var module = policy.getModuleFromPolicy(newPolicy);
            //module.initialisePolicy(newPolicy);
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    createForeignHarvest: function(harvestRoom, storageRoom, workerSize, sourceId, offoadId, start)
    {
        var newPolicy = {
            id : policy.getNextPolicyId(),
            type : gc.POLICY_FOREIGN_HARVEST,
            harvestRoom : harvestRoom,
            storageRoom : storageRoom,
            workerSize : workerSize,
            sourceId : sourceId,
            offLoadId : offoadId
        };
        if (start) {
            policy.activatePolicy(newPolicy);
        }
        return newPolicy;
    },

    createRemoteActionsPolicy: function(rooms, actions, findFunctions, findFunctionsModules, body, start) {
        var newPolicy = {
            id : policy.getNextPolicyId(),
            type : gc.POLICY_REMOTE_ACTIONS,
            rooms  : rooms,
            actions : actions,
            findFunctions : findFunctions,
            findFunctionsModules : findFunctionsModules,
            body : body
        };
        if (start) {
            policy.activatePolicy(newPolicy)
        }
        return newPolicy;
    },

    createGiftCreepPolicy: function(room, giveId, body, start) {
        var newPolicy = { id : policy.getNextPolicyId(),
            type : gc.POLICY_GIFT_CREEP,
            room : room,
            giveId : giveId,
            body : body};
        if (start) {
            policy.activatePolicy(newPolicy)
        }
        return newPolicy;
    },



    createDefendPolicy: function(room)
    {
        var p = { id : policy.getNextPolicyId(),
            type : this.Type.DEFEND,
            room : room};
        return p;
    },

    createConstructionPolicy: function(room) {
        var p = {
            id : policy.getNextPolicyId(),
            type : this.Type.CONSTRUCTION,
            room : room
        };
        return p;
    },
*/
    
}



module.exports = policyFrameworks;


















































