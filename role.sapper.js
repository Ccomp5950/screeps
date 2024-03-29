module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning == true) {
			creep.setupSpawn();
			creep.memory.towercheck = 0;
			creep.memory.hide = 0;
			creep.memory.Healer = -1;
			creep.memory.needsBoosted = true;
			creep.memory.suicide = false;
			return;
		}
		if(creep.memory.getToFlag == undefined) creep.memory.getToFlag = true;
                if(creep.getActiveBodyparts(MOVE) == 10) {
                        if(creep.getBoosted("XZHO2")) return;
                }
		if(creep.getBoosted("XZH2O")) return;
		creep.memory.needsBoosted = false;
                var healer = Game.getObjectById(creep.memory.Healer);
		var flag = Game.flags.sapper;	
		creep.getAwayFromEdge();
		if(creep.memory.role == "solosapper") {
			healer = creep.id
		} else {
	
			if(healer != undefined) {
	                        if(creep.pos.getRangeTo(flag) < 999) {
	                                if(creep.pos.getRangeTo(healer) > 1 || healer.fatigue != 0) {
	                                        return;
	                                }
	                        }
	                        if(creep.pos.getRangeTo(healer) > 999) {
					creep.getAwayFromEdge();
	                                return;
	                        }
	                } else {
				return;
			}
		}
                if(creep.memory.getToFlag == true) {
			creep.memory.MyFlag = "sapper"
			if(creep.approachAssignedFlag(999,true,50) == true) {
				creep.memory.getToFlag = false;
			} else {
				return;
			}
		}
		//if(creep.gotoWaypoint()) return;
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
		if(creep.hits < Math.min(3000, creep.hitsMax - 500)) {
			creep.say ("YIP!");
			creep.memory.towercheck = 50;
			towercheck = 10;
			creep.memory.hide = 5;
			hide = 5;
		}
		if(creep.memory.healing == true || hide > 0) {
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
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		//if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		//if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
		//if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
		//if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
		if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
		//if(creep.attackHostileStructure(STRUCTURE_ROAD)) return;
		if(creep.attackHostileStructure(STRUCTURE_LAB)) return;
		
		if(creep.attackHostileStructure(STRUCTURE_WALL)) return;
		//if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
		if(creep.attackHostileStructure(STRUCTURE_STORAGE,true)) return;
		if(creep.attackHostileStructure(STRUCTURE_EXTENSION,true)) return;
		//if(creep.attackHostileStructure(STRUCTURE_ROAD)) return;
		if(creep.attackHostileStructure(STRUCTURE_RAMPART,true)) return;
		//if(creep.attackHostileStructure("ANYTHING")) return;
                if(flag != undefined) {
                        range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.moveTo(flag);
                                return;
                        }
			if(creep.memory.suicide == true) {
				let index = 1;
				let say = ["Welcome!", "Enjoy your", "stay!"];
				if(creep.memory.suisay == undefined) {
					creep.memory.suisay = 2;
				} else {
					index = creep.memory.suisay;
					creep.memory.suisay = creep.memory.suisay + 1;
				}
				if(say[index] != undefined) {
					creep.say(say[index], true);
					return;
				} else {
					if(creep.memory.dienow == undefined) {
						creep.say("Bye!", true);
						healer.say("^_^", true);
						creep.memory.dienow = true;
						return;
					} else {
						creep.suicide();
						healer.suicide();
					}
					
				}
			}	
                }

                

        }
    
};
