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
	    let link = Game.getObjectById(creep.memory.link);
	    if(link != null && creep.pos.getRangeTo(link) <= 1 && link.energy > 10) {
                        creep.withdraw(link, RESOURCE_ENERGY);
			return;
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
		let links = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType == STRUCTURE_LINK
		});
		if(links.length > 0) {
			let link = link[0];
			if(link.energy > 10) {
				creep.withdraw(link, RESOURCE_ENERGY);
				creep.memory.link = link.id;
				return;
			}
		}
		
		});
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
