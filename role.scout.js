module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        creep.setupSpawn();
                        return;
                }

		if(creep.getActiveBodyparts(HEAL) > 0 && creep.hits < creep.hitsMax) {
			creep.heal(creep);
		}

		//if(creep.gotoWaypoint()) return;

                if(creep.getAwayFromEdge()) {
                        return;
                }
		if(Game.flags["scout1"] != undefined) {
			var range = creep.pos.getRangeTo(Game.flags.scout1);
			if(range > 0) {
				 if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
				creep.moveTo(Game.flags.scout1);
			} 
			if (range == 1) {
				creep.setRespawnTime();
			}
		}

        }
    
};
