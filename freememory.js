/**
 * @fileOverview Screeps module. Object for free up memory
 * @author Piers Shepperson
 */

/**
 * Object for free up memory
 * @module raceInfantry
 */
var freememory = {
    freeCreeps: function ()
    {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                Memory.creeps[name] = undefined;
            }
        }
    },
    freeRooms: function ()
    {
        for(var name in Memory.rooms) {
            if(!Game.rooms[name]) {
                Memory.rooms[name] = undefined;
            }
        }
    },
};

    var test11 = function()
    {
        console.log("hathathathathathahtahtahtahthtahtahtaht");
    }



module.exports = freememory;
