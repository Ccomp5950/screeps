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
		let storage = Game.getObjectById(Memory.storageid);

		let energy = creep.pos.lookFor(LOOK_ENERGY);
			if(energy.length) {
				creep.pickup(energy[0])
			}

        if (creep.memory.working == true && creep.carry.energy == 0) {

            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {

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

			let roads = creep.pos.findByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax - 500 });
			if(roads.length) {
				creep.repair(roads[0];
			}

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
