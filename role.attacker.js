module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			creep.memory.needsBoosted = true
			return;
		}
		creep.drivebyRestore();
		if(creep.gotoWaypoint()) return;
                if(creep.getAwayFromEdge()) {
                        return;
                }
		creep.memory.MyFlag = "attack";
		if(creep.approachAssignedFlag(999)) return;
		if(creep.attackAdjacentCreep()) return;
                if(creep.attackHostileCreep()) return;
		
                if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;


                if(creep.hits != creep.hitsMax) {
			creep.heal(creep);
                }
                let target = creep.pos.findClosestByRange(FIND_CREEPS, {
                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax
                        });
                if (target != undefined) {
                        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                        }
                                return;
                }

		creep.approachAssignedFlag(0);
        }
    
};
