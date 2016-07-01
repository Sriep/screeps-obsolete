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
        if ( room.name == creep.memory.workRoom ) {
            
            var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructionSites.length) {
                var site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                return site;
            } else {
                creep.memory.carrying = false;
                var thePolicy = policy.getPolicyFromId(creep.memory.policy.id);
                thePolicy.shuttingDown = true;
            }
            
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.workRoom);
            var exit = creep.pos.findClosestByRange(route[0].exit);
            if (creep.pos.x == exit.x && creep.pos.y == exit.y) {
                var exitDirection = Game.map(creep.rom, creep.memory.workRoo);
                creep.move(exitDirection);
            } else {
                creep.moveTo(this.nextStepNextRoom(creep.pos));
            }
            //creep.moveTo(new RoomPosition(25, 20, 'W10N5'));
            //
           /// var targetRoomName = "E13S8";
         //   var targetPos = new RoomPosition(10,10, targetRoomName);
         //   Urist.moveTo(targetPos);
          //  return 0;
        }
    },

    nextStepIntoRoom: function(pos, nextRoom) {
        var x  = pos.x;
        var y= pos.y;
        if (pos.x == 0) {
            x ==48;
        }
        if (pos.x == 49) {
            x = 1;
        }
        if (pos.y == 0) {
            y ==48;
        }
        if (pos.y == 49) {
            y = 1;
        }
        return new RoomPosition(x,y);
    },


    /** @param {Creep} creep **/
    run: function(creep, room) {
        roleBase.checkCarryState(creep);
        // moving towards construction site
        if(creep.memory.carrying) {
            var target = this.findTarget(creep, room);
            if (0 != target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } //if (0 != target)
        } // if(creep.memory.building)
        // moving towards source
        else {
            if ( room.name != creep.memory.sourceRoom ) {
                var route = Game.map.findRoute(creep.room, creep.memory.sourceRoom);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                if(creep.pos.x == exit.x && creep.pos.y == exit.y){
                    creep.moveTo(this.nextStepNextRoom(creep.pos));
                } else {
                    creep.moveTo(exit);
                }
             } else {
                roleBase.fillUpEnergy(creep);
             }
        } //else
    } //function
}

module.exports = roleNeutralBuilder;