var roleBuilder = require('role.builder');

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
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.source = null;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
	    var lala = 0;
	    var structure = undefined;
	    var structureCandidates = [];
	    var criticalStructures = creep.room.find(FIND_STRUCTURES, {
		filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && (s.hits / s.hitsMax < 0.05)
	    });
	    for(let tmpStructure of criticalStructures) {
		if(lala == 0) console.log("We're in criticalStructures Loop");
		lala = 1;
		if(tmpStructure.hits == 1) {
			structureCandidates.push(tmpStructure);
			structure = tmpStructure;
			break;
		}
			
	    }
	    if(structureCandidates.length == 0) {
		console.log("We're in normal candidate list");
		var nextCandidates = creep.room.find(FIND_STRUCTURES, {
                 filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                                                                         });
		for(let tmpStructure of nextCandidates) {
	                if(tmpStructure.structureType == STRUCTURE_RAMPART && tmpStructure.hits < Memory.rampartMinHealth) {
	                        structureCandidates.push(tmpStructure);
	                        continue;
	                } else if (tmpStructure.structureType != STRUCTURE_RAMPART) {
				structureCandidates.push(tmpStructure);
			}
		}
	    }
	    if (structure == undefined && structureCandidates.length > 0) {
		 structure = creep.pos.findClosestByPath(structureCandidates);
	    }
            // if we find one
            if (structure != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        else {
		creep.customharvest();
        }

    }
};
