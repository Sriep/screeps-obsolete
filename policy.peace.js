/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");

    policyConstruction = require("policy.construction");
    policyDefend = require("policy.defence");
    //policyRescue = require("policy.rescue");
    raceBase = require("race.base");
    raceWorker = require("race.worker");
    roomOwned = require("room.owned");


/**
 * Abstract base object for deceison when at peace decisions. Peace is
 * when the main objective is to transfer as much avalible energy to the 
 * rooms contoller as possable.
 * @module policyPeace
 */
var policyPeace = {
    REPAIR_THRESHOLD: 3,
    REPAIR_RATIO: 0.1,
   
    /**
     * Called when at peace. Determins what the new polciy for the comming 
     * tick should be.
     * @function draftNewPolicyId
     * @param   {Object} room  The room we are drafting the policy for.
     * @returns {enum} Id of policy for comming tick. 
     */   
    draftNewPolicyId: function(room) {
        if (policyDefend.beingAttaced(room)) {         
            return policy.Type.DEFEND;
        }
        policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policy.Type.RESCUE;
        }
        if (policyConstruction.constructionSite(room)) {
            return policy.Type.CONSTRUCTION;
        }
        return policy.Type.PEACE;
    },

    /**
    * Enact peace time policy. The main objective in peace time is to 
    * transger as much source energy to the rooms controller as possible.
    * <ul>
    * <li> Spawn a worker if enought energy avaliable.
    * <li> Determine the ratio of havesters, upgraders, builders and repaiers. 
    * <li> Move all the workers in the room.
    * </ul>
    * @function enactPolicy
    * @param   {Object} room  The room that might need rescuing.
    * @returns {none} 
    */
    enactPolicy: function(room) {
        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var numlinkers = 0;
        var nHavesters = Math.ceil(roomOwned.peaceHavesters(room, undefined, true));
        if (room.memory.links !== undefined 
            && room.memory.links.length != 0
            && nCreeps >= nHavesters + 2)
        {
            numlinkers = 2 * this.processLinks(room);
        }
    
        if (numlinkers > 0) 
        {
            this.assingWorkersWithLinks(room);
        }  else {
            this.assignWorkesNoLinks(room);
        } 

        raceBase.moveCreeps(room);
    },

    switchPolicy: function(room, oldPolicyId)
    {
        switch(oldPolicyId) {
        case policy.Type.RESCUE:
            break;
        case policy.Type.CONSTRUCTION:
            break;
        case policy.Type.DEFEND:
            break;
        case policy.Type.PEACE:   
        default:
        }    
    },

    assignWorkesNoLinks: function (room) {
        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nBuilders = 0;
        var nRepairers = 0;     
        var nHavesters = roomOwned.peaceHavesters(room, undefined, true);
        var nUpgraders = roomOwned.peaceUpgraders(room, undefined, true);
        console.log("assingWorkers nonolink Havesres", nHavesters, "Upgares", nUpgraders);
        if (nHavesters + nUpgraders < nCreeps )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                nHavesters = Math.floor(nHavesters);
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            spawns = room.find(FIND_MY_SPAWNS);
            raceBase.spawn(raceWorker, room, spawns[0], policy.LINKING_WORKER_SIZE);  
            nHavesters = Math.ceil(nHavesters);
        }

        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        }

        var nUpgraders = nCreeps - nHavesters - nBuilders - nRepairers;       
        console.log("enact Peace roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers,
                "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);
    },

    assingWorkersWithLinks: function(room) {
        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nLinkers = 2;
        var nHavesters = roomOwned.linkHavesters(room, undefined, true);
        var nUpgraders = roomOwned.linkUpgraders(room, undefined, true);
        console.log("assingWorkers linkHavesres", nHavesters, "linkUpgares", nUpgraders);
        var nEqulibCreeps = nHavesters + nUpgraders;
        console.log("assingWorkersWithLinks nEqulibCreeps < nCreeps- nLinkers"
                , nEqulibCreeps, nCreeps- nLinkers);
        if (nEqulibCreeps < nCreeps - nLinkers)
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                console.log("about to reduce havesers nEqulibCreeps");
                nHavesters = Math.floor(nHavesters);
            } else {
                nHavesters = Math.ceil(nHavesters);
            }

        } else {
            console.log("assingWorkersWithLinks About to try a spawn")
            spawns = room.find(FIND_MY_SPAWNS);
            raceBase.spawn(raceWorker, room, spawns[0], policy.LINKING_WORKER_SIZE);  
            nHavesters = Math.ceil(nHavesters);
        }
        var nBuilders = 0;
        var nRepairers = 0;     
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        } 
        var nUpgraders = nCreeps - nHavesters - nBuilders - nRepairers - nLinkers;  
               
        console.log("enact Peace with links roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers
                , "linkers", nLinkers, "total creeps", nCreeps);
        raceWorker.assignWorkerRoles(room, nHavesters, nUpgraders,
                                nBuilders , nRepairers);
    },

    processLinks: function(room)
    {        
        var links = room.memory.links;
        var numlinks = 0;
        for (var i in links) {
            var linkFrom = links[i][0];
            var linkTo = links[i][1];
            if (linkFrom.type == "source" && linkTo.type == "controller")
            {
                 if (this.linkSourceContoller(linkFrom, linkTo, i, room)) {
                     numlinks = numlinks+1;
                 } else {
                     console.log("error setting up link");
                 }
            } else {
                console.log("link",linkFrom.type ,"to",linkTo.type,"not implimented");   
            }
        }
        return numlinks;
    },
