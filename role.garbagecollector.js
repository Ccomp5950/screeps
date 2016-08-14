module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn();
			creep.memory.myFlag = "gc";
                        return;
                }
		if(creep.memory.myFlag == -1) {
			return;
		}
                let flag = Game.flags[creep.memory.myFlag];
		
		let terminal = creep.room.terminal;
		let storage = creep.room.storage;;

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
			if(storage != null && creep.pos.getRangeTo(storage) < 999) {

				if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				};
			} else {
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
			if(creep.pos.getRangeTo(terminal) > 1) {
				creep.moveTo(terminal);
				return;
			} else {
				for(let resource in creep.carry) {
					creep.transfer(terminal, resource);
				}
			}
			

		}
    }
};