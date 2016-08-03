module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        if(creep.memory.spawnTime == null) {
                                creep.memory.spawnTime = Game.time;
                        }
                        if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
                                creep.memory.myFlag = creep.findFetchingFlag();
				if(creep.memory.myFlag != -1) {
					console.log("[" + creep.name + "] I'm grabbing the position at: " + creep.memory.myFlag);
	                                creep.claimFetchingFlag();
				}
                        }

                        return;
                }
                if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
                        creep.memory.myFlag = creep.findFetchingFlag();
			if(creep.memory.myFlag == -1) {
				return;
			}
                }
                let flag = Game.flags[creep.memory.myFlag];
		
		let container = Game.getObjectById(creep.memory.container);
		let storage = Game.getObjectById(Memory.storageid);
		
		if(creep.carry[RESOURCE_ENERGY] != creep.carryCapacity) {
		if(creep.memory.getToFlag == null) {
			creep.memory.getToFlag = true;
		}
			if(creep.memory.getToFlag == true) {
		                if(flag != undefined) {
		                        var range = creep.pos.getRangeTo(flag);
		                        if(range > 3) {
		                                creep.moveTo(flag);
		                                return;
		                        }
					else {
						creep.memory.getToFlag = false;
						if(creep.memory.setupTime == null) {
							creep.memory.setupTime = Game.time - creep.memory.spawnTime;
						}
					}
		                } 
				else {
					console.log("Fetcher can't find their flag: " + creep.name);
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
				if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				};
			} else {
				var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
				if(target) {
					if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
					        creep.moveTo(target);
					}
				}
			}

		}else {
			if(creep.pos.getRangeTo(Game.flags["home"]) > 999) {
				creep.moveTo(Game.flags["home"]);
				return;
			}
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
