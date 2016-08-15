module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn();
			creep.setupFlag();
                        return;
                }
		creep.setupFlag();
		if(creep.memory.myFlag == -1) {
			return;
		}
                let flag = Game.flags[creep.memory.myFlag];
		
		let container = Game.getObjectById(creep.memory.container);
		let storage = creep.room.storage
		let terminal = creep.room.terminal

		let energy = creep.pos.lookFor(LOOK_ENERGY);
			if(energy.length) {
				creep.pickup(energy[0])
			}
	let carry = _.sum(creep.carry);
        if (creep.memory.working == true && carry == 0) {

            creep.memory.working = false;
        }
        else if (creep.memory.working == false && carry == creep.carryCapacity) {

            creep.memory.working = true;
            creep.memory.source = null;
        }




		if(creep.memory.working == false) {
			if(creep.memory.getToFlag == null) {
				creep.memory.getToFlag = true;
			}

			if(creep.memory.getToFlag == true) {
				if(creep.approachAssignedFlag(0) == true) { 
					creep.memory.getToFlag = false;
				} else {
					return;
				}
			}


					
			if(creep.memory.container == null) {
				creep.memory.container = null;
			}

			if(creep.memory.container == null || container == null || creep.memory.switchOnce == true) {
		          	container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 10)
					});
			}
			if(container != null && creep.pos.getRangeTo(container) < 999) {

				if(creep.memory.container == null) {
					creep.memory.container = container.id
				}
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

		}else {
			creep.memory.getToFlag = true;

			let roads = creep.pos.findInRange(FIND_STRUCTURES,2, { filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax });
			if(roads.length) {
				creep.repair(roads[0]);
			}

			if(creep.pos.getRangeTo(Game.flags["home"]) > 999) {
				creep.moveTo(Game.flags["home"]);
				return;
			}
			if(Game.flags[creep.room.name + "_remoteDropOff"] != undefined && creep.memory.goingToStorage == false) {
				let links = Game.flags[creep.room.name + "_remoteDropOff"].pos.findInRange(FIND_STRUCTURES,1, { filter: (s) => s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity || s.cooldown < 5});
				if(links.length) {
					let link = links[0];
					if(creep.pos.getRangeTo(link) > 1) {
						creep.moveTo(link);
						return;
					} else {
						creep.transfer(link, RESOURCE_ENERGY);
						creep.memory.working = false;
						return;
					}
				}else {
					let dropOffContainers = Game.flags[creep.room.name + "_remoteDropOff"].pos.findInRange(FIND_STRUCTURES,1, 
						{ filter: (s) => s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity});
					if(dropOffContainers.length) {
						let dropoffCotainer = dropOffContainers[0];
	                                        if(creep.pos.getRangeTo(dropOffContainer) > 1) {
	                                                creep.moveTo(dropOffContainer);
	                                                return;
	                                        } else {
	                                                creep.transfer(dropoffContainer, RESOURCE_ENERGY);
	                                                return;
	                                        }

					}

				}
			}
				
			if(storage != null) {
				if(creep.pos.getRangeTo(storage) > 1) {
					creep.moveTo(storage);
					creep.memory.goingToStorage = true;
					return;
				} else {
					creep.transfer(storage, RESOURCE_ENERGY);
					creep.memory.switchOnce = false;
					creep.memory.goingToStorage = false;
				}
			} else if(terminal != null) {
                                if(creep.pos.getRangeTo(terminal) > 1) {
                                        creep.moveTo(terminal);
                                        return;
                                } else {
                                        creep.transfer(terminal, RESOURCE_ENERGY);
                                        creep.memory.switchOnce = false;
					creep.memory.goingToStorage = false;
                                }

			}
			

		}
    }
};
