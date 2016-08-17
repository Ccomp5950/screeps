module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        creep.setupSpawn();
                        return;
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
					creep.say(":( :( :(");
					console.log("[" + creep.name + "] can't find storage");
					return;
				}
				if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				};
		}else {
			var flag = Game.flags["upgraderContainer"];
			if(creep.pos.getRangeTo(flag) > 1) {
				creep.moveTo(Game.flags["upgraderContainer"]);
				return;
			}
			var boxes = flag.pos.findInRange(FIND_STRUCTURE, 2, {filter: (s) => s.store[RESOURCE_ENERGY] < 1000, orderBy: (s) => [_.sum(s.store), 'asc']})
			if(boxes.length) {
				var target=boxes[0];
				if(creep.getRangeTo(target) > 1) {
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
