module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
		let container = Game.getObjectById(creep.memory.container);
		let storage = creep.room.storage;
		if(creep.carry[RESOURCE_ENERGY] != creep.carryCapacity) {
	                if(Game.flags[creep.name] != undefined) {
	                        var range = creep.pos.getRangeTo(Game.flags[creep.name]);
	                        if(range > 0) {
	                                creep.moveTo(Game.flags[creep.name]);
	                                return;
	                        }
	                }
					
			if(creep.memory.container == null) {
				creep.memory.container = null;
			}
			if(creep.memory.container == null || container == null) {
		          	container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
					});
			}
			if(container != null) {
				creep.withdraw(container, RESOURCE_ENERGY);
			} else {
				console.log("Fuck " + creep.name + "can't find his container");
				return;
			}

		}else {
			if(creep.pos.getRangeTo(storage) > 1) {
				creep.moveTo(storage);
				return;
			} else {
				creep.transfer(storage, RESOURCE_ENERGY);
			}
			

		}
    }
};
