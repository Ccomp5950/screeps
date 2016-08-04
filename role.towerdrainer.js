module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}

		if(creep.getAwayFromEdge()) {
			return;
		}
		var flag = Game.flags.sapper;		
		var frange = 999;
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < 800 || creep.memory.healing == true) {
			creep.memory.healing = true;
			flag = Game.flags.sapperSafe;
		}
		if(flag != undefined) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			}
		}
                if(creep.memory.healing) {
                        if(creep.heal(creep) == 0) {
                                return;
                        }
                }

        }
    
};
