var roleBuilder = require('role.builder');


module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
	creep.memory.currentRole = "repairer";

	if(creep.room.memory.boostRepair == true && creep.getBoosted("XLH2O")) return;
	creep.memory.needsBoosted = false;

	if(creep.memory.role == "remoterepairer") {
		creep.memory.MyFlag = "remoterepairer";
		if(creep.approachAssignedFlag(999) == false) return;
	} else {
		if(creep.memory.spawnRoom != creep.room.name) {
			var roompos = new RoomPosition(25, 25, creep.memory.spawnRoom);
			creep.repairing = null;
			creep.moveTo(roompos);
			return;
		} else {
	                if(creep.getAwayFromEdge()) {
	                        return;
	                }
		}

		
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
			structure = _(creep.find(FIND_STRUCTURES)).filter((s) => (s.structureType == STRUCTURE_RAMPART && s.hits < 5000) && s.isBeingHandled(creep) == false).min(s=>s.hits);
			if(structure == Infinity) structure = undefined;
		}
		if(structure == undefined) { 
			// CRITICAL!!!
			structure = _(creep.room.find(FIND_STRUCTURES))
				.filter((s) => ((s.hits + 1) < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART && (s.hits / s.hitsMax < 0.05) && s.isBeingHandled(creep) == false)
				.min(s=>s.hits / s.hitsMax);
                    if(structure == Infinity) {
                        structure = undefined;
                    }

			
		}
		// Anythign that doesn't decay.
                if(structure == undefined) {
			structure = _(creep.room.find(FIND_STRUCTURES))
				.filter((s) => (s.structureType != STRUCTURE_ROAD 
						&& s.structureType != STRUCTURE_CONTAINER
						&& s.structureType != STRUCTURE_RAMPART
						&& s.structureType != STRUCTURE_WALL)
					&& (s.hits + 1) < s.hitsMax
					&& s.isBeingHandled(creep) == false)
				.min(s=>s.hits / s.hitsMax);

                    if(structure == Infinity) {
                        structure = undefined;
                    }

                }
		// Roads and containers
                if(structure == undefined) {
                        structure = _(creep.room.find(FIND_STRUCTURES))
                                .filter((s) => (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hitsMax - s.hits > 1500 && s.isBeingHandled(creep) == false)
                                .min(s=>s.hits / s.hitsMax);
	                    if(structure == Infinity) {
        	                structure = undefined;
	                    }

                }
		// Ramparts only if storage is > 50k
                if(structure == undefined) {
			storage = creep.room.storage;
			if(storage == undefined || storage.store.energy > 50000) {
				var hitsMax = RAMPART_HITS_MAX[creep.room.controller.level];
				structure = _(creep.room.find(FIND_STRUCTURES))
					.filter((s) => (s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL) && s.hits < hitsMax && s.hits < s.hitsMax && s.isBeingHandled(creep) == false)
	                                .min(s=>s.hits / hitsMax);
	                    if(structure == Infinity) {
	                        structure = undefined;
	                    }

			}
                }
            // if we find one
            if (structure != undefined) {
		if(creep.memory.repairing == undefined || creep.memory.repairing != structure.id) {
			creep.memory.repairCached = 0;
		}
		creep.memory.repairing = structure.id;
		if(creep.approachPos(structure.pos, 3)) return;
		// try to repair it, if it is out of range
		let debugRep = creep.repairThis(structure);
		//console.log("["+ creep.name + "] structure = " + structure.id + " and repairThis returned: " + debugRep);
		//creep.repairThis(structure);
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
