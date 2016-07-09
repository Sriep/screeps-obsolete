/**
 * @fileOverview Screeps module. Abstract role object for creeps
 * building in a neutral room
 * @author Piers Shepperson
 */
var roleBase = require("role.base");
var policy = require("policy");
/**
 * Abstract role object for creeps building in a neutral room
 * @module policy
 */
var roleNeutralBuilder = {


    findTarget: function(creep, room) {
        console.log(creep, "in role natural builder find task" );
        var site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
        if (null !== site) {
            return site;
        } else {
            creep.memory.task = roleBase.Task.MOVE;
            console.log("roleNeutralBuilder.findTarget site",null, "cree.pos",creep.pos);
            //creep.memory.targetRoom = creep.memory.endRoom;
            //var contract = policy.getPolicyFromId(creep.memory.policyId);
            //contract.shuttingDown = true;
            return null;
        }
    },

    action: function(creep, target) {
        return creep.build(target);
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        var newTask = roleBase.checkTask(creep);
        creep.memory.task = newTask;
        console.log("New task",newTask," for neurtal bulder creep", creep);

        // moving towards construction site
        switch (creep.memory.task) {
            case roleBase.Task.MOVE:
                roleBase.move(creep);
                break;
            case roleBase.Task.CARRY:
                var target = this.findTarget(creep);
                if (0 != target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
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
}


module.exports = roleNeutralBuilder;























