module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function(creep) {
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			creep.memory.source = source.id;
            }
	    source = Game.getObjectById(creep.memory.source);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        };
};
