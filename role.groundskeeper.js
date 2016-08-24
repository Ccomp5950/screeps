module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
	    creep.memory.repair = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source = null;
	    creep.memory.repair = null;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {

		var wallMinHealth = Memory.wallMinHealth;
		if(creep.room.memory != undefined && creep.room.memory.wallMinHealth != undefined) {
			wallMinHealth = creep.room.memory.wallMinHealth;
		}

		var rampartMinHealth = Memory.rampartMinHealth;
		if(creep.room.memory != undefined && creep.room.memory.rampartMinHealth != undefined) {
			rampartMinHealth = creep.room.memory.rampartMinHealth;
		}


		//Saved Target
		var target = Game.getObjectById(creep.memory.repair);
		if(creep.repairThis(target)) return;

		//Roads that are down 4000 hits.
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax - 3800).min(s=>s.hits);
		if(creep.repairThis(target)) return;

		// Build Shit otherwise.
		let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(constructionSites.length > 0) {
			target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
			if(creep.buildThis(target)) return;
		}

		// Repair everything else.
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType != STRUCTURE_WALL 
									&& s.structureType != STRUCTURE_RAMPART 
									&& s.hits < s.hitsMax).min(s=>s.hits);
		if(creep.repairThis(target)) return;

		// Ramparts
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_RAMPART
									&& s.hits < rampartMinHealth).min(s=>s.hits);

		// Walls.
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_WALL
									&& s.hits < wallMinHealth).min(s=>s.hits);
                if(creep.repairThis(target)) return;

        }
        else {
		creep.customharvest();
        }

    }
};