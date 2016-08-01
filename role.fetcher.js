module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
		
		let container = Game.getObjectById(creep.memory.container);
		let storage = creep.room.storage;
		if(container != null && container.store[RESOURCE_ENERGY] < creep.carryCapacity) {
			creep.memory.switchOnce = true;
		} else {
			
		}
		
	        if(creep.ticksToLive < 100) {
	                creep.memory.restoring = true;
	                creep.getRestored();
                return;
		}
		let flag = Game.flags[creep.name];
		if(creep.memory.switchOnce == true) {
			container = null;
			let num = parseInt(creep.name.substr(creep.name.length - 1));
			if(num  % 2 == 0) {
				flag = Game.flags["fetcher1"];
			} else {
				flag = Game.flags["fetcher2"];
			}
		}

		if(creep.carry[RESOURCE_ENERGY] != creep.carryCapacity) {
	                if(flag != undefined) {
	                        var range = creep.pos.getRangeTo(flag);
	                        if(range > 1) {
	                                creep.moveTo(flag);
	                                return;
	                        }
	                }
					
			if(creep.memory.container == null) {
				creep.memory.container = null;
			} else {
			}

			if(creep.memory.container == null || container == null || creep.memory.switchOnce == true) {
		          	container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
					});
			}
			if(container != null) {
				if(creep.memory.container == null) {
					creep.memory.container = container.id
				}
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
				creep.memory.switchOnce = false;
			}
			

		}
    }
};
