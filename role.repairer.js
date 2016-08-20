var roleBuilder = require('role.builder');


module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
	creep.memory.currentRole = "repairer";
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
	    var structure = undefined;
	    var structureCandidates = [];
	    var criticalStructures = creep.room.find(FIND_STRUCTURES, {
		filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && (s.hits / s.hitsMax < 0.05)
	    });
	    for(let tmpStructure of criticalStructures) {
		if(tmpStructure.hits == 1) {
			structureCandidates.push(tmpStructure);
			structure = tmpStructure;
			break;
		}
			
	    }
	    var rampartCandidates = [];	    
	    if(structureCandidates.length == 0) {
		var nextCandidates = creep.room.find(FIND_STRUCTURES, {
                 filter: (s) => (s.hits /  s.hitsMax < 0.90)  && s.structureType != STRUCTURE_WALL
                                                                         });

                 var rampartMinHealth = Memory.rampartMinHealth;
                        if(creep.room.memory != undefined && creep.room.memory.rampartMinHealth != undefined) {
                                rampartMinHealth = creep.room.memory.rampartMinHealth;
                        }

		for(let tmpStructure of nextCandidates) {
	                if(tmpStructure.structureType == STRUCTURE_RAMPART && tmpStructure.hits < rampartMinHealth) {
	                        rampartCandidates.push(tmpStructure);
	                        continue;
	                } else if (tmpStructure.structureType != STRUCTURE_RAMPART) {
					structureCandidates.push(tmpStructure);
			}
		}
		if(structureCandidates.length == 0 && rampartCandidates.length > 0) {
			structureCandidates = rampartCandidates;
		}

	    }
	    if (structure == undefined && structureCandidates.length > 0) {
		 structure = creep.pos.findClosestByPath(structureCandidates, {
				filter: (s) => s.isBeingHandled(creep) == false
		});
	    }
            // if we find one
            if (structure != undefined) {
		creep.memory.repairing = structure.id;
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
		    creep.repairOnTheMove();
                    creep.moveTo(structure);
                }
		structure.iGotIt(creep);
            }
            // if we can't fine one
            else {
		roleBuilder.run(creep);
            }
        }
        else {
		creep.customharvest();
        }

    }
};
