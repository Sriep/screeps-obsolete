/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleBase = require("role.base");
 
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Need to fill up with energy
        if(creep.carry.energy < creep.carryCapacity) {
            var sourceId = creep.memory.targetSourceId;
            // Has not decided which source to target
            if (sourceId === undefined || 0 == sourceId)
            {            
                //console.log(creep.name + "Needs to fill up with energy and has no sourceId");
                var targetSource = roleBase.findTargetSource(creep);
                //console.log(creep.name + "Has new target " + targetSource);
                if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) { 
                   // console.log("Target sources" + targetSource );
                    creep.memory.targetSourceId = targetSource.id;
                    creep.moveTo(targetSource);
                }   
             // Contiue moving towards source or havest it if there       
             } else {    
                //console.log(creep.name + "Needs to fill up with energy and has sourceid" 
                //    + creep.memory.targetSourceId); 
                var source = Game.getObjectById(creep.memory.targetSourceId);                
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {                   
                    creep.moveTo(source);
                } 
            } // if (sourceId)             
        }
        // Find somewher to deliver energy
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) 
                        && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleHarvester;
















