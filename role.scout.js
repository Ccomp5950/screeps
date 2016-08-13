module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.memory.waypoint = 1;
                        return;
                }
		if(creep.memory.waypoint == undefined) {
			creep.memory.waypoint = 1;
		}
		var flag =  Game.flags["waypoint" + creep.memory.waypoint.toString()];
		
		if(creep.memory.waypoint != -1 &&  flag != undefined) {
			var range = creep.pos.getRangeTo(flag);
			if(range > 0) {
				creep.moveTo(flag);
				return;
			} else {
				creep.memory.waypoint += 1;
			}
		} else {
			creep.memory.waypoint = -1;
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
