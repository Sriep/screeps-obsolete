/**
 * Created by Piers on 31/07/2016.
 */

if (Game.time == 12458750  ) {
    var raceClaimer = require("race.claimer");
    var RouteRemoteActions = require("route.remote.actions");
    var actions = {
        room: "W25S19",
        action: "claimController",
        findFunction: "findController",
        findFunctionsModule: "policy.remote.actions"
    };
    var claimerBody = raceClaimer.body(1);
    var order = new RouteRemoteActions(
        "W26S21",
        actions,
        claimerBody,
        0,
        0,
        undefined,
        1
    );
    routeBase.attachRoute("W26S21", gc.ROUTE_GIFT_CREEP,order,3);
}