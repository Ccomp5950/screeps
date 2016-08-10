module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
                        if(creep.memory.spawnTime == null) {
                                creep.memory.spawnTime = Game.time;
                        }
			return;
		}
		creep.setupFlag();
                if(creep.hits < creep.hitsMax) {
                        creep.heal(creep);
                }
                target = creep.pos.findClosestByRange(FIND_CREEPS, {
                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax
                        });
                if (target != undefined) {
                        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
				if(target.onEdge()){
	                                creep.rangedHeal(target);
				} else {
					creep.moveTo(target);
					return;
				}
                        }
                }
		creep.approachAssignedFlag(0);

        }
        
    
};
