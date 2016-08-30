module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning == true) {
			creep.setupSpawn()
			creep.memory.link = null;
			creep.memory.terminal = null;
			creep.memory.putIn = null;
			creep.memory.maxTerminalMineral = 20000;
			creep.memory.maxTerminalEnergy = 100000;
			creep.memory.nearbySpawn = null;
                        return;
                }
		creep.memory.age = Game.time - creep.memory.spawnTime;
		let hasStorage = false;
		let hasLink = false;
		let hasTerminal = false;
		let hasSpawn = false;
		creep.memory.setupTime = 1;
		creep.setupFlag();
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}

		let nearbySpawn = Game.getObjectById(creep.memory.nearbySpawn);
		if(nearbySpawn == undefined) {
			nearbySpawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
			if(creep.pos.getRangeTo(nearbySpawn) == 1) {
				creep.memory.nearbySpawn = nearbySpawn.id;
			}
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

		if(nearbySpawn != undefined && creep.pos.getRangeTo(nearbySpawn) == 1) {
			hasSpawn = true;
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
				if(hasSpawn) {
					if(nearbySpawn.energy < nearbySpawn.energyCapacity) {
						creep.transfer(nearbySpawn, RESOURCE_ENERGY);
						return;
					}
				}
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
						creep.deposit(storage, RESOURCE_ENERGY);
						return;
					}
				}
				if(hasTerminal) {
					if(terminal.store.energy == undefined || _.sum(terminal.store) < terminal.storeCapacity) {
						creep.deposit(terminal, RESOURCE_ENERGY);
						return;
					}
				}
				creep.say(":( :( :(");
				console.log("[" + creep.name + "] Unable to process energy full up.");
				return;
			} else { // Carrying Resources
				let useTerminal = false;
				for(let resource in creep.store) {

					if(resource == "energy") continue;
					if(terminal.store[resource] != undefined && terminal.store[resource] < creep.memory.maxTerminalMineral) {
						useTerminal = true;
						break;
					}
				}
				if(hasTerminal && _.sum(terminal.store) < terminal.storeCapacity && useTerminal) {
					creep.deposit(terminal);
				} else if(hasStorage && _.sum(storage.store) < storage.storeCapacity) {
					creep.deposit(storage);
				}

			}
		} else { // grab energy
			if(hasLink && link.energy > 0) {
				creep.withdraw(link, RESOURCE_ENERGY);
				return;
			}
			else if(hasStorage && hasSpawn && nearbySpawn.energy < nearbySpawn.energyCapacity) {
				creep.withdraw(storage, RESOURCE_ENERGY);
			}
			else if(hasStorage && hasTerminal && terminal.store.energy < creep.memory.maxTerminalEnergy && storage.store[RESOURCE_ENERGY] > 150000) {
				creep.withdraw(storage, RESOURCE_ENERGY);
			} 
			else if(hasTerminal && terminal.store.energy > creep.memory.maxTerminalEnergy) {
				creep.withdraw(terminal, RESOURCE_ENERGY);
			} 
			else if(hasTerminal && hasStorage){
				for(let resource in terminal.store) {
					if(resource == "energy") continue;
					if(terminal.store[resource] != undefined) {
						creep.say(resource + Math.floor(terminal.store[resource]/1000) + "k");
						if(terminal.store[resource] < creep.memory.maxTerminalMineral) {
							creep.withdraw(storage, resource);
						}
						if(terminal.store[resource] > creep.memory.maxTerminalMineral) {
							let amounT = terminal.store[resource] - creep.memory.maxTerminalMineral
							creep.withdraw(terminal, resource, terminal.store[resource] - creep.memory.maxTerminalMineral);
						}
					}
				}
			}	
		}
    }
};
