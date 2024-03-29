module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        creep.setupSpawn();
                        return;
                }
        creep.setupSpawn();
        creep.setupFlag();
        creep.setRespawnTime();
	//creep.saySomething();
		if(creep.memory.myFlag == -1) {
			return;
		}
                let flag = Game.flags[creep.memory.myFlag];
		
		let terminal = creep.room.terminal;
		let storage = creep.room.storage;

		let energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
		for(let resource in energy) {
			creep.pickup(resource)
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
/*			if(storage != null && creep.pos.getRangeTo(storage) < 999) {

				if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				};

			} else {
*/
				var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, 25);
				if(target) {
					if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
					        if(creep.moveTo(target, {maxRooms:0}) == 0) {
							return;
						}
				
					}
				}
                        var feflagname = "free_energy";
                        var feflags = creep.room.find(FIND_FLAGS, {filter: (f) => f.name.substr(0,feflagname.length) == feflagname })
                        var feflag = feflags[0];
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER && (feflag != undefined &&  s.pos.getRangeTo(feflag) <= 1) && _.sum(s.store) > 600)
				});
                                if(target) {
					if(creep.pos.getRangeTo(target) > 1) {
						creep.moveTo(target);
						return;
					}
	                                for(let resource in target.store) {
	                                        creep.withdraw(target, resource);
                                        }
                                        return;
                                }
				if(carry > 0) creep.memory.working=true;	
	                        if(creep.approachAssignedFlag(0) == false) {
	                                return;
        	                }

		}else {

		        if(creep.approachAssignedFlag(999) == false) {
		                return;
			}
        
			if(creep.pos.getRangeTo(storage) > 1) {
				creep.moveTo(storage);
				return;
			} else {
				for(let resource in creep.carry) {
					creep.transfer(storage, resource);
				}
			}
			

		}
    }
};
