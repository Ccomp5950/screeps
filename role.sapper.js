module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}
		/*
		if(creep.memory.squadsize == null) {
			creep.memory.raiding = false;
			creep.memory.ready = false;
			creep.memory.squadsize = squadsize;
		}
	
		if(creep.memory.ready == false && Game.flags["formup"] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags.formup);
                        if(range > 2) {
                                creep.moveTo(Game.flags.formup);
                                return;
                        } else if(Game.flags.formup.memory.squad.IndexOf(creep.id) == -1) {
					Game.flags.formup.memory.squad.Push(creep.id)
			}
		}
		if(creep.memory.ready == true) {
		*/
                if(creep.memory.healing) {
                        if(creep.heal(creep) == 0) {
                                return;
                        }
                }
		creep.getAwayFromEdge();
		var flag = Game.flags.sapper;		
		var frange = 999;
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < 1800 || creep.memory.healing == true) {
			creep.memory.healing = true;
			flag = Game.flags.sapperSafe;
			frange = 0;
		}
		if(flag != undefined) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			}
		}
		if(creep.attackSavedTarget()) return;
			return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
		if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
		if(creep.attackHostileStructure(STRUCTURE_WALL)) return;
		//if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		if(creep.attackHostileStructure(STRUCTURE_RAMPART)) return;
		if(creep.attackHostileStructure("ANYTHING")) return;
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.moveTo(flag);
                                return;
                        }
                }

                

        }
    
};
