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
		if(creep.memory.container == null || Game.getObjectById(creep.memory.container) == undefined) {
	          	structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
	            });
		} else {
			structure = Game.getObjectById(creep.memory.container)
		}
	    
		creep.mine();

		if (structure != undefined) {
			creep.memory.container = structure.id;
	                // try to transfer energy, if it is not in range
			if(creep.carry > 0) {
		               	creep.transfer(structure, RESOURCE_ENERGY); 
			}
		}
    }
};
