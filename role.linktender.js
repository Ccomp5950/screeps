module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning == true) {
			creep.setupSpawn()
			creep.memory.link = null;
			creep.memory.terminal = null;
			creep.memory.putIn = null;
			creep.memory.maxTerminalEnergy = 100000;
                        return;
                }
		let hasStorage = false;
		let hasLink = false;
		let hasTerminal = false;
		creep.memory.setupTime = 1;
		creep.setupFlag();
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}
		creep.drivebyRestore();

		let carry = _.sum(creep.carry);
		if (creep.memory.working == true && carry == 0) {
			creep.memory.working = false;
		}
		else if (creep.memory.working == false && carry > 0) {
			creep.memory.working = true;
			creep.memory.source = null;
		}


		let storage = creep.room.storage;
		if(storage != undefined) {
			hasStorage = true;
		}
		let link = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK});
		if(link != undefined) {
			hasLink = true;
		}
		let terminal = creep.room.terminal;
		if(terminal != undefined) {
			hasTerminal = true;
		}

		var amount = null;
		if(creep.memory.working) {
			if(creep.carry.energy > 0) { // Carrying Energy
				if(hasTerminal) {
					if(terminal.store.energy == undefined || terminal.store.energy < creep.memory.maxTerminalEnergy) {
						if(creep.carry.energy + terminal.store.energy > creep.memory.maxTerminalEnergy) {
							amount = creep.memory.maxTerminalEnergy - terminal.store.energy;
						}
						creep.transfer(terminal, RESOURCE_ENERGY, amount);
						return;
					}
					
				}
				if(hasStorage) {
					if(_.sum(storage.store) < storage.storeCapacity) {
						creep.transfer(storage, RESOURCE_ENERGY);
						return;
					}
				}
				if(hasTerminal) {
					if(terminal.store.energy == undefined || _.sum(terminal.store) < terminal.storeCapacity) {
						creep.transfer(terminal, RESOURCE_ENERGY);
						return;
					}
				}
				creep.say(":( :( :(");
				console.log("[" + creep.name + "] Unable to process energy full up.");
				return;
			} else { // Carrying Resources
				if(hasTerminal && _.sum(terminal.store < terminal.storeCapacity)) {
			                for(var resourceType in creep.carry) {
			                        creep.transfer(terminal, resourceType);
						return;
			                }
				} else if(hasStorage && _.sum(storage.store < storage.storeCapacity)) {
                                        for(var resourceType in creep.carry) {
                                                creep.transfer(storage, resourceType);
						return;
                                        }
				}
			}
		} else { // grab energy
			if(hasLink && link.energy > 0) {
				creep.withdraw(link, RESOURCE_ENERGY);
				return;
			}
			else if(hasStorage && hasTerminal && terminal.store.energy < creep.memory.maxTerminalEnergy && storage.store[RESOURCE_ENERGY] > 150000) {
				creep.withdraw(storage, RESOURCE_ENERGY);
			} 
			else if(hasTerminal && terminal.store.energy > creep.memory.maxTerminalEnergy) {
				creep.withdraw(terminal, RESOURCE_ENERGY);
			}
			
		}
    }
};
