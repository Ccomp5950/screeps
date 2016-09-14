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

		var target = Game.getObjectById(creep.memory.healing);

		if(target != undefined) {
			if(creep.pos.getRangeTo(target) > 1) {
				creep.moveTo(target);
				if(target.hits != target.hitsMax && creep.hits > 4000) {
					creep.rangedHeal(target);
				}
			} else {
                                if(target.hits != target.hitsMax && creep.hits > 4000) {
                                        creep.heal(target);
                                }
			}
		}
        }
};
