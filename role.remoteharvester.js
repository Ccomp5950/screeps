module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
	    if(creep.ticksToLive < 400) {
	        creep.memory.restoring = true;
		creep.getRestored();
		return;
	    }
        }
	
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source = null;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
	    
                if(Game.flags["Home"] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags.Home);
                        if(range > 9) {
                                creep.moveTo(Game.flags.Home);
				return;
                        }
                }

             	var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER)
                             && s.store[RESOURCE_ENERGY] < s.storeCapacity
            });
	    

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
		if(creep.memory.restoring == true) {
			creep.getRestored();
			return;
		}
                if(Game.flags[creep.name] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags[creep.name]);
                        if(range > 2) {
                                creep.moveTo(Game.flags[creep.name]);
				return;
                        }
                }
		creep.customharvest();
        }
    }
};
