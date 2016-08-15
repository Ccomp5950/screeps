module.exports = function() {

	StructureLink.prototype.getPriority =
	function(){
		let link = this;
		if(link.room.memory.links == undefined) {
			link.room.memory.links = {};
		}
		let linkPos = link.pos.x.toString() + "_" + link.pos.y.toString();
		let linkMem = link.room.memory.links[linkPos];
		if(linkMem = undefined) {
			let linkMem = {id: link.id, priority: 0};
			link.room.memory.links[linkPos] = linkMem
		}
		return priority
	};

	StructureLink.prototype.transferToLowerPriority =
	function() {
		let link = this;
		if(link.cooldown > 0) {
			return;
		}
		let linkPos = link.pos.x.toString() + "_" + link.pos.y.toString();
		let linkMem = link.room.memory.links[linkPos];
		console.log("[" + linkPos + "] has a priority of " + linkMem.priority);
		for(let i = 0; i < linkMem.priority; i++) {
			let targets = link.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK && s.getPriority == i});
			for(let targetM in targets) {
				let target = targets[targetM];
				if(target.energy < target.energyCapacity) {
					let energyCapacity = target.energyCapacity - target.energy;
					let transferEnergy = Math.max(link.energy, energyCapacity);
					if(link.tranferEnergy(target, transferEnergy) == OK) {
						target.energy += transferEnergy;
						return;
					}					
				}
			}
		}
	}
};
