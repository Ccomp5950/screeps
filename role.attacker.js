module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}
		creep.drivebyRestore();
		/*
		if(creep.memory.squadsize == null) {
			creep.memory.raiding = false;
			creep.memory.ready = false;
			creep.memory.squadsize = squadsize;
		}
	
		if(creep.memory.ready == false && Game.flags["formup"] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags.formup);
                        if(range > 2) {
                                creep.moveTo(Game.flags.formup);
                                return;
                        } else if(Game.flags.formup.memory.squad.IndexOf(creep.id) == -1) {
					Game.flags.formup.memory.squad.Push(creep.id)
			}
		}
		if(creep.memory.ready == true) {
		*/
		if(creep.gotoWaypoint()) return;
                if(creep.getAwayFromEdge()) {
                        return;
                }

			if(Game.flags["attack"] != undefined) {
				var range = creep.pos.getRangeTo(Game.flags.attack);
				if(range > 999) {
					creep.moveTo(Game.flags.attack);
					return;
				}
			}
		/*
		}
		*/
                if(creep.attackHostileCreep()) return;
                if(creep.attackSavedTarget()) return;
                if(creep.attackHostileStructure("FLAG")) return;
                if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;

                if(creep.hits != creep.hitsMax) {
			creep.heal(creep);
                }


                        if(Game.flags["attack"] != undefined) {
                                var range = creep.pos.getRangeTo(Game.flags.attack);
                                if(range > 0) {
                                        creep.moveTo(Game.flags.attack);
                                        return;
                                }
                        }


        }
    
};
