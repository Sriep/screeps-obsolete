/**
 * Created by Piers on 25/07/2016.
 */
/**
 * Created by Piers on 21/07/2016.
 */
/**
 * @fileOverview Screeps module. Abstract object for handling the foreign
 * harvest policy.
 * @author Piers Shepperson
 */
"use strict";
var policy = require("policy");
var roomBase = require("room.base");
/**
 /**
 * Abstract object to support the policy of minig a source in an unoccumpied
 * room
 * @module flagLink
 */
var flagLink = {

    run: function (flag) {
       // console.log(flag,"flagLink run",JSON.stringify(flag));
        if (!flag.room || !flag.memory)
            return;
        if ( roomBase.isMyRoom(flag.pos.roomName)) {
            if (flag.room.storage) {
                if (flag.pos.inRangeTo(flag.room.storage, 2)) {
                    flag.memory.isStorageLink = true;
                } else {
                    flag.memory.isStorageLink = false;
                }
            }
            if (flag.room.terminal) {
                if (flag.pos.inRangeTo(flag.room.terminal, 2)) {
                    flag.memory.isTerminalLink = true;
                } else {
                    flag.memory.isTerminalLink = false;
                }
            }
            if (!flag.memory.isStorageLink) {

                var links = flag.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_LINK }
                });
               // console.log(flag,"flag link list of links in room",links);
                for ( var i = 0 ; i < links.length ; i++ ) {
                    var linkFlag = Game.flags[links[i].id];
                 //   console.log(flag,"flag link in for i",i,"linkFlag",linkFlag);
                    if (linkFlag && linkFlag.memory) {
                        if (linkFlag.memory.isStorageLink ) {
                            flag.memory.nextLinkId = linkFlag.name;
                            break;
                        }
                        //else if( linkFlag.memory.isTerminalLink )
                        //    flag.memory.nextLinkId = linkFlag.name;
                    }
                } //for
            } // if (!flag.memory.isStorageLink)
        } // if ( roomBase.isMyRoom(flag.pos.roomName))
    }



};

module.exports = flagLink;






























