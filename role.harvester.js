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
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source = null;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
		if(creep.carry.energy < creep.carryCapacity && creep.pos.getRangeTo(creep.room.storage) < 2) {
			creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
		}
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION
 			     || s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_TOWER)
				
                             && s.energy < s.energyCapacity
            });
	    if (structure == null) {
		structure = Game.flags["upgraderContainer"].pos.findClosestByRange(FIND_STRUCTURES, {
			filter:(s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < 1000
			
		 }); 
		if(structure.pos.getRangeTo(Game.flags["upgraderContainer"].pos) > 2) {
			structure = null;
		}
	    }	
		
		
            if (structure == null) {
             	structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE
                             && s.store[RESOURCE_ENERGY] < s.storeCapacity && s.id != creep.memory.pulledfrom)
		//		|| (s.structureType == STRUCTURE_SPAWN
		//	     && s.energy < s.energyCapacity)

            });
	    }

            // if we found one
            if (structure != null) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
		creep.customharvest();
        }
    }
};
