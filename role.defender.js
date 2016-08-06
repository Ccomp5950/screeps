module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			creep.setupSpawn();
		}
		creep.setupFlag();

		let flag = Game.flags[creep.memory.MyFlag];
		var target = null;
		target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target != undefined) {
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
				return;
		} 
                if(creep.hits < creep.hitsMax) {
                        creep.heal(creep);
                }
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 999) {
                                creep.moveTo(flag);
				return;
                        }
                }
                target = creep.pos.findClosestByRange(FIND_CREEPS, {
                                        filter: (c) => c.my == true && c.id != creep.id && c.hits < c.hitsMax
                        });
                if (target != undefined) {
                        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                        }
                                return;
                }
		creep.approachAssignedFlag(0);

        }
        
    
};
