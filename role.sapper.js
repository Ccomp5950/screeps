module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning == true) {
			creep.setupSpawn();
			creep.memory.towercheck = 0;
			creep.memory.hide = 0;
			return;
		}
                if(creep.memory.healing) {
                        if(creep.heal(creep) == 0) {
                        }
                }
		if(creep.gotoWaypoint()) return;
		//creep.getAwayFromEdge();
		var flag = Game.flags.sapper;		
		var frange = 999;
		var hide = creep.memory.hide;
		var towercheck = creep.memory.towercheck;
		if(hide > 0) {
			creep.memory.hide -= 1;
		}
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
			creep.memory.towercheck -= 1;
			towercheck = creep.memory.towercheck;
		}
		if(creep.hits < creep.hitsMax) {
			creep.memory.towercheck = 25;
			towercheck = 25;
			creep.memory.hide = 5;
			hide = 5;
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

		if(towercheck > 0 && Game.flags.sapper.room != undefined) {
		// Tower Avoidance
		
			let towers = Game.flags.sapper.room.find(FIND_STRUCTURES, {
                                                       filter: (s) => s.structureType == STRUCTURE_TOWER
                                                       });

			if(towers.length > 0) {
				for(let towerI in towers) {
					let tower = towers[towerI];
					range = Game.flags.sapperSafe.pos.getRangeTo(creep);
					if(tower.my) {
						break;
					}
					if(tower.energy > 9) {
						flag = Game.flags.sapperSafe;
						creep.memory.hide = 4;
						if(range > 0) {
							creep.moveTo(flag);
						}
						return;
					}
					let blah = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 1, { filter: (c) => c.carry.energy > 0 })
					if(blah.length > 0) {
						flag = Game.flags.sapperSafe;
						creep.memory.hide = 2;
						if(range > 0) {
							creep.moveTo(flag);
						}
						return;
					}
				}
			} else if (Game.flags.sapper.room == undefined &&  creep.room.name != Game.flags.sapper.room.name ) {
				creep.memory.towercheck = 25;
				creep.memory.hide = 5;
				
				return;
			}
		}
		creep.setRespawnTime();
		// KILL SHIT
		if(creep.attackSavedTarget()) return;
		if(creep.attackHostileStructure("FLAG")) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
		if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
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
