module.exports = function() {
    // create a new function for StructureSpawn
   	Room.prototype.getCreepSpawnTicks =
        function() {
		let room = this;
		let value = 0;
		let creeps = _.filter(Game.creeps, (c) => c.memory.spawnRoom = room.name);
		for(let creepM in creeps) {
			let creep = creeps[creepM];
			value+= creep.calculateSpawnTicks();
		}
	}
};
