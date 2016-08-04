module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			creep.memory.healingother = false;
			return;
		}
		/*
		if(creep.getAwayFromEdge()) {
			return;
		}
		*/
		var flag = Game.flags[creep.name];		
		var frange = 999;
		var taunt = true;
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		} else {
			creep.memory.healingothers = false;
		}

		if(creep.hits < 1200 || creep.memory.healing == true) {
			taunt = false;
			creep.memory.healing = true;
			creep.memory.healingothers = false;
			flagName = creep.name + "safe";
			flag = Game.flags[flagName];
			frange = 0;
		}
		if(flag != undefined && creep.memory.healingother == false) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			} else if(taunt) {
				creep.say("Ha missed!";				
			}
		}
		if(!creep.memory.healing && creep.hits == creep.hitsMax) {
			var targets = creep.pos.findInRange(FIND_CREEPS, 3 ,{
					filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax
			});
			if(targets.length > 0) {
				
				if(creep.pos.getRangeTo(targets[0]) == 1) {
					if(creep.heal(targets[0]) == 0) {
						creep.memory.healingother = true;
					}
				} else {
				    if(creep.rangedHeal(targets[0]) == 0) {
					creep.moveTo(targets[0]);
					creep.memory.healingother = true;
				    }
				}
			
			} else {
				creep.memory.healingother = false;
			}
                return
		}
                else if(creep.memory.healing || creep.hits != creep.hitsMax) {
                        if(creep.heal(creep) == 0) {
				creep.memory.healingothers = false;
                                return;
                        }
                }

        }
    
};
