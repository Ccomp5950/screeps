module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
                        if(creep.memory.spawnTime == null) {
                                creep.memory.spawnTime = Game.time;
                        }
			return;
		}
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
                let flag = Game.flags[creep.name];
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 999) {
                                creep.moveTo(flag);
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

		let flag = Game.flags[creep.name];
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.moveTo(flag);
                        } 
			else {
				if(creep.memory.setupTime == null) {
					creep.memory.setupTime = Game.time - creep.memory.spawnTime;
				}
			}
                }

        }
        
    
};
