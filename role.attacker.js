module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(Game.flags["attack"] != undefined) {
			var range = creep.pos.getRangeTo(Game.flags.attack);
			if(range > 999) {
				creep.moveTo(Game.flags.attack);
				return;
			}
		}

	        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (target != undefined) {
	                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(target) == ERR_NO_PATH) 
				}
		return;
		}
		target = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target) == ERR_NO_PATH)
                                }
                return;
                }
                target = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target) == ERR_NO_PATH)
                                }
                return;
                }

                target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target) == ERR_NO_PATH)
                                }
                return;
                }
        }
    
};
