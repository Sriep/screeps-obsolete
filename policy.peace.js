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
    var _ = require('lodash');
    var policyBuildspawn = require("policy.buildspawn");

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
        if (!policyBuildspawn.spawnFound(oldPolicy))      {
          //  console.log("draftNewPolicyId policyBuildspawn.spawnFound(oldPolicy) = true");
            return policy.createBuildspawn(room.name);
        }
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

    initilisePolicy: function (newPolicy) {
        return true;
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
        var room = Game.rooms[currentPolicy.room];

        room.memory.policyId = currentPolicy.id;
        var linksEnabled = false
        var numlinkers = 0;
        policy.breakUpLinks(room);
       // var creeps = room.find(FIND_MY_CREEPS);
     //   for (var i in creeps)
    //   {
   //         if (creeps[i].memory.role == "neutral.builder"){
    //           creeps[i].memory.role = "upgrader";
    //        }
    //        creeps[i].memory.policyId = currentPolicy.id;
   //     }

        var nCreeps = creeps.length;
        var nHavesters = Math.ceil(roomOwned.peaceHavesters(room, undefined, true));
console.log("before set up links",room.memory.links,room);

      //   room.memory.links=undefined;
        if (room.memory.links === undefined) {
            console.log("set up links");
            room.memory.links = [];
            room.memory.links[0] = [];
            room.memory.links[0].push({     pos : {x:8,y:35}
                                             ,type : "source"
                                            , creepId : null
                                            , id : "55db3176efa8e3fe66e04a52"
                                            , linkId : "57711380ad3cbdff451970ec" });
            room.memory.links[0].push({      pos : {x:36,y:18}
                                            ,type : "controller"
                                            , creepId : null
                                            , id : "55db3176efa8e3fe66e04a51"
                                            , linkId : "577111bdf2ced3fd46870349" });
                //  if (nCreeps < nHavesters + 2) {
        }

     //       policy.breakUpLinks(room);
    //    }

        if (room.memory.links !== undefined 
            && room.memory.links.length != 0
            && nCreeps >= nHavesters + 2)  {
            numlinkers = 2 * this.processLinks(room,currentPolicy);
            linksEnabled = numlinkers > 0;
        }

        var energy  = roomOwned.allSourcesEnergy(room) *5;
        energy -= 15000*linksEnabled;

        var toSupply = policy.supportBurden(room) + numlinkers;
        //if (toSupply > 0) {
            var supportable = roomOwned.workersSupportable(room, energy, raceWorker.LINKING_WORKERSIZE, true);
            toSupply = Math.floor(Math.min(toSupply, supportable));
        //}
        console.log("Room can support", supportable,"workers for ",supportable*1000
            ,"energy and",supportable*5,"parts. Support burder is",toSupply,"workers.");
        if (toSupply > 0)
        {
            var nLinkers = 2;
            var nHavesters = roomOwned.supportHavesters(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.supportUpgraders(room, toSupply, energy, policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy,  (nHavesters + nUpgraders + toSupply) , nHavesters, numlinkers);
        }  else {
            var nHavesters = roomOwned.peaceHavesters(room,  policy.LINKING_WORKER_SIZE, true);
            var nUpgraders = roomOwned.peaceUpgraders(room,  policy.LINKING_WORKER_SIZE, true);
            this.spawnWorkerCreep(room, currentPolicy, (nHavesters + nUpgraders), nHavesters,numlinkers);;
        }
    },

    spawnWorkerCreep: function(room, currentPolicy, equilbriumCreeps, nEqHavesters,numlinkers) {
        console.log("Support Havesters",nEqHavesters,"Equlibrium creeps",equilbriumCreeps);

        //var creeps = room.find(FIND_MY_CREEPS, { filter: { policyId: currentPolicy.id }});
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.policyId == currentPolicy.id);
        var nCreeps = creeps.length;
        console.log("creeps assigned to peace", creeps.length)
        var nWorkParts = raceBase.countBodyParts(creeps, WORK);
        console.log("Number of creeeps",nCreeps,"with a total of ",nWorkParts,"parts looking for ",
                     equilbriumCreeps * policy.LINKING_WORKER_SIZE ,"parts" );
        if (equilbriumCreeps * policy.LINKING_WORKER_SIZE < nWorkParts )
        {           
            if (policy.energyStorageAtCapacity(room))
            {
                //nHavesters = Math.floor(nEqHavesters);
                nHavesters = 0;
            } else {
                nHavesters = Math.ceil(nEqHavesters);
            }
        } else {
            console.log("try spawn");
            var spawns = room.find(FIND_MY_SPAWNS);
            if (spawns == undefined || spawns == []) {return;}
            raceBase.spawn(raceWorker, currentPolicy, spawns[0], policy.LINKING_WORKER_SIZE);
            nHavesters = Math.max(Math.ceil(nEqHavesters),2);
            if (nWorkParts <10 ) {nHavesters == nCreeps;}
        }
        //console.log("currentpolicy", JSON.stringify(currentPolicy));
        //var spawns = room.find(FIND_MY_SPAWNS);
        //raceBase.spawn(raceWorker, currentPolicy, spawns[0], 1);


        var nBuilders = 0;
        var nRepairers = 0;     
        if (nCreeps - nHavesters > this.REPAIR_THRESHOLD) {
            nRepairers = 1;
        } 
        var nUpgraders = nCreeps - nHavesters - nRepairers - nBuilders;  
               
        console.log("Enact Peace with links roles havesters", nHavesters, "builders", nBuilders,
                "upgraders", nUpgraders, "and repairers", nRepairers
                , "total creeps", nCreeps);

        raceWorker.assignWorkerRoles(currentPolicy, nHavesters, nUpgraders, nBuilders , nRepairers);

        var freeForContractWork = Math.max(0, nCreeps - Math.ceil(nEqHavesters) - numlinkers);
        policy.convertContractWorkers(room, currentPolicy, roleBase.Type.UPGRADER);
    },

    processLinks: function(room,policy)
    {
       console.log("In process links");
        var links = room.memory.links;
        var numlinks = 0;
        for (var i in links) {
            var linkFrom = links[i][0];
            var linkTo = links[i][1];
            if (linkFrom.type == "source" && linkTo.type == "controller")
            {
                 if (this.linkSourceContoller(linkFrom, linkTo, i, room,policy)) {
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

    linkSourceContoller: function(linkFrom, linkTo, linkId, room,currentPolicy)
    {
        console.log("In linkSourceContoller");
        var sourceCreep = Game.getObjectById(linkFrom.creepId);
        var source = Game.getObjectById(linkFrom.id);
        var sourceLink = Game.getObjectById(linkFrom.linkId);

        var controllerCreep = Game.getObjectById(linkTo.creepId);
        var controllerLink = Game.getObjectById(linkTo.linkId);
        var contoller = Game.getObjectById(linkTo.id);
        
        console.log("linkFRom",JSON.stringify(linkFrom));
        console.log("linkTo",JSON.stringify(linkTo));

        if ( sourceCreep === null ) {
            sourceCreep = source.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(creep) {
                    if (creep.carryCapacity != 250) {
                        return false;
                    }
                    if (controllerCreep == undefined)  {
                        return true
                    }
                    if (controllerCreep != roleBase.Task.HARVEST
                        && controllerCreep != roleBase.Task.UPGRADER
                        && controllerCreep != roleBase.Task.BUILDER
                        && controllerCreep != roleBase.Task.REPAIRER  ){
                        return false;
                    }
                    return creep.id != controllerCreep.id
                }
            });
            if (sourceCreep === null) {
                policy.breakUpLinks(room);
                console.log("link failed no  sourceCreep");
                return false;
            }

        }
        if (controllerCreep === null  ) {
             controllerCreep = source.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(creep) {
                    return (creep.id != sourceCreep.id
                        && creep.carryCapacity == 250
                        && (    controllerCreep != roleBase.Task.HARVEST
                        ||      controllerCreep != roleBase.Task.UPGRADER
                        ||      controllerCreep != roleBase.Task.BUILDER
                        ||      controllerCreep != roleBase.Task.REPAIRER )
                    );
                }
            });
            if (controllerCreep === null) {
                policy.breakUpLinks(room);
                console.log("link failed no controllerCreep");
                return false;

            }
        }

        console.log("sourceCreep",sourceCreep,"source",source,"sourceLink",sourceLink)
        console.log("controllerCreep",controllerCreep,"contoller",contoller,"controllerLink",controllerLink)
        console.log("linkFRom",JSON.stringify(linkFrom));
        console.log("linkTo",JSON.stringify(linkTo));

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
        sourceCreep.pickup(sourceCreep.pos);
        
        if (sourceLink.energy == sourceLink.energyCapacity
            || controllerLink < 2 * controllerCreep.carryCapacity)
        {
            sourceLink.transferEnergy(controllerLink)
        }
        controllerLink.transferEnergy(controllerCreep)
        controllerCreep.moveTo(linkTo.pos.x, linkTo.pos.y);
        controllerCreep.transfer(sourceLink, RESOURCE_ENERGY);
        controllerCreep.pickup(controllerCreep.pos);
/*
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == raceWorker.ROLE_UPGRADER
            && creep.memory.policyId == policy.id);
        for (var i in upgraders) {
            console.log("Transfer energy to creep ", upgraders[i].name, "result"
                , controllerLink.transferEnergy(upgraders[i]));
        }
*/

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




































