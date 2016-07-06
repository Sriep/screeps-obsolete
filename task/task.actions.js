/**
 * Created by Piers on 05/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Actions a creep has done this tick.
 * @author Piers Shepperson
 */

/**
 * Actions a creep has done this tick. Useful for determine what tasks are still
 * possible.
 * @module TaskActions
 */


function TaskActions (unitType) {
    this.unitType = unitType;
    this.actions = new Set();
}

TaskActions.prototype.Unit = {
    Creep: "creep"
  //  Tower: "tower",
  //  Spawn: "spawn",
  //  Link: "link"
};

TaskActions.prototype.Creep = {
    Harvest: "harvest",
    Pickup: "pickup",
    Dismantle: "dismantle",
    Build: "build",
    Drop: "drop",
    Repair: "repair",
    Transfer: "transfer",
    Upgrade: "upgrade",
    Claim: "claim",
    Reserve: "reverse",
    AttackController: "attack.controller",
    Attack: "attack",
    RangedAttack: "ranged.attack",
    RangedHeal: "ranged.heal",
    Heal: "heal",
    MassAttack: "mass.attack",
    Move: "move",
    Suicide: "suicide"
};

TaskActions.prototype.isConflict =  function(newAction) {
    if (this.actions.has(newAction))
        return true;
    if (newAction == this.Creep.Harvest)
        return this.actions.has(this.Creep.Attack) ||  this.actions.has(this.Creep.Build)
                || this.actions.has(this.Creep.Repair) || this.actions.has(this.Creep.RangedHeal)
                || this.actions.has(this.Creep.Heal);
    if (newAction == this.Creep.Attack)
        return this.actions.has(this.Creep.Build) || this.actions.has(this.Creep.Repair)
            || this.actions.has(this.Creep.RangedHeal)  || this.actions.has(this.Creep.Heal);
    if (newAction == this.Creep.Build)
        return  this.actions.has(this.Creep.Repair) || this.actions.has(this.Creep.RangedHeal)
            || this.actions.has(this.Creep.Heal);
    if (newAction == this.Creep.Repair)
        return   this.actions.has(this.Creep.RangedHeal) || this.actions.has(this.Creep.Heal);
    if (newAction == this.Creep.Repair)
        return  this.actions.has(this.Creep.Heal);

    if (newAction == this.Creep.RangedAttack)
        return this.actions.has(this.Creep.MassAttack) || this.actions.has(this.Creep.Build)
            || this.actions.has(this.Creep.Repair)  || this.actions.has(this.Creep.RangedHeal);
    if (newAction == this.Creep.MassAttack)
        return  this.actions.has(this.Creep.Repair) || this.actions.has(this.Creep.Build)
            || this.actions.has(this.Creep.RangedHeal);
    if (newAction == this.Creep.Build)
        return   this.actions.has(this.Creep.Repair) || this.actions.has(this.Creep.RangedHeal);
    if (newAction == this.Creep.Repair)
        return  this.actions.has(this.Creep.RangedHeal);
    };

TaskActions.prototype.done = function(action) {
    return this.actions.add(action);
};

module.exports = TaskActions;
/**
 * Created by Piers on 05/07/2016.
 */
































