/**
 * @fileOverview Screeps module. Abstract object containing data and functions
 * related contollers
 * @author Piers Shepperson
 */
 

 
/**
 * Abstract object containing data and functions
 * related contollers
 * @module roomController
 */
var roomController = { 
    
    maxProduction: [0,300,550,800,1300,1800,2300,5300,12000],

    getRoomOwner: function(room)
    {
        return room.controller.my;
    }
}


module.exports = roomController;

