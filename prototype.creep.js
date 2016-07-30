module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function(creep) {
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES, {
				filter: (s) => s.energy > 2 || s.ticksToRegeneration < 30 
				});
			if(source) {
				creep.memory.source = source.id;
			} else {
				creep.memory.source = null;
			}
            }
	    if(creep.memory.source) {
		    source = Game.getObjectById(creep.memory.source);
			if(source.energy < 2 && source.ticksToRegneration > 30) {
				creep.memory.source = null;
				return;
			}
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                if(creep.moveTo(source) == ERR_NO_PATH) {
				creep.memory.source = null;
			}
		    }
            }
        }
	Creep.prototype.getthreat =
	function(creep) {
		var threat = 0;
		for(let body in creep.body) {
			if(body.type == "attack") {
				threat += 2;
			}
			else if(body.type == "ranged_attack") {
				threat += 3;
			}
			else if (body.type == "heal") {
				threat += 10;
			}
			else if (body.type == "tough") {
				threat += 1;
			}
		}
		return threat;
	}

};
