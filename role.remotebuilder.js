module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
	creep.setupFlag();
	if(creep.approachAssignedFlag(999) == false) {
		return;
	}
	creep.getAwayFromEdge();

        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
            creep.memory.build = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
	    creep.memory.source = null;
	    creep.memory.container = null;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = null;
	    if(creep.memory.build == null || Game.getObjectById(creep.memory.build) == undefined) {
		creep.memory.build = null;
		constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
		if(constructionSite) {
			creep.memory.build = constructionSite.id
		}
	    }
	    if(creep.memory.build != null) {
		    constructionSite = Game.getObjectById(creep.memory.build)
	            // if one is found
	            if (constructionSite != undefined) {
	                // try to build, if the constructionSite is not in range
	                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
	                    // move towards the constructionSite
	                    creep.moveTo(constructionSite);
	                }
	            }
	    } else {
		creep.approachAssignedFlag(1);
                return;
		}
	}
        // if creep is supposed to harvest energy from source
        else {
			var container = Game.getObjectById(creep.memory.container);
			if(container != null && container.store[RESOURCE_ENERGY] <= 30) {
				container = null;
				creep.memory.container = null;
			}
			if(container == null) {
				container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 20) ,maxRooms:1
                                        });
                        }
                        if(container != null && creep.pos.getRangeTo(container) < 999) {
				creep.memory.container = container.id;
                                        creep.memory.container = container.id
                                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(container);
                                };
                        } else {
                                creep.memory.container = null;
                                var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 3);
                                if(target) {
                                        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                                                creep.moveTo(target);
                                        }
                                }
                        }
		}
        
    }
};
