module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}

		var flag = Game.flags["raid"];
		if(flag != undefined) {
			var range = creep.pos.getRangeTo(flag);
			if(range > 999) {
				creep.moveTo(flag);
				return;
			}
		}

		target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                                }
                return;
                }
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                               }
                return;
            	}

                var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                                }
                return;
                }


                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                if (target != undefined) {
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                                }
                return;
                }
        }
    
};
