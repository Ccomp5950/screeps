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
		let home = creep.memory.spawnRoom;	
		let storage = creep.room.storage;
		if(creep.memory.homex == undefined) {
			creep.memory.homex = creep.pos.x;
			creep.memory.homey = creep.pos.y;
		}
		let energy = creep.pos.lookFor(LOOK_ENERGY);
			if(energy.length) {
				creep.pickup(energy[0])
			}
	let carry = _.sum(creep.carry);
        if (creep.memory.working == true && carry == 0) {
		creep.memory.goingToStorage = false;
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && carry == creep.carryCapacity) {
		creep.memory.goingToStorage = false;
            creep.memory.working = true;
            creep.memory.source = null;
        }

		if(creep.memory.working == true) {
			creep.memory.waypointfeeder = true;
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

	                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        	filter: (s) =>    s.structureType == STRUCTURE_LINK			
			});

			if(target == undefined) {
		                target = creep.pos.findClosestByRange(FIND_CREEPS, {
	                                        filter: (c) => c.my == true && c.id != creep.id && c.memory.role=="remotebuilder" && _.sum(c.carry) < c.carryCapacity
	                        });
			}
			if(target != undefined) {
				if(creep.pos.getRangeTo(target) > 1) {
					creep.moveTo(target, {maxRooms:1});
				} else {
					creep.transfer(target, RESOURCE_ENERGY);
				}
			return;
			}
			if(creep.pos.getRangeTo(creep.room.storage) > 6) {
				target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (s) => s.structureType == STRUCTURE_LINK && s.pos.getRangeTo(creep) < 3
				});
			}
			if(target == undefined) {
				target = creep.room.storage;
			}
			if(target == undefined) {
				target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.getRangeTo(creep) < 3
				};
			}

                        if(target != undefined) {
                                if(creep.pos.getRangeTo(target) > 1) {
                                        creep.moveTo(target, {maxRooms:1});
                                } else {
                                        creep.transfer(target, RESOURCE_ENERGY);
                                }
                        return;
                        }

			

		}else {
			if(creep.memory.setupTime > 500) {
				creep.suicide();
			}
			creep.memory.getToFlag = true;

			let homepos = new RoomPosition(creep.memory.homex, creep.memory.homey, home)
			if(creep.room.name != home && creep.pos.getRangeTo(homepos) > 999) {
				let waypointflag = Game.flags.waypointfeeder;
				if(creep.memory.waypointfeeder != false) {
					if(creep.pos.getRangeTo(waypointflag) > 2) {
						creep.moveTo(waypointflag);
						return;
					} else {
						creep.memory.waypointfeeder = false;
					}
				}
				creep.moveTo(homepos);
				return;
			}
			let storage = creep.room.storage;	
			if(storage != undefined) {
				if(creep.pos.getRangeTo(storage) > 1) {
					creep.moveTo(storage);
					return;
				} else {
					creep.withdraw(storage, RESOURCE_ENERGY);
				}
			} else {
				storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > 350});
				if(storage != undefined) {
	                                if(creep.pos.getRangeTo(storage) > 1) {
	                                        creep.moveTo(storage);
	                                        return;
	                                } else {
	                                        creep.withdraw(storage, RESOURCE_ENERGY);
                                	}
				}
			}
			
			

		}
    }
};
