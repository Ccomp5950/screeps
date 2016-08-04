module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}

		if(creep.getAwayFromEdge()) {
			return;
		}
		var flag = Game.flags.sapper;		
		var frange = 999;
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < 800 || creep.memory.healing == true) {
			creep.memory.healing = true;
			flag = Game.flags.sapperSafe;
		}
		if(flag != undefined && (creep.memory.healingother != null && creep.memory.healingother == false)) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
			}
		}
		if(!creep.memory.healing && creep.hits == creep.hitsMax) {
			var targets = creep.pos.findInRange(FIND_CREEPS, 3 ,{
					filter: (c) => c.my == true
			});
			if(targets.length > 0) {
				creep.memory.healingother = true;
				if(creep.pos.getRangeTo(targets[0]) == 1) {
					creep.heal(targets[0]);
				} else {
				    creep.rangedHeal(targets[0]);
				}
			
			} else {
				creep.memory.healingother = false;
			}
                return
		}
                else if(creep.memory.healing || creep.hits != creep.hitsMax) {
                        if(creep.heal(creep) == 0) {
                                return;
                        }
                }

        }
    
};
