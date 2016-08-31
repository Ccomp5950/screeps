module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
			creep.setupSpawn();
		}
		creep.setupFlag();
		if(creep.gotoWaypoint()) return;
		if(creep.approachAssignedFlag(0) == false) {
			return;
		}
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_CONTROLLER && !s.my
		});
                if (target != undefined) {
                            if (creep.pos.getRangeTo(target) > 1) {
                                creep.moveTo(target, {maxRooms:1});
				return;
                                }
				creep.attackController(target);

                return;
                }

        }
    
};
