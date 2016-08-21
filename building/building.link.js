/**
 * Created by Piers on 19/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */

/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module buildingLink
 */
var buildingLink = {

    move: function(link, flag) {
        //console.log("link",link,"moved");
        if (flag.memory.nextLinkId) {
            var nextLink = Game.getObjectById(flag.memory.nextLinkId);
            if (nextLink) {
                link.transferEnergy(nextLink);
            }
        }
    },

};

module.exports = buildingLink;