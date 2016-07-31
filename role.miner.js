module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
                if(Game.flags[creep.name] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags[creep.name]);
                        if(range > 0) {
                                creep.moveTo(Game.flags[creep.name]);
				return;
                        }
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
			console.log("HRM");
			creep.mine();
		}

		if (structure != null) {
			creep.memory.container = structure.id;
	                // try to transfer energy, if it is not in range
	               	creep.transfer(structure, RESOURCE_ENERGY); 
		}
    }
};
