module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
	 creep.memory.currentRole = "repairer";
	creep.setupFlag();
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
	creep.memory.lastChecked = null;
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
		creep.memory.lastChecked = "Saved";
		if(creep.repairThis(target)) return;

		//Containers
                target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax - 50000 && s.isBeingHandled(creep) == false).min(s=>s.hits);
		creep.memory.lastChecked = "Containers";
		if(creep.repairThis(target)) return;

		//Roads that are down 4000 hits.
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax && s.isBeingHandled(creep) == false).min(s=>s.hits);
		creep.memory.lastChecked = "Roads";
		if(creep.repairThis(target)) return;

		// Repair everything else.
		creep.memory.lastChecked = "Everything but walls and ramparts";
		target = _(creep.room.find(FIND_STRUCTURES)).filter((s) => s.structureType != STRUCTURE_WALL 
									&& s.structureType != STRUCTURE_RAMPART 
									&& s.hits < s.hitsMax && s.isBeingHandled(creep) == false).min(s=> s.hits/s.hitsMax);
		if(creep.repairThis(target)) return;

		// CONSTRUCTION TIME.
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                creep.memory.lastChecked = "Construction";
                if(constructionSites.length > 0) {
                        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

                        if(creep.buildThis(target)) return;
                }


		storage = creep.room.storage;
		creep.memory.lastChecked = "Ramparts and Walls";
		if(storage == undefined || storage.store.energy > 50000) {
			var hitsMax = RAMPART_HITS_MAX[creep.room.controller.level];
			var config_hitsMax = getMaxDefenseHits();
			if(hitsMax > config_hitsMax) hitsMax = config_hitsMax;
			target = _(creep.room.find(FIND_STRUCTURES))
			.filter((s) => (s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL) && s.hits < hitsMax && s.hits < s.hitsMax && s.isBeingHandled(creep) == false)
			.min(s=>s.hits / hitsMax);
			if(structure != Infinity) {
				if(creep.repairThis(target)) return;
			}

																										                            }

		creep.memory.lastChecked = "Heading to flag";
		creep.approachAssignedFlag(0);
        }
        else {
		creep.memory.lastChecked = "Grabbing energy";
		creep.customharvest();
        }

    }
};
