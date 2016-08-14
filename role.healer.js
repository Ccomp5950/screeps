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
		if(creep.gotoWaypoint()) return;
                target = creep.pos.findClosestByRange(FIND_CREEPS, {
                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax
                        });
                if (target != undefined) {
			var range = creep.pos.getRangeTo(target);
			if (range == 1) {
				creep.heal(target);
				return;
			} else if( range <=3 ) {
				creep.rangedHeal(target);
			} if (range > 1 && target.onEdge() == false) {
				creep.moveTo(target);
				return;
			}
                }
		creep.approachAssignedFlag(0);

        }
        
    
};
