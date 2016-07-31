module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			return;
		}
		if(creep.hits > creep.hitsMax) {
			creep.heal(creep);
		}

	        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
	        if (target != undefined) {
	                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(target);
				}
			return;
		}
		if(creep.memory.restroring == undefined) {
			creep.memory.restoring = false;
		}
		if(creep.ticksToLive < 400 || creep.memory.restoring == true) {
			creep.memory.restoring = true;
			creep.getrestored();
		}

                if(Game.flags["Defender"] != undefined && creep.memory.restoring == false) {
                        var range = creep.pos.getRangeTo(Game.flags.Defender);
                        if(range > 0) {
                                creep.moveTo(Game.flags.Defender);
                        }
                }

        }
        
    
};
