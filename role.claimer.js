module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			creep.setupSpawn();
			creep.setupFlag();
		}
		if(creep.memory.MyFlag == "claimerSpot_E55S32") {
			creep.memory.setupTime = 400;
		}
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}

                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_CONTROLLER
		});
                if (target != undefined) {
                            if (creep.reserveController(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1, ignoreRoads:true});
                                }
                return;
                }

        }
    
};
