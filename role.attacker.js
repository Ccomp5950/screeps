module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			creep.setupSpawn();
			creep.memory.needsBoosted = true
			return;
		}
		creep.drivebyRestore();
		if(creep.getBoosted("XLHO2")) return;
		creep.memory.needsBoosted = false;
		if(creep.gotoWaypoint()) return;
                if(creep.getAwayFromEdge()) {
                        return;
                }
		creep.memory.MyFlag = "attack";
		if(creep.approachAssignedFlag(999) == false) return;
		if(creep.attackAdjacentCreep() == true) return;
		if(creep.attackHostileStructure("FLAG")) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		//if(creep.attackAdjacentCreep() == true) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
                if(creep.attackHostileCreep(true)) return;
		if(creep.attackHostileStructure(STRUCTURE_LAB)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		//if(creep.attackHostileStructure("FLAG")) return;


                if(creep.hits != creep.hitsMax) {
			creep.heal(creep);
                }
		
		let target = creep.pos.findClosestByRange(FIND_CREEPS, {
                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax && c.memory.role != "towerdrainer"
                        });
		
                if (target != undefined) {
                        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                        }
                                return;
                }

		//if(creep.attackHostileStructure(STRUCTURE_ROAD)) return;
		//if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;

		creep.approachAssignedFlag(0);
        }
    
};
