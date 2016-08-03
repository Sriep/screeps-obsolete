# Screeps AI #
This is my screeps library. Designed as a platform for developing screeps AI software. Still in development.
It has been tested with my ongoing game and the simulation room training mode. But otherwise, stability cannot be guaranteed.

## Usage
Clone repository to your machine then use  [Grunt](http://support.screeps.com/hc/en-us/articles/203022512-Committing-local-scripts-using-Grunt)
to upload to your screeps game.

## Features
Currently, consists of several 'class libraries'

## Tasks
- These are in their simplest form a wrapper around [creep methods](http://support.screeps.com/hc/en-us/articles/203013212-Creep) but can get much more complex.
- Each exposes a doTask function which is called during the move creeps phase if the task is due to be carried out.
- Tasks are designed to be used with roles.

## Roles
These represent an array of tasks which perform some useful function.
- Each tick the doTask methods from the task at the head of the array are called until a stop criterion is found.
- A role's array of tasks can be self-modifying, however, in this case, there will typically be one key task that is central to the role.

## Routes
Encapsulates the build queue for a room.
- The route.base node represent the build queues.
- The other route. nodes represent individual build items.

## Routes
Encapsulates the build queue for a room. 
- The route.base node represent the build queues. 
- The other route. nodes represent individual build items.
- They are designed to be linked to roles.

## Flags
This library organises information about game objects.
- Each game permanent viewed is flagged. This allows the memory of objects in neutral rooms that you might loose view of.
- Sources and minerals with extractors have harvesting information stored in their flags. Including which room should harvest the resource.
- Controllers in neutral rooms have information about whether they should be reserved or not, with details about which room is designated to build the creep to perform this.

## Race
Library of the various types of creeps used catalogued by body type.

## Policy
This is where custom user code is designed to be put.
- Each policy is run once per tick with handlers so that a finite state system can be set up.
- The economy for each room is run using policies.
- These special room policies are where the requests in the flags are enacted.

## Main game loop.
As shown below each tick. Memory on dead ticks are freed. 
- Each policy is enacted then all the creeps are moved. 
- At intervals each visible room examined and flags placed on important objects, this is a quick process and ROOM_UPDATE_RATE can probably be set to 1.
- At a different interval, each flag is processed with information about how the flagged object should be interacted with. This is a time-consuming process that does not need to be carried out that often, so FLAG_UPDATE_RATE can be quite long.

```javascript
    if (Game.time % gc.ROOM_UPDATE_RATE == 0 ){
         roomBase.examineRooms(true);
    }
    if (Game.time % gc.FLAG_UPDATE_RATE == 0 ){
        flagBase.run();
    }
    freememory.freeCreeps();
    policy.enactPolicies();
    raceBase.moveCreeps();
```

## Creeps
Creeps are not meant to be moved directly either in Policies or elsewhere.
Instead, they should be given roles or task lists and sent on their way.
The raceBase.moveCreeps method then does all the work.
Of course in an emergency feel free to take control of and micromanage individual creeps.

