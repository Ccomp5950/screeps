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
                if(creep.getActiveBodyparts(MOVE) == 10) {
                        if(creep.getBoosted("XZHO2")) return;
                }

		var solo = false;
		if(creep.memory.role == "soloraider") solo = true;
		if(solo == false &&  creep.memory.Healer == -1) return;
                if(creep.getAwayFromEdge()) {
                        return;
                }
		if(creep.attackAdjacentCreep() == true) return;
		if(!solo) {
			var healer = Game.getObjectById(creep.memory.Healer);
			if(healer != undefined) {
				if(creep.pos.getRangeTo(flag) < 999) {
					if(creep.pos.getRangeTo(healer) > 1 || healer.fatigue != 0) {
						return;
					}
				}
				if(creep.pos.getRangeTo(healer) > 999) {
					if(_.(creep.pos.lookFor(LOOK_STRUCTURES).filter((s) => s.structureType == STRUCTURE_PORTAL)) == undefined) return;
				}
			}
		}
		if(creep.approachAssignedFlag(999) == false) return;

		if(creep.attackSavedTarget()) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileCreep()) return;
		
		if(creep.attackHostileStructure("FLAG")) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
                if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_RAMPART, true)) return;

		if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
		
		if(creep.attackHostileStructure(STRUCTURE_TERMINAL)) return;
		if(creep.attackHostileCreep(true)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		if(creep.attackHostileStructure("ANYTHING")) return;
		creep.approachAssignedFlag(0);
        }
    
};
