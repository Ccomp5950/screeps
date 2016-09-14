module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
//			creep.memory.needsBoosted = true;
			creep.memory.Healer = -1;
			return;
		}
		creep.memory.MyFlag = "raider";
		let flag = Game.flags[creep.memory.MyFlag];
		creep.drivebyRestore();
		if(creep.memory.Healer == -1) return;
                if(creep.getAwayFromEdge()) {
                        return;
                }

		var healer = Game.getObjectById(creep.memory.Healer);
		if(healer != undefined) {
			if(creep.pos.getRangeTo(flag) < 999) {
				if(creep.pos.getRangeTo(healer) > 1) {
					return;
				}
			}
			if(creep.pos.getRangeTo(healer) > 999) {
				return;
			}
		}
		if(creep.gotoWaypoint()) return;
		creep.memory.MyFlag = "raider";
		if(creep.attackAdjacentCreep() == true) return;
		if(creep.approachAssignedFlag(999) == false) return;

                if(creep.attackHostileCreep()) return;
		if(creep.attackHostileStructure("FLAG")) return;
                if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;

		creep.approachAssignedFlag(0);
        }
    
};
