var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
            creep.memory.build = null;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
	    creep.memory.source = null;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = null;
	    if(!creep.memory.build || !Game.getObjectById(creep.memory.build)) {
		constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
		if(constructionSite) {
			creep.memory.build = constructionSite.id
		}
	    }
	    if(creep.memory.build != null) {
		    constructionSite = Game.getObjectById(creep.memory.build)
	            // if one is found
	            if (constructionSite != undefined) {
	                // try to build, if the constructionSite is not in range
	                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
	                    // move towards the constructionSite
	                    creep.moveTo(constructionSite);
	                }
	            }
	    }
            // if no constructionSite is found
            else {
		creep.memory.build = null;
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
		creep.customharvest();
        }
    }
};
