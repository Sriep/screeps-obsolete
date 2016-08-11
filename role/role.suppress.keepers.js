/**
 * Created by Piers on 09/08/2016.
 */
/**
 * Created by Piers on 18/07/2016.
 */
var gc = require("gc");
var TaskMoveRoom = require("task.move.room");
var TaskSuppressKeepers = require("task.suppress.keepers");

var roleGift = {

    getTaskList: function(creep,keeperRoomName,) {
        var taskList = [];
        var moveToLocation = new TaskMoveRoom(keeperRoomName);
        var suppressKeeper = new TaskSuppressKeepers();
        taskList.push(moveToLocation);
        taskList.push(suppressKeeper);
        return taskList;
    }

};

module.exports = roleGift;
