/**
 * Created by Piers on 05/07/2016.
 */
"use strict";
/**
 * @fileOverview Screeps module. Actions a creep has done this tick.
 * @author Piers Shepperson
 */
var gc = require("gc");
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
    Harvest: gc.HARVEST,
    Pickup: gc.PICKUP,
    Dismantle: gc.DISMANTLE,
    Build: gc.BUILD,
    Drop: gc.DROP,
    Repair: gc.REPAIR,
    Transfer: gc.TRANSFER,
    Upgrade: gc.UPGRADE_CONTROLLER,
    Claim: gc.CLAIM,
    Reserve: gc.REVERSE,
    AttackController: gc.ATTACK_CONTROLLER,
    Attack: gc.ATTACK,
    RangedAttack: gc.RANGED_ATTACK,
    RangedHeal: gc.RANGED_HEAL,
    Heal: gc.HEAL,
    MassAttack: gc.MASS_ATTACK,
    Move: gc.MOVE,
    Suicide: gc.SUICIDE,
    Withdraw: gc.WITHDRAW
};

TaskActions.prototype.isConflict =  function(prevActions, nextAction ) {
   // console.log("TaknAcions conflict does", JSON.stringify(prevActions) ,"conflict with",nextAction);
    if (prevActions.actions.has(nextAction))
        return true;
    if (nextAction == this.Creep.Harvest)
        return prevActions.actions.has(this.Creep.Attack) ||  prevActions.actions.has(this.Creep.Build)
                || prevActions.actions.has(this.Creep.Repair) || prevActions.actions.has(this.Creep.RangedHeal)
                || prevActions.actions.has(this.Creep.Heal);
    if (nextAction == this.Creep.Attack)
        return prevActions.actions.has(this.Creep.Build) || prevActions.actions.has(this.Creep.Repair)
            || prevActions.actions.has(this.Creep.RangedHeal)  || prevActions.actions.has(this.Creep.Heal);
    if (nextAction == this.Creep.Build)
        return  prevActions.actions.has(this.Creep.Repair) || prevActions.actions.has(this.Creep.RangedHeal)
            || prevActions.actions.has(this.Creep.Heal);
    if (nextAction == this.Creep.Repair)
        return   prevActions.actions.has(this.Creep.RangedHeal) || prevActions.actions.has(this.Creep.Heal);
    if (nextAction == this.Creep.RangedHeal)
        return  prevActions.actions.has(this.Creep.Heal);

    if (nextAction == this.Creep.RangedAttack)
        return prevActions.actions.has(this.Creep.MassAttack) || prevActions.actions.has(this.Creep.Build)
            || prevActions.actions.has(this.Creep.Repair)  || prevActions.actions.has(this.Creep.RangedHeal);
    if (nextAction == this.Creep.MassAttack)
        return  prevActions.actions.has(this.Creep.Repair) || prevActions.actions.has(this.Creep.Build)
            || prevActions.actions.has(this.Creep.RangedHeal);
    if (nextAction == this.Creep.Build)
        return   prevActions.actions.has(this.Creep.Repair) || prevActions.actions.has(this.Creep.RangedHeal);
    if (nextAction == this.Creep.Repair)
        return  prevActions.actions.has(this.Creep.RangedHeal);
};
/*
TaskActions.prototype.done = function(prevActios, newAction) {
    console.log("TaknAcions is deond bfore", JSON.stringify(newAction));
    var rtv = prevActios.actions.add(newAction);
    console.log("TaknAcions is done after", JSON.stringify(newAction));
    return rtv;
};*/

module.exports = TaskActions;
/**
 * Created by Piers on 05/07/2016.
 */
































