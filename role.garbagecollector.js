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
	creep.saySomething();
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
/*			if(storage != null && creep.pos.getRangeTo(storage) < 999) {

				if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				};

			} else {
*/
				var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 25);
				if(target) {
					if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
					        creep.moveTo(target);
				
					}
					return;
				}
                        var feflagname = "free_energy";
                        var feflags = creep.room.find(FIND_FLAGS, {filter: (f) => f.name.substr(0,feflagname.length) == feflagname })
                        var feflag = feflags[0];
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER && (feflag != undefined &&  s.pos.getRangeTo(feflag) == 0) && _.sum(s.store) > 600),
					maxRooms: 1
				});
                                if(target) {
                                        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                                creep.moveTo(target);

                                        }
                                        return;
                                }
				if(carry > 0) creep.memory.working=true;	

		}else {

			if(creep.pos.getRangeTo(Game.flags["home"]) > 999) {
				creep.moveTo(Game.flags["home"]);
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
