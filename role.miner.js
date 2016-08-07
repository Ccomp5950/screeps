module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn()
                        return;
                }

		creep.setupFlag();
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}
		var structure = null;
		if(creep.memory.container == undefined || creep.memory.container == null) {
			creep.memory.container = -1;
		}
		if(creep.memory.container == null || Game.getObjectById(creep.memory.container) == null) {
	          	structure = creep.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
	            });
			if(structure.length) {
				structure = structure[0]
			}
		} else {
			structure = Game.getObjectById(creep.memory.container)
		}
	    
		if(creep.carry[RESOURCE_ENERGY] < 50) {
			creep.mine();
		}
                if(creep.pos.getRangeTo(structure) > 1) {
			game.memory.container = null;
			structure = null;
                        }
		if (structure != null) {
			if(creep.pos.getRangeTo(structure) > 1) {
				game.memory.container = null;
				return;
			}
			creep.memory.container = structure.id;
	                // try to transfer energy, if it is not in range
			if(structure.hits < structure.hitsMax) {
				creep.repair(structure);
				return;
			}
	               	creep.transfer(structure, RESOURCE_ENERGY); 
		} else {
			structure = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
			if(structure != null) {
				if(creep.build(structure) == OK) {
					return;
				}
				
			}
			creep.drop(RESOURCE_ENERGY);
		}
    }
};
