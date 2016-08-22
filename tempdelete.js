/**
 * Created by Piers on 22/08/2016.
 */


findRepairTargetInRange: function(creep) {
    var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, gc.RANGE_REPAIR, {
        filter: function(object) {
            return object.hits < object.hitsMax
                && object.hitsMax - object.hits > REPAIR_POWER;
        }
    });
    repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
    if (repairTargets.length > 0)
        creep.repair(repairTargets[0]);
},

findBuildTargetInRange: function(creep) {
    var buildTargets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, gc.RANGE_BUILD);
    if (buildTargets.length > 0)
        return buildTargets[0];
    else
        return undefined;
},

moveAndRepair: function(creep, target) {
    var repairTarget = this.findRepairTargetInRange(creep);
    if(repairTarget)  creep.repair(repairTarget);
    else {
        var buildTarget = this.findBuildTargetInRange(creep);
        //console.log(creep,"build target",buildTarget);
        if (buildTarget) {
            creep.build(buildTarget);
        }
    }
    return creep.moveTo(target);
},


action: function(creep, target) {
    return stats.repair(creep,target);
}