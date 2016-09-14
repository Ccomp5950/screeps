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
			var healing  = creep.room.find(FIND_MY_CREEPS, {
				    filter: { memory.healer: -1, memory.role: "raider" }
			});
			if(healing != undefined) {
				creep.memory.healing = healing.id;
				healing.memory.healer = creep.id;
			} else {
				creep.say(":(");
				return;
			}
		}

		var target = Game.getObjectById(creep.memory.healing);

		if(target != undefined) {
			if(creep.pos.getRangeTo(target) > 1) {
				creep.moveTo(target);
				if(target.hits != target.hitsMax) {
					creep.rangedHeal(target);
				}
			} else {
                                if(target.hits != target.hitsMax) {
                                        creep.heal(target);
                                }
			}
		}
        }
};
