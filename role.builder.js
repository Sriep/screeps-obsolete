/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleBase = require("role.base");
 
var roleBuilder = {
    
	findTarget: function(creep) {
        return creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
		/*var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(constructionSites.length) {
		    constructionSites.sort((a,b) => 
                roleBase.distanceBetween(a, creep) - roleBase.distanceBetween(b, creep));
			return 	constructionSites[0];  n
		}
        return 0;*/
	},	

    /** @param {Creep} creep **/
    run: function(creep) {
        this.newRun(creep);
       /* roleBase.checkCarryState(creep);
        // moving towards construction site
        if(creep.memory.carrying) {   
        	var target = this.findTarget(creep);
        	if (0 != target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
        	} //if (0 != target)
        } // if(creep.memory.building)        
        // moving towards source
        else {
            roleBase.fillUpEnergy(creep);
        } //else*/
    }, //function

    newRun: function(creep) {
        var newTask = roleBase.checkTask(creep);
        //console.log("newTasknewTasknewTasknewTasknewTask",newTask);
        creep.memory.task = newTask;
        console.log("newtask" ,newTask,"creep",creep,"creeptask",creep.memory.task);

        // moving towards construction site
        switch (creep.memory.task) {
            case roleBase.Task.MOVE:
                roleBase.move(creep);
                break;
            case roleBase.Task.CARRY:
                var target = this.findTarget(creep);
                if (0 != target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                break;
            case roleBase.Task.HARVEST:
                roleBase.fillUpEnergy(creep);
                break;
            default:
        }
    }


};

module.exports = roleBuilder;

























