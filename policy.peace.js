/**
 * @fileOverview Screeps module. Abstract object for handling  
 * decisions when at peace.
 * @author Piers Shepperson
 */
    //Bace object
    policy = require("policy");
    stats = require("stats");
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
    draftNewPolicyId: function(oldPolicy) {
        var room =  Game.rooms[oldPolicy.room];
        if (policyDefend.beingAttaced(room)) {
            return policy.createDefendPolicy(room.name);
        }
        var policyRescue = require("policy.rescue");
        if (policyRescue.needsRescue(room)) {
            return policy.createRescuePolicy(room.name);
        }
        if (policyConstruction.startConstruction(room)) {
            return policy.createConstructionPolicy(room.name);
        }
        return oldPolicy;
    },
    
    switchPolicy: function(oldPolicy, newPolicy)
    {
        switch(oldPolicy.type) {
        case policy.Type.RESCUE:
            break;
        case policy.Type.CONSTRUCTION:
            break;
        case policy.Type.DEFEND:
            break;
        case policy.Type.PEACE:   
        default:
        }
        policy.reassignCreeps(oldPolicy, newPolicy);
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
    * @param   {Object} policy  The room that might need rescuing.
    * @returns {none} 
    */
    enactPolicy: function(currentPolicy) {

        console.log("enactPeace", JSON.stringify(currentPolicy));
        //currentPolicy.room = "W26S21";
        var room = Game.rooms[currentPolicy.room];
        //var room = Game.rooms["W26S21"];
        room.memory.policyId = currentPolicy.id;
        var linksEnabled = false
        var numlinkers = 0;

        var nCreeps = room.find(FIND_MY_CREEPS).length;
        var nHavesters = Math.ceil(roomOwned.peaceHavesters(room, undefined, true));
        if (room.memory.links !== undefined 
            && room.memory.links.length != 0
            && nCreeps >= nHavesters + 2)
        {
            numlinkers = 2 * this.processLinks(room);
            linksEnabled = numlinkers > 0;
        } else {
            if (room.memory.links === undefined) {
                room.memory.links = [];
            }
            if (nCreeps < nHavesters + 2) {
                policy.breakUpLinks(room);
            }
        }
        var energy  = roomOwned.allSourcesEnergy(room) *5;
        energy -= 15000*linksEnabled;

        var toSupply = policy.supportBurden(currentPolicy) + numlinkers;
        if (toSupply > 0) {
            var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
            toSupply = Math.min(toSupply, supportable);
        }
        if (toSupply > 0)
        {
            var nLinkers = 2;
            var nHavesters = roomOwned.supportHavesters(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.supportUpgraders(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy,  (nHavesters + nUpgraders + toSupply) , nHavesters);
        }  else {
            var nHavesters = roomOwned.peaceHavesters(room,  policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.peaceUpgraders(room,  policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy, (nHavesters + nUpgraders), nHavesters);;
        }
    },

    spawnWorkerCreep: function(room, currentPolicy, equilbriumCreeps, nHavesters) {
        //var creeps = room.find(FIND_MY_CREEPS, { filter: { policyId: currentPolicy.id }});
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        var nCreeps = creeps.length;
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);


        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE < nWorkParts )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                //nHavesters = Math.floor(nHavesters);
                nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nHavesters);
            }
        } else {
            var spawns = room.find(FIND_MY_SPAWNS);
            raceBase.spawn(raceWorker, currentPolicy, spawns[0], policy.LINKING_WORKER_SIZE);
            nHavesters = Math.ceil(nHavesters);
        }
        //console.log("currentpolicy", JSON.stringify(currentPolicy));
       // var spawns = room.find(FIND_MY_SPAWNS);
        //raceBase.spawn(raceWorker, currentPolicy, spawns[0], 1);


        var nBuilders = 0;
        var nRepairers = 0;     
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        } 
        var nUpgraders = nCreeps - nHavesters - nRepairers - nBuilders;  
               
        console.log("enact Peace with links roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers
                , "total creeps", nCreeps);

        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);
        policy.convertContractWorkers(room, currentPolicy, roleBase.Type.UPGRADER);
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

    linkSourceContoller: function(linkFrom, linkTo, linkId, room)
    {
        var sourceCreep = Game.getObjectById(linkFrom.creepId);
        var source = Game.getObjectById(linkFrom.id);
        var sourceLink = Game.getObjectById(linkFrom.linkId);

        var controllerCreep = Game.getObjectById(linkTo.creepId);
        var controllerLink = Game.getObjectById(linkTo.linkId);
        var contoller = Game.getObjectById(linkTo.id);
        
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
            if (sourceCreep === null) {
                console.log("link failed no  sourceCreep");
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
            if (controllerCreep === null) {
                console.log("link failed no controllerCreep");
                return false;

            }
         
        }
        console.log("link succesful");
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

        //sourceCreep.harvest(source);
        stats.harvest(sourceCreep,source);

        sourceCreep.transfer(sourceLink, RESOURCE_ENERGY);
        
        if (sourceLink.energy == sourceLink.energyCapacity
            || controllerLink < 2 * controllerCreep.carryCapacity)
        {
            sourceLink.transferEnergy(controllerLink)
        }
        controllerLink.transferEnergy(controllerCreep)
        controllerCreep.moveTo(linkTo.pos.x, linkTo.pos.y);
        controllerCreep.transfer(sourceLink, RESOURCE_ENERGY);
        //controllerCreep.upgradeController(contoller); 
        stats.upgradeController(controllerCreep, contoller);
        return true;
    },


    attachCreep: function (creep, policyId, role)
    {
        Game.creeps[creep].memory.role = role;
        Game.creeps[creep].memory.employerId = policyId;
    }
}


module.exports = policyPeace;




































