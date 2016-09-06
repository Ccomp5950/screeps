module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning == true) {
			creep.setupSpawn();
			creep.memory.towercheck = 0;
			creep.memory.hide = 0;
			creep.memory.kill = false;
			return;
		}
		if(creep.getBoosted("LHO2")) return;
		if(creep.gotoWaypoint()) return;
		//creep.getAwayFromEdge();
		if(creep.memory.healing || creep.hits < 2400) {
			creep.memory.healing = true;
			creep.heal(creep);
		}
		if(creep.hits >= creep.hitsMax - 300) {
			creep.memory.healing = false;
		}
		var flag = Game.flags.killdozer;		
		if(creep.pos.getRangeTo(flag) > 999) {
			creep.moveTo(flag, {ignoreRoads:true});
			return;
		}
		creep.setRespawnTime();
		// KILL SHIT
		if(creep.memory.kill == false) {
			if(Game.time % 10 == 0) {
				creep.say("NO KILL?");
			}
			creep.heal(creep);
			return;
		}
		if(creep.attackSavedTarget()) return;
		if(creep.attackHostileStructure("FLAG")) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
		if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
		if(creep.attackHostileStructure(STRUCTURE_RAMPART)) return;
		if(creep.attackHostileStructure(STRUCTURE_WALL)) return;
		if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		//if(creep.attackHostileStructure(STRUCTURE_RAMPART)) return;
		//if(creep.attackHostileStructure("ANYTHING")) return;
                if(flag != undefined) {
                        range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.moveTo(flag);
                                return;
                        }
                }

        }
    
};
