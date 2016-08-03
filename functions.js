module.exports = function() {
	function checkRoles(role) {
		let count = 0;
		for(creepM in Game.creeps) {
			let creep = Game.creeps[creepM];
			if(creep.memory.role == role) {
				count++;
			}
		
		}
		return count;
	}
}
