module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning == true) {
			creep.memory.hop = true;
			creep.memory.healingother = false;
			creep.setupSpawn();
			return;
		}
		if(creep.memory.runAt == undefined) {
			creep.memory.runAt = (creep.getActiveBodyparts(HEAL) * 100) + 200;
		}
		creep.setupFlag();

		if(creep.getBoosted("LHO2")) return;

                if(creep.memory.healing || creep.hits != creep.hitsMax) {
                        creep.memory.healingothers = false;
                }
                if(creep.memory.healingothers == false) {
                        creep.heal(creep);
                }


		if(creep.gotoWaypoint()) return;
		/*
		if(creep.getAwayFromEdge()) {
			return;
		}
		*/
		var flag = Game.flags[creep.memory.MyFlag];
		if(flag == undefined) {
			creep.memory.MyFlag = -1;
			return;
		}
		var frange = 0;
		var taunt = false;
		if(creep.memory.hop == false) {
			creep.getAwayFromEdge()
		}
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		} else {
			creep.memory.healingothers = false;
		}
		let danger = false;
		if(creep.room == flag.room) {
			danger = true;
		}

		if(creep.hits < creep.memory.runAt || creep.memory.healing == true) {
			taunt = false;
			creep.memory.healing = true;
			creep.memory.healingothers = false;
			flagName = "safe";
			flag = Game.flags[flagName];
			frange = 0;
		}
		if(flag != undefined && creep.memory.healingother == false) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			} else {
				if(taunt) creep.say("Ha Missed!",true);
				creep.setRespawnTime();
			}
		}
		if(!creep.memory.healing && creep.hits >= (creep.hitsMax - 1500)) {
			var targets = creep.pos.findInRange(FIND_CREEPS, 3 ,{
					filter: (c) => c.my == true && c.id != creep.id && c.hits < (c.hitsMax - 600)
			});
			if(targets.length > 0) {
				
				if(creep.pos.getRangeTo(targets[0]) == 1) {
					if(creep.heal(targets[0]) == 0) {
						creep.memory.healingother = true;
					}
				} else {
				    if(creep.rangedHeal(targets[0]) == 0) {
					creep.memory.healingother = true;
				    }
				}
			
			} else {
	                        
 				if(creep.attackSavedTarget()) return;
	                        if(creep.attackHostileStructure("FLAG")) return;
	                        if(creep.attackHostileStructure(STRUCTURE_SPAWN)) return;
	                        if(creep.attackHostileStructure(STRUCTURE_TOWER)) return;
	                        if(creep.attackHostileStructure(STRUCTURE_EXTENSION)) return;
	                        if(creep.attackHostileStructure(STRUCTURE_LINK)) return;
	                        if(creep.attackHostileStructure(STRUCTURE_STORAGE)) return;
	                        if(creep.attackHostileStructure(STRUCTURE_WALL)) return;
	                        if(creep.attackHostileStructure(FIND_CONSTRUCTION_SITES)) return;
				
				creep.memory.healingother = false;
			}
                return
		}
                else if(creep.memory.healing || creep.hits != creep.hitsMax) {
                        if(creep.heal(creep) == 0) {
				creep.memory.healingothers = false;
                        }
                }

        }
    
};
