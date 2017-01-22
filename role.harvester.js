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
	if(creep.approachAssignedFlag(999) == false) {
		return;
	}
        let carry = _.sum(creep.carry);
        if (creep.memory.working == true && carry == 0) {
            // switch state
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && carry == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.source = null;
        }

        if (creep.memory.working == true) {
		if(carry < creep.carryCapacity && creep.pos.getRangeTo(creep.room.storage) < 2) {
			creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
			creep.memory.pulledfrom = creep.room.storage.id;
		}
		var structure = Game.getObjectById(creep.memory.structure);
		if(structure != null) {
			if(structure.energy == structure.energyCapacity)
			structure = null;
			creep.memory.structure = null;
		}
		// Test if we even need to do any of this shit.
		var fillStructures = creep.room.find(FIND_STRUCTURES, {
                                filter: (s) => creep.carry.energy > 0 && ((s.structureType == STRUCTURE_EXTENSION
					                                     || s.structureType == STRUCTURE_SPAWN
									     || s.structureType == STRUCTURE_LAB
									     || (s.structureType == STRUCTURE_TOWER && s.my == true)
										)    && s.energy < s.energyCapacity
				                                     && s.isBeingHandled(creep) == false
			                                             && s.id != creep.memory.pulledfrom)

		});
		if(structure == null) {
			structure = creep.pos.findClosestByRange(fillStructures, {
				filter: (s) => creep.carry.energy > 0 && (s.structureType == STRUCTURE_EXTENSION
	 			     || s.structureType == STRUCTURE_SPAWN
				     || s.structureType == STRUCTURE_LAB
	                             || (s.structureType == STRUCTURE_TOWER && s.my == true)
				     )
	            });
		}
		if (structure == null && creep.carry.energy > 0) {
			var upgraderContainer = Game.getObjectById(creep.memory.upgraderContainer);
			if(upgraderContainer != undefined) {
				if(upgraderContainer.store[RESOURCE_ENERGY] < 1200) structure = upgraderContainer;
			}
			if(upgraderContainer == undefined) {
				var flagname = "upgraderContainer";
	                        var flags = creep.room.find(FIND_FLAGS, {filter: (f) => f.name.substr(0,flagname.length) == flagname })
	                        var flag = flags[0];
				structure = flag.pos.findClosestByRange(FIND_STRUCTURES, {
				filter:(s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < 1000
				}); 
				if(structure != null && structure.pos.getRangeTo(flag.pos) > 2) {
					structure = null;
				}
			}
		}	
                if (structure == null && creep.carry.energy > 0 && creep.room.memory.loadNuke == true && creep.room.storage.store.energy >= 120000) {
                        structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				                                filter: (s) => (s.structureType == STRUCTURE_NUKER
					                                        && s.energy < s.energyCapacity)
					                        });
                }

		if (structure == null) {
			structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (s) => (s.structureType == STRUCTURE_STORAGE
					&& s.store[RESOURCE_ENERGY] < s.storeCapacity && s.id != creep.memory.pulledfrom)
			});
		}

            // if we found one
            if (structure != null) {
   		    // try to transfer energy, if it is not in range
		if(creep.room.storage != undefined) {
			if(creep.pos.getRangeTo(structure) >= 6 && creep.pos.getRangeTo(creep.room.storage) < 15 && carry < (creep.carryCapacity * .75)) {
				creep.memory.working = false;
				return;
			}
		}
		creep.memory.structure = structure.id;

		if(creep.pos.getRangeTo(structure) > 1) {
			creep.moveTo(structure);
			return;
		}
		creep.deposit(structure);
		structure.iGotIt(creep);
            } else {
		if(_.sum(creep.carry) != creep.carryCapacity) {
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
