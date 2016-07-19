module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function(creep) {
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if(source) {
				creep.memory.source = source.id;
			} else {
				creep.memory.source = null;
			}
            }
	    if(creep.memory.source) {
		    source = Game.getObjectById(creep.memory.source);
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                if(creep.moveTo(source) == ERR_NO_PATH) {
				creep.memory.source = null;
			}
		    }
            }
        }
};
