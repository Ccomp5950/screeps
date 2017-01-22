module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
			creep.setupSpawn()
                        return;
                }
		if(creep.memory.energyPerTick == undefined) creep.memory.energyPerTick = creep.getActiveBodyparts(WORK) * 2

		var energyPerTick = creep.memory.energyPerTick;
		creep.setupFlag();
		var ignorecreeps = null;
		if(creep.pos.roomName != creep.memory.spawnRoom) {
			ignorecreeps = true;
		}
		var skminer = false;
		if(creep.memory.role == "skminer") skminer = true;

		if(skminer) {
                        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS,5, {
	                                filter: (c) => c.owner.username == "Invader" || c.owner.username == "Source Keeper"  || (c.checkIfAlly() == false)
		                        });
			if(targets.length != 0) {
				creep.approachAssignedFlag(0);
				if(targets.length == 1) {
					creep.rangedAttack(targets[0])
				} else {
					creep.rangedMassAttack();
				}
				if(creep.getActiveBodyparts(ATTACK) == 0 || creep.attackAdjacentCreep() == false) {
					creep.heal(creep);
					return
				} else {
					return;
				}
			}

			if(creep.hits < creep.hitsMax) {
				creep.heal(creep);
			}
			
		}
                if(_.sum(creep.carry) < creep.carryCapacity) {
                        let energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
			for(let resource in energy) {
				creep.pickup(energy[resource])
			//	return;
			}
		}
		if(creep.approachAssignedFlag(0,ignorecreeps) == false) {
			return;
		}
		var structure = null;
		if(creep.memory.container == undefined || creep.memory.container == null) {
			creep.memory.container = -1;
		}
		if(creep.memory.container == null || creep.memory.container == -1|| Game.getObjectById(creep.memory.container) == null) {
			structure = creep.pos.findInRange(FIND_STRUCTURES,1, {
			filter: (s) => (s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity)
				});

			if(structure.length == 0) {
		          	structure = creep.pos.findInRange(FIND_STRUCTURES,2, {
	                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
			            });
			}
			if(structure.length) {
				structure = structure[0];
				creep.memory.container = structure.id;
			}
		} else {
			structure = Game.getObjectById(creep.memory.container)
		}

		

		if(_.sum(creep.carry) < creep.carryCapacity) {
			creep.mine();
		}
                if(creep.pos.getRangeTo(structure) > 1) {
			creep.memory.container = null;
			structure = null;
                        }
		if (creep.memory.container == -1) {
                        structure = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
                        if(creep.carry.energy >= 50 && structure != null) {
                                if(creep.build(structure) == OK) {
                                        return;
                                }

                        }
                        return;
			creep.drop(RESOURCE_ENERGY);

		} else {
                        if(creep.pos.getRangeTo(structure) > 1) {
                                game.memory.container = null;
                        }
			if(structure != undefined) {
	                        creep.memory.container = structure.id;
				if(structure.hits <= 150000) {
					creep.memory.repBox = true;
				}
				if(structure.hits == structure.hitsMax) {
					creep.memory.repBox = false;
				}
				if(creep.carry.energy >= 50 && creep.memory.repBox == true) {
	                                creep.repair(structure);
	                                return;
	                        }
				if(creep.memory.repBox != true && _.sum(creep.carry) >= creep.carryCapacity - energyPerTick) creep.transfer(structure, RESOURCE_ENERGY);
			} 
		}
    }
};
