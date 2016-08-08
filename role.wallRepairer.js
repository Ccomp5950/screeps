var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
	    creep.memory.repair = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source  = null;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find all walls in the room
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });
	    if(walls.length) {
		    var maxPercentage = Memory.wallMinHealth / walls[0].hitsMax;
	            var target = undefined;
		    var potentialTarget = creep.memory.repair;
		    var tmpTarget = Game.getObjectById(creep.memory.repair);
		    if(tmpTarget != undefined) {
			if(tmpTarget.hits > Memory.wallMinHealth) {
	       			target = tmpTarget;
			} else {
				creep.memory.repair = null;
			}
		    } else {
			creep.memory.repair = null;
		    }

	            // loop with increasing percentages
		    if(target == undefined) {
		            for (let percentage = 0.0001; percentage < maxPercentage; percentage += percentage + 0.0001){
		                // find a wall with less than percentage hits

		                // for some reason this doesn't work
		                // target = creep.pos.findClosestByPath(walls, {
		                //     filter: (s) => s.hits / s.hitsMax < percentage
		                // });

		                // so we have to use this
		                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		                    filter: (s) => s.structureType == STRUCTURE_WALL &&
		                                   s.hits / s.hitsMax < percentage
		                });
				//if (Memory.wallsMinHealth / .hitsMax < percentage){
				//	break;
				//}
		                // if there is one
		                if (target != undefined) {
				    creep.memory.repair = target.id;
		                    // break the loop
		                    break;
		                }
				if (percentage >= 0.01) {
					percentage += 0.0099;
				}
				else if (percentage >= 0.001) {
					percentage += 0.0009;
				}
        	    	  }
  		   }
	    }

            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
		creep.customharvest();
        }

    }
};
