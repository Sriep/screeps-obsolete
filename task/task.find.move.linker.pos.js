/**
 * Created by Piers on 22/07/2016.
 */
/**
 * Created by Piers on 07/07/2016.
 */
/**
 * Created by Piers on 05/07/2016.
 */
"use strict";

/**
 * @fileOverview Screeps module. Task harvest object.
 * @author Piers Shepperson
 */
var gc = require("gc");
var gf = require("gf");
var tasks = require("tasks");
var TaskMovePos = require("task.move.pos");
var TaskFlexiLink = require("task.flexi.link");

/**
 * Task harvest object.
 * @module TaskFindMoveLinkerPos
 */


function TaskFindMoveLinkerPos (flagName) {
    this.taskType = gc.TASK_FIND_MOVE_LINKER_POS;
    this.conflicts = gc.MOVE;
    this.flagName = flagName;
    this.pickup = true;
    this.loop = true;
}

TaskFindMoveLinkerPos.prototype.doTask = function(creep, task) {
  //  console.log(creep, "In TaskFindMoveLinkerPos task", JSON.stringify(task));
    var flag = Game.flags[task.flagName];
   // console.log(creep, "In TaskFindMoveLinkerPos", task.flagName
   //     , creep.room.name, "==?" , flag.pos.roomName);
    if (!task.flagName) return gc.RESULT_UNFINISHED;
    if (creep.room.name != flag.pos.roomName) return gc.RESULT_ROLLBACK;
  //  console.log("berfore  var homePos = this.findHomePosition(creep, task);");

    var homePos = this.findHomePosition(creep, task);
    ///console.log(creep,"findHomoePosition",homePos);
    var newTaskList = [];
    var moveToSource;
    if (homePos) {
        moveToSource = new TaskMovePos(homePos,0)
    } else {
        moveToSource = new TaskMovePos(flag.pos,1)
    }
    moveToSource.loop = false;
    var flexiLink = new TaskFlexiLink(task.flagName);
    newTaskList.push(moveToSource);
    newTaskList.push(flexiLink);
    creep.memory.tasks.tasklist = newTaskList;
   // console.log(creep,"TaskFindMoveLinkerPos reset task lists at end of doTask");
    return  gc.RESULT_RESET;
};

TaskFindMoveLinkerPos.prototype.findHomePosition = function (creep, task) {
    var flag = Game.flags[task.flagName];
    flag.memory.mainDumpId = undefined
    flag.memory.mainDumpType = undefined;
    flag.memory.alternateLinkId = undefined;
    flag.memory.alternateLinkType = undefined;
    var homePos;

    homePos = findLinkPos(flag,STRUCTURE_STORAGE,STRUCTURE_LINK, STRUCTURE_TERMINAL);
   // console.log(creep,"TaskFindMoveLinkerPos", homePos);
    if (homePos) {
        if (flag.memory.alternateLinkType == STRUCTURE_LINK) {
            if (flag.memory.type == gc.FLAG_SOURCE) {
                flag.memory.linkType = gc.LINKER_LINK_DUMP;
            } else {
                flag.memory.linkType = gc.LINKER_DUMP_LINK_DUMP;
            }
        } else {
            flag.memory.linkType = gc.LINKER_DUMP;
        }
     //   console.log("STRUCTURE_STORAGE,STRUCTURE_LINK, STRUCTURE_TERMINAL");
        return homePos
    }
 //   console.log(creep,"about to look",STRUCTURE_TERMINAL, STRUCTURE_LINK, STRUCTURE_CONTAINER);
    homePos = findLinkPos(flag,STRUCTURE_TERMINAL, STRUCTURE_LINK, STRUCTURE_CONTAINER);
    if (homePos) {
        if (flag.memory.alternateLinkType == STRUCTURE_LINK) {
            if (flag.memory.type == gc.FLAG_SOURCE) {
                flag.memory.linkType = gc.LINKER_LINK_DUMP;
            } else {
                flag.memory.linkType = gc.LINKER_DUMP_LINK_DUMP;
            }
        } else {
            flag.memory.linkType = gc.LINKER_LINK_LINK;
        }
        return homePos
    }
   // console.log(creep,"about to look",STRUCTURE_LINK, STRUCTURE_CONTAINER);
    homePos = findLinkPos(flag,STRUCTURE_LINK, STRUCTURE_CONTAINER);
    if (homePos) {
        flag.memory.linkType = gc.LINKER_LINK_LINK;
       // console.log("STRUCTURE_LINK,STRUCTURE_CONTAINER, ");
        return homePos;
    }
    homePos = findLinkPos(flag,STRUCTURE_CONTAINER);
    if (homePos) {
        flag.memory.linkType = gc.LINKER_REPAIR_DUMP;
        return homePos;
    }
    var sites = flag.pos.findInRange(FIND_CONSTRUCTION_SITES,2, {
        filter: function(site) {
            return site.structureType == STRUCTURE_CONTAINER
                || site.structureType == STRUCTURE_STORAGE
                || site.structureType == STRUCTURE_LINK
                || site.structureType == STRUCTURE_TERMINAL
        }
    });
  //  console.log(creep,"TaskFindMoveLinkerPos looking for construction sites",sites.length, sites);
    for ( var i in sites) {
        var pointsBetween = gf.joinPointsBetween(sites[i].pos, flag.pos);
       // console.log(creep,"points between", JSON.stringify(pointsBetween) );
        if (pointsBetween.length > 0) {
            flag.memory.mainDumpId = sites[i].id;
            flag.memory.linkType = gc.LINKER_BUILD;
            return pointsBetween[0];
        }
    }
    return flag.memory.linkType = undefined;//"I woz ere";//undefined;
};


