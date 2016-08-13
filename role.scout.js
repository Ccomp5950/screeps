module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.memory.waypoint = 1;
                        return;
                }
		if(creep.memory.waypoint != -1 && Game.flags[creep.memory.waypoint] != undefined) {
			var flag = Game.flags[creep.memory.waypoint];
			var range = creep.pos.getRangeTo(flag);
			if(range > 0) {
				creep.moveTo(flag);
				return;
			} else {
				creep.memory.waypoint += 1;
			}
		}
                if(creep.getAwayFromEdge()) {
                        return;
                }
		if(Game.flags["scout1"] != undefined) {
			var range = creep.pos.getRangeTo(Game.flags.scout1);
			if(range > 0) {
				creep.moveTo(Game.flags.scout1);
			}
		}

        }
    
};
