module.exports = function() {

	StructureLink.prototype.getPriority =
	function(){
		let link = this;
		if(link.room.memory.links == undefined) {
			link.room.memory.links = {};
		}
		let linkPos = link.pos.x.toString() + "_" + link.pos.y.toString();
		let linkMem = link.room.memory.links[linkPos];
		if(linkMem == undefined) {
			linkMem = {id: link.id, priority: 0};
			link.room.memory.links[linkPos] = linkMem
		}
		return linkMem.priority;
	};

	StructureLink.prototype.transferToLowerPriority =
	function() {
		let link = this;
		if(link.cooldown > 0 && link.energy < link.energyCapacity) {
			return;
		}
		let linkPos = link.pos.x.toString() + "_" + link.pos.y.toString();
		let linkMem = link.room.memory.links[linkPos];
		for(let i = 0; i < linkMem.priority; i++) {
			let targets = link.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK && s.getPriority() == i});
			for(let targetM in targets) {
				let target = targets[targetM];
				if(target.energy < target.energyCapacity) {
					let energyCapacity = target.energyCapacity - target.energy;
					let transferEnergy = Math.min(link.energy, energyCapacity);
					let result = link.transferEnergy(target, transferEnergy);
					if(result == 0) {
						target.energy += transferEnergy;
						return;
					} else {
						console.log("[" + linkPos + "] trying to send to (" + target.pos.x + "/" + target.pos.y + ") got result: " + result);
					}
						
										
				}
			}
		}
	}
};
