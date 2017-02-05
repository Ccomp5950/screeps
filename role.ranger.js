module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			creep.setupSpawn();
			creep.memory.ignoreSK = true;
			//creep.memory.needsBoosted = true;
		}
		creep.setupFlag();
		//if(creep.getBoosted("XKHO2")) return;
		//creep.memory.needsBoosted = false;
                var healing = false;
		if(creep.hits < creep.hitsMax) {
			healing = true;
			creep.heal(creep);
                }
		let flag = Game.flags[creep.memory.MyFlag];
		var target = null;
		var ignoreSK = false;
		var move = true;
		creep.attackAdjacentCreep(true);

		if(creep.memory.ignoreSK == true) ignoreSK = true;
		
		if(creep.attackHostileCreep(true, ignoreSK, true) == true) {
			creep.getAwayFromEdge();
			move = false;
		}
		if(creep.approachAssignedFlag(999) == false) return;

		if(!healing) {
			target = creep.pos.findClosestByRange(FIND_CREEPS, {
	                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax && c.memory.role != "skminer"
	                        });
	                if (target != undefined) {
	                        if (creep.heal(target) == ERR_NOT_IN_RANGE && move) {
					move = false;
					creep.moveTo(target);
	                        }
	                                return;
	                }
		}
		if(!move) return;
		if(creep.attackHostileStructure(STRUCTURE_ROAD)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		creep.approachAssignedFlag(0);

        }
        
    
};
