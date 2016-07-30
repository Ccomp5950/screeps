module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			return;
		}

		if(Game.flags["Defender"] != undefined) {
			var range = creep.pos.getRangeTo(Game.flags.attack);
			if(range > 0) {
				creep.moveTo(Game.flags.attack);
				return;
			}
		}

	        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
	        if (target != undefined) {
	                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(target);
				}
		return;
		}
                }
        }
    
};
