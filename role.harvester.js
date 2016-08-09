module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn();
                        return;
                }
	creep.setupSpawn();
	creep.setupFlag();
	creep.setRespawnTime();
        // if creep is bringing energy to a structure but has no energy left
	creep.memory.currentRole = "harvester";
        let energy = creep.pos.lookFor(LOOK_ENERGY);
		if(energy.length) {
			creep.pickup(energy[0])
                        }
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.source = null;
        }

        if (creep.memory.working == true) {
		if(creep.carry.energy < creep.carryCapacity && creep.pos.getRangeTo(creep.room.storage) < 2) {
			creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
		}
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION
 			     || s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
			     && s.isBeingHandled(creep) == false
            });
	    if (structure == null) {
		structure = Game.flags["upgraderContainer"].pos.findClosestByRange(FIND_STRUCTURES, {
			filter:(s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < 1000 && s.isBeingHandled(creep) == false
			
		 }); 
		if(structure != null && structure.pos.getRangeTo(Game.flags["upgraderContainer"].pos) > 2) {
			structure = null;
		}
	    }	
		
		
            if (structure == null) {
             	structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE
                             && s.store[RESOURCE_ENERGY] < s.storeCapacity && s.id != creep.memory.pulledfrom)

            });
	    }

            // if we found one
            if (structure != null) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
		structure.iGotIt(creep);
            } else {
		if(creep.carry.energy == creep.carryCapacity) {
			creep.customharvest();
		} else {
			creep.approachAssignedFlag(0);
		}
	    }
        }
        // if creep is supposed to harvest energy from source
        else {
		creep.customharvest();
        }
    }
};