var findLinkPos = function (flag, mainStructType, secondStructType, thirdStructType) {
    var homePos;
 //   console.log(flag,"before structureTypeInRange");
    var mainStructs = gf.structureTypeInRange(flag.pos, mainStructType, 2);
  //  console.log(flag.pos,"in findLinkPos sturture types",mainStructType,secondStructType,"main structs", mainStructs);
    if (mainStructs.length > 0) {
        var possibleSites = gf.joinPointsBetween(mainStructs[0].pos, flag.pos);
       // console.log(flag.pos,"findLinkPos",possibleSites.length, possibleSites);
        if (possibleSites.length > 0) {
            homePos = possibleSites[0];
            flag.memory.mainDumpId = mainStructs[0].id;
            flag.memory.mainDumpType = mainStructType;

        //if (possibleSites.length > 1 && secondStructType) {
            for ( var i = 0 ; i < possibleSites.length ; i++ ) {
                var secondStructs = gf.structureTypeInRange(possibleSites[i], secondStructType, 1);
              //  console.log(flag.pos,"findLinkPos secondStructs",secondStructs);
                if (secondStructs.length > 0) {
                    homePos = possibleSites[i];
                    flag.memory.mainDumpId = mainStructs[0].id;
                    flag.memory.mainDumpType = mainStructType;
                    flag.memory.alternateLinkId = secondStructs[0].id;
                    flag.memory.alternateLinkType = secondStructType;
                }
                if (thirdStructType) {
                    var thirdStructs = gf.structureTypeInRange(possibleSites[i], thirdStructType, 1);
                    if (thirdStructs.length > 0 && homePos === undefined) {
                        homePos = possibleSites[i];
                        flag.memory.mainDumpId = mainStructs[0].id;
                        flag.memory.mainDumpId  = mainStructType;
                        flag.memory.alternateLinkId = thirdStructs[0].id;
                        flag.memory.alternateLinkType = thirdStructType
                    }
                }
            } //for

        } //else if

    } // if
    //console.log(flag.pos,"end of findLinkPos",homePos);
    return homePos;
};

/*
TaskFindMoveLinkerPos.prototype.findHomePosition1 = function (creep, task) {
    var flag = Game.flags[task.flagName];
    var dumpId = flag.memory.dumpId;
    var operatedLink = flag.memory.operatedLink;
    var transferLink = flag.memory.transferFromLink;

    var homePos; //What we are trying to find.
    if (!task.flag) return gc.RESULT_FAILED;
    if (creep.room.name != flag.pos.roomName) return gc.RESULT_ROLLBACK;
    var links;
    var storage = gf.structureTypeInRange(flag.pos, STRUCTURE_STORAGE, 2);
    if (storage.length > 0) {
        var possibleSites = gf.joinPointsBetween(creep.room.storage.pos, flag.pos);
        if (possibleSites.length = 1) {
            homePos = possibleSites[0];
        } else if (possibleSites.length > 1) {
            for (i = 0; i < possibleSites.length; i++) {
                links = gf.structureTypeInRange(possibleSites[i], STRUCTURE_LINK, 1);
                if (links.length > 0) {
                    homePos = possibleSites[i];
                    transferLink = links[0].id;
                    dumpId = storage[0];
                }
                if (gf.structureTypeInRange(possibleSites[i], STRUCTURE_TERMINAL, 1).length > 0
                    && homePos === undefined) {
                    homePos = possibleSites[i];
                }
            }
        }
    }

    links = gf.structureTypeInRange(flag.pos, STRUCTURE_LINK, 2);
    if (links.length > 0) {
        possibleSites = gf.joinPointsBetween(links[0].pos, flag.pos);
        if (possibleSites.length = 1) {
            homePos = possibleSites[0];
        } else if (possibleSites.length > 1) {
            for (i = 0; i < possibleSites.length; i++) {
                if (gf.structureTypeInRange(possibleSites[i], STRUCTURE_TERMINAL, 1).length > 0) {
                    homePos = possibleSites[i];
                    dumpId = links[0];
                }
                if (gf.structureTypeInRange(possibleSites[i], STRUCTURE_CONTAINER, 1).length > 0
                    && homePos === undefined) {
                    homePos = possibleSites[i];
                }
            }
        }
    }

    var terminal  = gf.structureTypeInRange(flag.pos, STRUCTURE_TERMINAL, 2);
    if (links.length > 0) {
        possibleSites = gf.joinPointsBetween(links[0].pos, flag.pos);
        if (possibleSites.length = 1) {
            homePos = possibleSites[0];
        } else if (possibleSites.length > 1) {
            for (i = 0; i < possibleSites.length; i++) {
                if (gf.structureTypeInRange(possibleSites[i], STRUCTURE_CONTAINER, 1).length > 0) {
                    homePos = possibleSites[i];
                }
            }
        }
    }

    var containers = gf.structureTypeInRange(flag.pos, STRUCTURE_CONTAINER, 2);
    if (containers.length > 0) {
        possibleSites = gf.joinPointsBetween(links[0].pos, flag.pos);
        if (possibleSites.length > 0) {
            homePos = possibleSites[0];
        }
    }
}*/

module.exports = TaskFindMoveLinkerPos;





































