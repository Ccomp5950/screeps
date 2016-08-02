module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			return;
		}
		if(creep.hits > creep.hitsMax) {
			creep.heal(creep);
		}
		var target = null;
		if(redAlert) {
			target = creep.room.find(FIND_HOSTILE_CREEPS);
			if (target != undefined) {
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
				return;
			} 
			else {
				var destination = null;
				var rating = 0;
				for(let room of Memory.myrooms) {
					if(rating < biggestThreat[room]) {
						destination = Game.rooms[room];
						creep.moveTo(destination);
					}
				}
			}
		}
		for(room in Memory.myrooms) {
			if(Game.rooms[room] != null) {
			        target = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
			        if (target != undefined) {	
			                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
			                        creep.moveTo(target);
						}
					return;
				}
			}
		}
		if(creep.ticksToLive < 400 || creep.memory.restoring == true) {
			creep.memory.restoring = true;
			creep.getRestored();
			return;
		}

                if(Game.flags["Defender"] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags.Defender);
                        if(range > 0) {
                                creep.moveTo(Game.flags.Defender);
                        }
                }

        }
        
    
};
