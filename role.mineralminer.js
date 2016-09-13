module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn()
			creep.memory.extractor = -1;
                        return;
                }

		creep.setupFlag();

		let carry = _.sum(creep.carry);
		if (creep.memory.working == true && carry == 0 && creep.getActiveBodyparts(CARRY) > 0) {
			creep.memory.working = false;
		}
		else if (creep.memory.working == false && carry == creep.carryCapacity) {
			creep.memory.working = true;
		}






		if(!creep.memory.working) {
	                if(creep.approachAssignedFlag(0) == false) {
	                        return;
	                }
			let extractor = Game.getObjectById(creep.memory.extractor);
			if(extractor != undefined) {
				creep.harvest(extractor);
			} else {
				extractor = creep.pos.findClosestByRange(FIND_MINERALS);
				if(extractor != undefined) {
					creep.harvest(extractor);
					creep.memory.extractor = extractor.id;
				} else {
					console.log("[" + creep.name + "] Cannot locate their extractor");
					return;
				}
			}

		} else {
			let storage = creep.room.storage;
			let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.pos.getRangeTo(creep) <= 1 && s.structureType == STRUCTURE_CONTAINER})
			
			if(container != undefined) {
				if(_.sum(container.store) < container.storeCapacity) {
		                        for(items in creep.carry) {
		                                creep.transfer(container,items);
		                        }
				}
			return;				
			}
			
			if(storage != undefined) {
				if(creep.pos.getRangeTo(storage) > 1) {
					creep.moveTo(storage);
					return;
				}
			} else {
				console.log("[" + creep.name + "] Cannot locate their storage");
				return;
			}
			for(items in creep.carry) {
				creep.transfer(storage,items);
			}
		}
	}
}
