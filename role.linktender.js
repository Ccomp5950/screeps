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
                        return;
                }
		creep.memory.age = Game.time - creep.memory.spawnTime;
		let hasStorage = false;
		let hasLink = false;
		let hasTerminal = false;
		let hasSpawn = false;
		let spawnFill = -1;
		if(creep.memory.thisRoomsMineral == undefined && creep.room.memory.mineral != undefined) {
			let tmpmineral = Game.getObjectById(creep.room.memory.mineral)
			if(tmpmineral != undefined) creep.memory.thisRoomsMineral = tmpmineral.mineralType;
		}
		creep.memory.setupTime = 1;
		creep.setupFlag();
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}

		var nearbySpawn = creep.pos.findInRange(FIND_STRUCTURES,1, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
			
		if(nearbySpawn.length > 0) {
			creep.drivebyRestore();
			hasSpawn = true;
			for(let index in nearbySpawn) {
				let spawn = nearbySpawn[index];
				if(spawn.energy < spawn.energyCapacity) {
					spawnFill = index;
				}
			}
		}

		var carry = _.sum(creep.carry);
		if (creep.memory.working == true && carry == 0) {
			creep.memory.working = false;
		}
		else if (creep.memory.working == false && carry > 0) {
			creep.memory.working = true;
			creep.memory.source = null;
		}

		var storage = creep.room.storage;
		if(storage != undefined) {
			hasStorage = true;
		}
		var link = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK});
		if(link != undefined) {
			hasLink = true;
		}
		var terminal = creep.room.terminal;
		if(terminal != undefined) {
			hasTerminal = true;
		}

		var amount = null;
		if(creep.memory.working) {
			if(creep.carry.energy > 0) { // Carrying Energy
				if(hasSpawn && spawnFill != -1) {
					creep.transfer(nearbySpawn[spawnFill], RESOURCE_ENERGY);
					return;
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
				for(let resource in creep.carry) {
					if(resource == "energy") {
						continue;
					}
					let maxTerminal = creep.memory.maxTerminalMineral;
					if(resource == creep.memory.thisRoomsMineral) maxTerminal = 20000;
					if(terminal.store[resource] == undefined || resource == terminal.store[resource] < maxTerminal) {
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
			else if(hasStorage && hasSpawn && spawnFill != -1) {
				creep.withdraw(storage, RESOURCE_ENERGY);
			}
			else if(hasStorage && hasTerminal && terminal.store.energy < creep.memory.maxTerminalEnergy && storage.store[RESOURCE_ENERGY] > 150000) {
				creep.withdraw(storage, RESOURCE_ENERGY);
			} 
			else if(hasTerminal && terminal.store.energy > creep.memory.maxTerminalEnergy) {
				creep.withdraw(terminal, RESOURCE_ENERGY);
			} 
			else if(hasTerminal && hasStorage){
				for(let resource in storage.store) {
					if(resource == "energy") continue;
                                        let maxTerminal = creep.memory.maxTerminalMineral;
					if(resource == creep.memory.thisRoomsMineral) maxTerminal = 20000;
					if((terminal.store[resource] == undefined || terminal.store[resource] < maxTerminal) && storage.store[resource] != undefined) {
						creep.withdraw(storage, resource);
						return;
					}
					if(terminal.store[resource] > maxTerminal) {
						if((terminal.store[resource] - creep.carryCapacity) < maxTerminal) {
							amount = terminal.store[resource] - maxTerminal;
						}
			
						creep.withdraw(terminal, resource, amount);
						return;
					}
				}
                                for(let resource in terminal.store) {
                                        if(resource == "energy") continue;
                                        let maxTerminal = creep.memory.maxTerminalMineral;
					if(resource == creep.memory.thisRoomsMineral) maxTerminal = 20000;
					if((storage.store[resource] == undefined || terminal.store[resource] < maxTerminal) && terminal.store[resource] != undefined) {
                                                creep.withdraw(storage, resource);
                                                return;
                                        }
                                        if(terminal.store[resource] > maxTerminal) {
                                                if((terminal.store[resource] - creep.carryCapacity) < maxTerminal) {
                                                        amount = terminal.store[resource] - maxTerminal;
                                                }

                                                creep.withdraw(terminal, resource, amount);
                                                return;
                                        }
                                }
			}
		}
    }
};
