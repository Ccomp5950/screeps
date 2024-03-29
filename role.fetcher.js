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
                var flag = Game.flags[creep.memory.MyFlag];
		let home = creep.memory.spawnRoom;	
		let container = Game.getObjectById(creep.memory.container);
		let storage = creep.room.storage
		let terminal = creep.room.terminal

		let energy = creep.pos.lookFor(LOOK_ENERGY);
			if(energy.length) {
				creep.pickup(energy[0])
			}
	let carry = _.sum(creep.carry);
        if (creep.memory.working == true && carry == 0) {
		creep.memory.goingToStorage = false;
		creep.memory.working = false;
		creep.memory.switchOnce = false;
		creep.memory.goingToStorage = false;
        }
        else if (creep.memory.working == false && carry == creep.carryCapacity) {
		creep.memory.goingToStorage = false;
            creep.memory.working = true;
            creep.memory.source = null;
        }


                let ignorecreeps = null;
                if(creep.pos.roomName != creep.memory.spawnRoom) {
                        ignorecreeps = true;
                }


		if(creep.memory.working == false) {
			if(creep.memory.getToFlag == null) {
				creep.memory.getToFlag = true;
			}

			if(creep.memory.getToFlag == true) {
				if(creep.approachAssignedFlag(0,ignorecreeps,50) == true) { 
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
	                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) > 10)
				,
				maxRooms: 1});
			}
			if(container != null && creep.pos.getRangeTo(container) < 999) {

				if(creep.memory.container == null) {
					creep.memory.container = container.id
				}
                                if(creep.pos.getRangeTo(container) > 1) {
						if(flag.memory.strict == true) {
							creep.memory.container = null;
							return;
						}
                                                creep.moveToRange(container.pos,1);
                                                return;
                                        }
		                for(var resourceType in container.store) {
		                        creep.withdraw(container, resourceType);
		                }
			} else {
				creep.memory.container = null;
				var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, 3);
				if(target) {
					if(creep.pos.getRangeTo(target) > 1) {
						creep.moveToRange(target.pos,1);
						return;
					}
					creep.pickup(target);
				}
			}

		}else {
			creep.memory.getToFlag = true;
	                var storageRange = 9999;
	                if(creep.room.storage != undefined) {
	                        storageRange = creep.pos.getRangeTo(creep.room.storage);
	                }

			creep.repairOnTheMove()

			let dropoffFlag = Game.flags[creep.memory.spawnRoom + "_remoteDropOff"]
			let homepos = new RoomPosition(41, 44, home)
			if(dropoffFlag != undefined) homepos = dropoffFlag.pos
			if(creep.room.name != home && creep.pos.getRangeTo(homepos) > 999) {
				creep.approachPos(homepos);
				return;
			}
			if(Game.flags[creep.memory.MyFlag] != undefined && Game.flags[creep.memory.MyFlag].pos.roomName != creep.memory.spawnRoom && dropoffFlag != undefined && creep.memory.goingToStorage == false && creep.pos.getRangeTo(dropoffFlag) < storageRange ) {
				let links = dropoffFlag.pos.findInRange(FIND_STRUCTURES,2, { filter: (s) => s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity || s.cooldown < 5});
				if(links.length) {
					let link = links[0];
					if(creep.pos.getRangeTo(link) > 1) {
						creep.moveTo(link, {ignoreCreeps:false});
						return;
					} else {
						creep.transfer(link, RESOURCE_ENERGY);
						return;
					}
				}else if(dropoffFlag != undefined) {
					let dropOffContainers = dropoffFlag.pos.findInRange(FIND_STRUCTURES,1, 
						{ filter: (s) => s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity});
					if(dropOffContainers.length) {
						let dropOffContainer = dropOffContainers[0];
	                                        if(creep.pos.getRangeTo(dropOffContainer) > 1) {
	                                                creep.moveTo(dropOffContainer );
	                                                return;
	                                        } else {
	                                                creep.transfer(dropOffContainer , RESOURCE_ENERGY);
	                                                return;
	                                        }

					}

				}
			}
			let storage = creep.room.storage;	
			if(storage != null) {
				if(creep.pos.getRangeTo(storage) > 1) {
					creep.moveTo(storage);
					creep.memory.goingToStorage = true;
					return;
				} else {
	                                for(var resourceType in creep.carry) {
	                                        creep.transfer(storage, resourceType);
	                                }
				}
			} else if(terminal != null) {
                                if(creep.pos.getRangeTo(terminal) > 1) {
                                        creep.moveTo(terminal);
                                        return;
                                } else {
                                        for(var resourceType in creep.carry) {
                                                creep.transfer(terminal, resourceType);
                                        }
                                }

			}
			

		}
    }
};
