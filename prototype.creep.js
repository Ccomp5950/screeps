module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function(creep) {
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			creep.memory.source = source.id;
            }
	    source = Game.getObjectByID(creep.memory.source);
            if (creep.memory.source && creep.harvest(Game.getObjectByID(creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.source);
            }
        };
};
