module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			creep.setupSpawn();
			creep.memory.healing = -1;
			return;
		}

		if(creep.getBoosted("LHO2")) return;

		if(creep.memory.healing == -1) {
			var healing  = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
				    filter: (c) => c.memory.Healer ==  -1 && c.memory.role == "raider"
			});
			if(healing != undefined) {
				creep.memory.healing = healing.id;
				healing.memory.Healer = creep.id;
			} else {
				creep.say(":(");
				return;
			}
		}

		if(creep.hits < creep.hitsMax - 900) {
			creep.heal(creep);
			return;
		}

		var target = Game.getObjectById(creep.memory.healing);

		if(target != undefined) {
			if(creep.pos.getRangeTo(target) < 999) {
		                if(creep.getAwayFromEdge()) {
		                        return;
		                }

			}
			if(creep.pos.getRangeTo(target) > 1) {
				creep.moveTo(target);
				if(target.hits != target.hitsMax && creep.hits > 4000) {
					creep.rangedHeal(target);
					return;
				}
			} else {
                                if(target.hits != target.hitsMax && creep.hits > 4000) {
                                        creep.heal(target);
					return;
                                }
			}
		}
		let extra_target = creep.pos.findInRange(FIND_MY_CREEPS, 3, {filter: (c) => c.hits < c.hitsMax && c.id != creep.id});
		if(extra_target.length > 0) {
			target = extra_target
			if(creep.pos.getRangeTo(target) == 1) {
				creep.heal(target);
			} else {
				creep.rangedHeal(target);
			}
		}
        }
};
