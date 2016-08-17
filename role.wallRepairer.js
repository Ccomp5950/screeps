var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
	    creep.memory.repair = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source  = null;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find all walls in the room
	    var wallMinHealth = Memory.wallMinHealth;
	    if(creep.room.memory != undefined && creep.room.memory.wallMinHealth != undefined) {
		wallMinHealth = creep.room.memory.wallMinHealth;
	    }

            var target = Game.getObjectById(creep.memory.repair);
	    if(Game.time % 5 == 0) target = undefined;
	    if(target == undefined) {
		    target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_WALL && s.hits < wallMinHealth).min(s=>s.hits);
		    if(target != undefined) {
   			    creep.memory.repair = target.id;
		    }
	   }
            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
		creep.customharvest();
        }

    }
};