/*
    Memory.rooms["W26S21"].links = [ [ 
        {type: "source",
            id: "55db3176efa8e3fe66e04a52",
            creepId: undefined,
            linkId: "57711380ad3cbdff451970ec",
            pos: {roomName: "W26S21", x: 7, y: 35 }}
        ,{type: "controller",
            id: "55db3176efa8e3fe66e04a51",
            creepId: undefined,
            linkId: "577111bdf2ced3fd46870349",
            pos: {roomName: "W26S21", x: 36, y: 18 }
            } ] ];
*/
    linkSourceContoller: function(linkFrom, linkTo, linkId, room)
    {
        console.log("linkSourceContoller from" ,linkFrom, "to", linkTo, "id", linkId)
        sourceCreep = Game.getObjectById(linkFrom.creepId);
        source = Game.getObjectById(linkFrom.id);
        sourceLink = Game.getObjectById(linkFrom.linkId);

        controllerCreep = Game.getObjectById(linkTo.creepId);       
        controllerLink = Game.getObjectById(linkTo.linkId);
        contoller = Game.getObjectById(linkTo.id);
        
        if ( sourceCreep === null ) {
            sourceCreep = source.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(creep) {
                    if (creep.carryCapacity != 250) {
                        return false;
                    }
                    if (controllerCreep == undefined)
                    {
                        return true
                    }
                    return creep.id != controllerCreep.id;
                }
            });
            console.log("linkSourceContoller sourceCreep", sourceCreep);
            if (sourceCreep === null) {
                return false;
            }

        }
        if (controllerCreep === null  ) {
             controllerCreep = source.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(creep) {
                    return (creep.id != sourceCreep.id
                        && creep.carryCapacity == 250);
                }
            });      
            console.log("linkSourceContoller controllerCreep", controllerCreep);
            if (controllerCreep === null) {
                return false;
            }
         
        }

        sourceCreep.memory.role = "linker";       
        controllerCreep.memory.role = "linker";  
        room.memory.links[linkId][0].creepId = sourceCreep.id;
        room.memory.links[linkId][1].creepId = controllerCreep.id;
        if (room.memory.reservedSources === undefined) {
           room.memory.reservedSources = [source.id]
        } else {
       //    room.memory.reservedSources.push("source.id");
        }


        sourceCreep.moveTo(linkFrom.pos.x, linkFrom.pos.y);
        sourceCreep.harvest(source);
        sourceCreep.transfer(sourceLink, RESOURCE_ENERGY);
        
        if (sourceLink.energy == sourceLink.energyCapacity
            || controllerLink < 2 * controllerCreep.carryCapacity)
        {
            sourceLink.transferEnergy(controllerLink)
        }
        controllerLink.transferEnergy(controllerCreep)
        controllerCreep.moveTo(linkTo.pos.x, linkTo.pos.y);
        controllerCreep.transfer(sourceLink, RESOURCE_ENERGY);
        controllerCreep.upgradeController(contoller); 
        return true;
    }
    
}


module.exports = policyPeace;