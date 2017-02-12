module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        creep.setupSpawn();
                        return;
                }
	if(creep.memory.role == "rupgradertinder") {
		creep.setupFlag()
		if(creep.approachAssignedFlag(999) == false) {
			return;
		}
	}
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
				var storage = creep.room.storage;
				if(storage == undefined) {
					creep.customharvest(creep);
					return;
				}
				if(creep.approachPos(storage.pos, 1)) return;
				creep.withdraw(storage, RESOURCE_ENERGY)
		}else {
			var flagname = "upgraderContainer";
                        var flags = creep.room.find(FIND_FLAGS, {filter: (f) => f.name.substr(0,flagname.length) == flagname })
                        var flag = flags[0];
			if(creep.pos.getRangeTo(flag) > 0) {
				creep.moveTo(flag);
				return;
			}
			var target = _(flag.pos.findInRange(FIND_STRUCTURES, 2)).filter((s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < 1500).sortBy(s=> _.sum(s.store)).first();
			if(target != undefined) {
				if(creep.pos.getRangeTo(target) > 1) {
					creep.setRespawnTime();
					creep.moveTo(storage);
					return;
				} else {
					for(let resource in creep.carry) {
						creep.transfer(target, resource);
					}
				}
			}
			

		}
    }
};
