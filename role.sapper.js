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
                        }
                }
		creep.getAwayFromEdge();
		var flag = Game.flags.sapper;		
		var frange = 999;
		var hide = 0;
		if(hide > 0) {
			creep.memory.hide -= 1;
		}
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < creep.hitsMax && hide == 0) {
			creep.memory.hide = 10;
		}
		if(creep.hits < creep.hitsMax || creep.memory.healing == true || hide > 0) {
			creep.memory.healing = true;
			flag = Game.flags.sapperSafe;
			frange = 0;
		}
		var range = 0;
		if(flag != undefined) {
			range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			}
		}

		// Tower Avoidance
		let towers = Game.flags.sapper.room.find(FIND_STRUCTURES, {
                                                       filter: (s) => s.structureType == STRUCTURE_TOWER
                                                       });

		if(towers.length) {
			for(let towerI in towers) {
				let tower = towers[towerI];
				if(tower.my) {
					break;
				}
				if(tower.energy > 9) {
					flag = Game.flags.sapperSafe;
					if(hide <= 0) {
						console.log("Running away, tower has energy")
					}
					creep.memory.hide = 4;
					if(range > 0) {
						creep.moveTo(flag);
					return;
				}
				let blah = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 2, { filter: (c) => c.carry.energy > 0 })
					flag = Game.flags.sapperSafe;
                                        if(hide <= 0) {
                                                console.log("Running away, tower has a refiller nearby.")
                                        }
					creep.memory.hide = 4;
					if(range > 0) {
						creep.moveTo(flag);
					}
				}
			}
		} else if ( creep.room != Game.flags.sapper.room ) {
			creep.memory.hide = 5;
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
