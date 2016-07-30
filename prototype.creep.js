module.exports = function() {
    // create a new function for StructureSpawn
    Creep.prototype.customharvest =
        function() {
	    var creep = this;
            var source = null;
            if(!creep.memory.source) {
                        source = creep.pos.findClosestByPath(FIND_SOURCES, {
				filter: (s) => s.energy > 2 || s.ticksToRegeneration < 30  || s.ticksToRegneration == undefined
				});
			if(source) {
				creep.memory.source = source.id;
			} else {
				creep.memory.source = null;
			}
            }
	    if(creep.memory.source) {
		    source = Game.getObjectById(creep.memory.source);
			if(source.energy < 2 && (ticksToRegeneration == undefined || source.ticksToRegneration > 30)) {
				creep.memory.source = null;
				return;
			}
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                if(creep.moveTo(source) == ERR_NO_PATH) {
				creep.memory.source = null;
			}
		    }
            }
        };
	Creep.prototype.getthreat =
	function() {
		var creep = this;
		var threat = 0;
		var log = 1;
		for(let body in creep.body) {
			if(body.type == "attack" && body.hits > 0) {
				threat += 2;
			}
			else if(body.type == "ranged_attack" && body.hits > 0) {
				threat += 3;
			}
			else if (body.type == "heal" && body.hits > 0) {
				threat += 10;
			}
			else if (body.type == "tough" && body.hits > 0) {
				threat += 1;
			}
                        if(Memory.debug) {
                                console.log("Checking Body Part: Type=" + body.type + " hits=" + body.hits + " current_threat=" + threat);
                        }
		}
		return threat;
	}

};
