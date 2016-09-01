module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn();
                        return;
                }
	creep.setupFlag();
        // if creep is bringing energy to the controller but has no energy left
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

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
	    let container = Game.getObjectById(creep.memory.container);
	    if(container != null && creep.pos.getRangeTo(container) < 2 && container.store[RESOURCE_ENERGY] > 10) {
			creep.withdraw(container, RESOURCE_ENERGY);
	    }
        }
        // if creep is supposed to harvest energy from source
        else {
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}
		let container = Game.getObjectById(creep.memory.container);
		if(container == null ) {
				container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 10)
				});
		}

		if(container != null && creep.pos.getRangeTo(container) < 2 && container.store[RESOURCE_ENERGY] > 10) {
			if(creep.memory.container == null) {
				creep.memory.container = container.id
			}
			creep.withdraw(container, RESOURCE_ENERGY); 
			
			
		} else {
			creep.memory.container = null;
		}
	}

    }
};
