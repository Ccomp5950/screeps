module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function(creep) {
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
				filter: (s) => s.energy > creep.carryCapacity || s.ticksToRegeneration < 30 
				});
			if(source) {
				creep.memory.source = source.id;
			} else {
				creep.memory.source = null;
			}
            }
	    if(creep.memory.source) {
		    source = Game.getObjectById(creep.memory.source);
			if(source.energy == 0 && source.ticksToRegneration > 30) {
				creep.memory.source = null;
				return;
			}
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                if(creep.moveTo(source) == ERR_NO_PATH) {
				creep.memory.source = null;
			}
		    }
            }
        }
};
