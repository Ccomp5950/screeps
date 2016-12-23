module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning == true) {
			creep.setupSpawn()
			creep.memory.loading = null;
			creep.memory.unloading = null;
			creep.memory.lab = null;
			creep.memory.loading_from = null;
			creep.memory.unloading_amount = null;
                        return;
                }
		creep.memory.age = Game.time - creep.memory.spawnTime;
		let hasStorage = false;
		let hasTerminal = false;
		creep.memory.setupTime = 1;
		creep.setupFlag();

		let carry = _.sum(creep.carry);
		if (creep.memory.working == true && carry == 0) {
			creep.memory.loading = null;
			creep.memory.unloading = null;
			creep.memory.lab = null;
			creep.memory.loading_from = null;
			creep.memory.working = false;
		}
		else if (creep.memory.working == false && carry > 0) {
			creep.memory.working = true;
		}

		let storage = creep.room.storage;
		if(storage != undefined) {
			hasStorage = true;
		}
		let terminal = creep.room.terminal;
		if(terminal != undefined) {
			hasTerminal = true;
		}


		var amount = null;
		if(creep.memory.working) {
			
			let target = Game.getObjectById(creep.memory.lab);
			if(target != undefined) {
				if(creep.pos.getRangeTo(target) > 1) {
					creep.moveTo(target);
					return;
				}
				creep.transfer(target, creep.memory.loading);
				return;
			
			} else {
				console.log("Something fucked up happened with this lab tender");;
			}
		

		} else { // grab energy

			if(creep.memory.loading != null) {
				let target = null;
				if(creep.memory.loading_from == "lab") {
					target = Game.getObjectById(creep.memory.lab);
	                                if(creep.pos.getRangeTo(target) > 1) {
	                                        creep.moveTo(target);
	                                        return;
	                                }	
	                                creep.withdraw(target, creep.memory.loading);
					if(creep.room.storage != undefined && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity - 1000) {
						creep.memory.lab = creep.room.storage.id;
					} else if(creep.room.terminal != undefined && _.sum(creep.room.terminal.store) < creep.room.terminal.storeCapacity) {
						creep.memory.lab = creep.room.terminal.id;
					} else if(creep.room.storage != undefined){
						creep.memory.lab = creep.room.storage.id;
					}
	                                return;
				}
			
				target = creep.room[creep.memory.loading_from];
				if(creep.pos.getRangeTo(target) > 1) {
					creep.moveTo(target);
					return;
				}
				creep.withdraw(target, creep.memory.loading);
				return;
			}

			

			for(let index in creep.room.memory.labs) {
				let labMem = creep.room.memory.labs[index];
				if(labMem.mineral == null) {
					continue;
				}
				let lab = Game.getObjectById(labMem.id);
				if(lab == undefined) {
					continue;
				}
				if((lab.mineralAmount < 2000 && labMem.react == false && labMem.emptyMe == false) || lab.mineralAmount < 1200 && labMem.react == true && labMem.emptyMe == false) {
					if(hasStorage && storage.store[labMem.mineral] != undefined) {
						creep.memory.lab = lab.id;
						creep.memory.loading = labMem.mineral;
						creep.memory.loading_from = "storage";
						if(creep.pos.getRangeTo(storage) > 1) {
							creep.moveTo(storage);
						}
						return;
					} else if(hasTerminal && terminal.store[labMem.mineral] != undefined) {
						creep.memory.lab = lab.id;
						creep.memory.loading = labMem.mineral;
						creep.memory.loading_from = "terminal";
                                                if(creep.pos.getRangeTo(terminal) > 1) {
                                                        creep.moveTo(terminal);
                                                }
                                                return;
					}
				}
				if(labMem.emptyMe == true && (labMem.active == false && lab.mineralAmount >= 1) 
						|| (labMem.active == true && (lab.mineralAmount >= 2000 || (lab.mineralAmount >= 400 && (labMem.mineral == "ZK" || labMem.mineral == "UL" || labmem.mineral == "G"))))  
				  )

				
						creep.memory.lab = lab.id;
						creep.memory.loading = labMem.mineral;
						creep.memory.loading_from = "lab";
                                                return;
				}

			}
			if(creep.ticksToLive < 20) {
				creep.suicide();
				return;
			}
			creep.approachAssignedFlag(0);	
		}
    }
};
