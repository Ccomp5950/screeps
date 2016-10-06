var roleBuilder = require('role.builder');


module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
	creep.memory.currentRole = "repairer";
	if(creep.memory.role == "remoterepairer") {
		creep.memory.MyFlag = "remoterepairer";
		if(creep.approachAssignedFlag(999) == false) return;
	}

        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
	    creep.memory.repairing = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source = null;
	    creep.memory.repairing = null;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
		var structure = Game.getObjectById(creep.memory.repairing);
		if((structure != undefined && structure.hits == structure.hitsMax) || creep.memory.repairedCached >= 5) {
			creep.memory.repairCached = 0;
			structure = undefined;
		}
		if(structure == undefined) { 
			// CRITICAL!!!
			structure = _(creep.room.find(FIND_STRUCTURES))
				.filter((s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART && (s.hits / s.hitsMax < 0.05))
				.min(s=>s.hits / s.hitsMax);
		}
		// Anythign that doesn't decay.
                if(structure == undefined) {
			structure = _(creep.room.find(FIND_STRUCTURES))
				.filter((s) => (s.structureType != STRUCTURE_ROAD 
						&& s.structureType != STRUCTURE_CONTAINER
						&& s.structureType != STRUCTURE_RAMPART
						&& s.structureType != STRUCTURE_WALL)
					&& (s.hits + 1) < s.hitsMax)
				.min(s=>s.hits / s.hitsMax);
                }
		// Roads and containers
                if(structure == undefined) {
                        structure = _(creep.room.find(FIND_STRUCTURES))
                                .filter((s) => (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hitsMax - s.hits > 750)
                                .min(s=>s.hits / s.hitsMax);
                }
		// Ramparts only if storage is > 50k
                if(structure == undefined) {
			creep.say("1")
			storage = creep.room.storage;
			if(storage == undefined || storage.store.energy > 50000) {
				creep.say("2");
	                        structure = _(creep.room.find(FIND_STRUCTURES))
	                                .filter((s) => (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax))
	                                .min(s=>s.hits / s.hitsMax);
			}
                }
            // if we find one
            if (structure != undefined) {
		if(creep.memory.repairing == undefined || creep.memory.repairing != structure.id) {
			creep.memory.repairCached = 0;
		}
		creep.memory.repairing = structure.id;
                // try to repair it, if it is out of range
		creep.repairThis(structure);
		creep.memory.repairCached++;
		//structure.iGotIt(creep);
            }
            // if we can't fine one
            else {
	        if(creep.memory.role == "remoterepairer") {
	                creep.memory.MyFlag = "remoterepairer";
        	        creep.approachAssignedFlag(1)
			return;
		}
		roleBuilder.run(creep);
            }
        }
        else {
		creep.customharvest();
        }

    }
};
