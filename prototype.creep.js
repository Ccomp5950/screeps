module.exports = function() {
    Creep.prototype.customharvest =
        function() {
	    var creep = this;
	    var resource = creep.pos.lookFor(LOOK_ENERGY);
	    if(resource.len) {
		creep.pickup(resource[0]);
	    }
            var source = Game.getObjectById(creep.memory.source);

            if(source == null && creep.memory.role != "remoteharvester") {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
                             && s.store[RESOURCE_ENERGY] > creep.carryCapacity
                    });
                if(source != undefined) {
                                creep.memory.source = source.id;
                        } else {
                                creep.memory.source = null;
                }
            }
            if(source == null) {
                        source = creep.pos.findClosestByPath(validSources[creep.room.name]); 
			if(source != undefined) {
				creep.memory.source = source.id;
			} else {
				creep.memory.source = null;
			}
            }
	    if(source != undefined) {
		    if(source.structureType == STRUCTURE_CONTAINER || (creep.memory != "harvester" && source.structureType == STRUCTURE_STORAGE)) {
				if(source.store[RESOURCE_ENERGY] < creep.carryCapacity) {
					creep.memory.source = null;
					return;
				}
                            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                if(creep.moveTo(source) == ERR_NO_PATH) {
                                        creep.memory.source = null;
                                }
                            }

		    }
		    else {
							        
	                        if(source.energy < creep.carryCapacity) {
	                                creep.memory.source = null;
		                        source = creep.pos.findClosestByPath(validSources[creep.room.name]);
		                        if(source != undefined) {
		                                creep.memory.source = source.id;
		                        } else {
						return;
		                        }
	                        }
		            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
		                if(creep.moveTo(source) == ERR_NO_PATH) {
					creep.memory.source = null;
				}
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
			else if (body.type == "build" && body.hits > 0) {
				threat += 1;
			}
		}
		return threat;
	};
	Creep.prototype.getrestored =
	function() {
		let creep = this;
		if(creep.memory.restoring == undefined) {
			creep.memory.restoring = false;
			return;
		}
		if(creep.pos.getRangeTo(Game.spawns.Spawn1) > 1) {
			creep.moveTo(Game.spawns.Spawn1);
		}
		if(Game.spawns.Spawn1.spawning == null) {
			let resultA = Game.spawns.Spawn1.renewCreep(creep);
			if(resultA == ERR_FULL || resultA == ERR_NOT_ENOUGH_ENERGY) {
				creep.memory.restoring = false;
			}
		} 
			
	};
	Creep.prototype.mine =
        function() {
            var creep = this;
            var source = Game.getObjectById(creep.memory.source);
            if(source == null) {
                        source = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(source != undefined) {
                                creep.memory.source = source.id;
                        } else {
                                creep.memory.source = null;
                        }
            }
            if(source != null) {
		if(source.energy > 0) {
			creep.harvest(source);
		}
	    }
	}
};
