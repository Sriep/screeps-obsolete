/**
 * Created by Piers on 19/08/2016.
 */
/**
 * Created by Piers on 19/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */
"use strict";
/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module buildingBase
 */
var buildingBase = {

    moveBuildings: function() {
        for (var flagName in Game.flags){
            //var flag = Game.flags[flagName];
            var object = Game.getObjectById(flagName);
            if (object) {
                module = this.getModuleFromType(object.structureType);
                if (module) {
                    module.move(object, Game.flags[flagName]);
                }
            }
        } // for
    },

    getModuleFromType (structureType) {
        if (STRUCTURE_LINK == structureType
            || STRUCTURE_TERMINAL == structureType
            || STRUCTURE_LAB == structureType) {
            var name = "building." + structureType;
            return require(name);
        }  else {
            return undefined;
        }

    }

};

module.exports = buildingBase;