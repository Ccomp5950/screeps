module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			creep.memory.hide = 0;
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
		var hide = creep.memory.hide;
		if(hide > 0) {
			creep.memory.hide--;
		}
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < creep.hitsMax) {
			creep.memory.hide = 40;
		}
		if(creep.hits < creep.hitsMax || creep.memory.healing == true || hide > 0) {
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

		// Tower Avoidance
		let towers = Game.rooms[room].find(FIND_STRUCTURES, {
                                                       filter: (s) => s.structureType == STRUCTURE_TOWER
                                                       });

		for(let tower in towers)
			if(tower.my) {
				break;
			}
			if(tower.energy > 9) {
				flag = Game.flags.sapperSafe;
				creep.memory.hide = 20;
				creep.moveTo(flag);
				return;
			}
			if(tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5, { filter: (c) => c.carry.energy > 0 }) != undefined) {
				creep.memory.hide = 20;
				flag.Game.flags.sapperSafe;
				creep.moveTo(flag);
				return;
			}
		}

		// KILL SHIT
		if(creep.attackSavedTarget()) return;
		if(creep.attackHostileStructure("FLAG")) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
		if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
		//if(creep.attackHostileStructure(STRUCTURE_WALL)) return;
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
