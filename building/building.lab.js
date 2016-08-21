/**
 * Created by Piers on 19/08/2016.
 */
/**
 * @fileOverview Screeps module. Abstract base object containing data and
 * functions for claimer creeps.
 * @author Piers Shepperson
 */
"use strict";
var labColours = require("lab.colours");
var gc = require("gc");
/**
 * Abstract base object containing data and functions for use by my claimer
 * creeps.
 * @module buildingLink
 */
var buildingLab = {

    move: function(lab, flag) {
        var resourceId = labColours.resource(flag.color, flag.secondaryColor );
        //console.log(lab,"resouceid",resourceId, flag.color, flag.secondaryColor);
        if (resourceId) {
            var reagents = this.reagents(resourceId);
            if (reagents) {
                var lab1s = lab.room.find(FIND_STRUCTURES, {
                    filter: function(l) {
                        return l.structureType == STRUCTURE_LAB
                            && l.mineralType == reagents[0]
                            && l.mineralAmount > 0
                            && lab.pos.inRangeTo(l, gc.RANGE_REACTION) ;
                    }
                });
                var lab2s = lab.room.find(FIND_STRUCTURES, {
                    filter: function(l) {
                        return l.structureType == STRUCTURE_LAB
                            && l.mineralType == reagents[1]
                            && l.mineralAmount > 0
                            && lab.pos.inRangeTo(l, gc.RANGE_REACTION);
                    }
                });
                if (lab1s.length>0 && lab2s.length>0) {
                    lab.runReaction(lab1s[0], lab2s[0]);
                }
            }
        }
    },

    reagents: function(resourceId) {
        var r1, r2;
        for ( var i in REACTIONS) {
            for ( var j in REACTIONS[i] ) {
                if (REACTIONS[i][j] == resourceId) {
                    return [ i, j ];
                }
            }
        }
        return undefined;
    },

};

module.exports = buildingLab;




















