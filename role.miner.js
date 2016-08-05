module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			if(creep.memory.spawnTime == null) {
				creep.memory.spawnTime = Game.time;
			}
			if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
				creep.memory.myFlag = creep.findMiningFlag();
				if(creep.memory.myFlag != -1) {
					console.log("[" + creep.name + "] I'm grabbing the position at: " + creep.memory.myFlag);
					creep.claimMiningFlag();
				}
			}
                        return;
                }
		if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
			creep.memory.myFlag = creep.findMiningFlag();
			if(creep.memory.myFlag == -1) {
				if(creep.memory.spammed == null) {				
					console.log("Miner can't find a flag " + creep.name);	
					creep.memory.spammed = true;
				}
				return;
			} 
			else {
				console.log("[" + creep.name + "] I'm grabbing the position at: " + creep.memory.myFlag);
			}
			
		}
		let flag = Game.flags[creep.memory.myFlag];
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
				creep.memory.setupTime = Game.time - creep.memory.spawnTime;
                                creep.moveTo(flag);
				return;
                        }
                } else {
			console.log("Miner cannot find a flag: " + creep.name);
		}
		var structure = null;
		if(creep.memory.container == null) {
			creep.memory.container = null;
		}
		if(creep.memory.container == null || Game.getObjectById(creep.memory.container) == null) {
	          	structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
	            });
		} else {
			structure = Game.getObjectById(creep.memory.container)
		}
	    
		if(creep.carry[RESOURCE_ENERGY] < 50) {
			creep.mine();
		}

		if (structure != null) {
			creep.memory.container = structure.id;
	                // try to transfer energy, if it is not in range
	               	creep.transfer(structure, RESOURCE_ENERGY); 
		} else {
			structure = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
			if(structure != null) {
				if(creep.build(structure) == OK) {
					return;
				}
				
			}
			creep.drop(RESOURCE_ENERGY);
		}
    }
};
