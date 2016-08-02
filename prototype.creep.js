module.exports = function() {
	Creep.prototype.nameIsEven =
	function() {
		var creep = this;
		let num = parseInt(creep.name.substr(creep.name.length - 1));
		if(num  % 2 == 0) {
			return true;;
		} else {
			return false;
		}

	};
	Creep.prototype.calculateBodyCost =
	function () {
		var creep = this;
		let value = 0;
		for(let i = 0; i < creep.body.length; i++) {
			let part = creep.body[i];
			switch(creep.body[i].type) {
			case "work":
				value+= 100;
				break;
			case "move":
			case "carry":
				value += 50;
				break;
			case "attack":
				value += 80;
				break;
			case "ranged_attack":
				value += 150;
				break;
			case "heal":
				value += 250;
				break;
			case "claim":
				value += 600;
				break;
			case "tough":
				value += 10;
			}
		}
		return value;
	};
	

    Creep.prototype.customharvest =
        function() {
	    var creep = this;
	    var resource = creep.pos.lookFor(LOOK_ENERGY);
	    if(resource.len) {
		creep.pickup(resource[0]);
	    }
            var source = Game.getObjectById(creep.memory.source);

  	    if(source == null) {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE)
                             && s.store[RESOURCE_ENERGY] > creep.carryCapacity
                    });
	    }
            if(source != undefined) {
                                creep.memory.source = source.id;
                        } else {
                                creep.memory.source = null;
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
		    if(source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE) {
				if(source.store[RESOURCE_ENERGY] < creep.carryCapacity) {
					creep.memory.source = null;
					return;
				}
				creep.memory.pulledfrom = source.id
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
		for(let i = 0; i < creep.body.length; i++) {
			
			if(body[0].type == "attack" && body[0].hits > 0) {
				threat += 2;
			}
			else if(body[0].type == "ranged_attack" && body[0].hits > 0) {
				threat += 3;
			}
			else if (body[0].type == "heal" && body[0].hits > 0) {
				threat += 10;
			}
			else if (body[0].type == "tough" && body[0].hits > 0) {
				threat += 1;
			}
			else if (body[0].type == "build" && body[0].hits > 0) {
				threat += 1;
			}
		}
		return threat;
	};
	Creep.prototype.getRestored =
	function() {
		let creep = this;
		if(creep.pos.getRangeTo(Game.spawns.Spawn1) > 1) {
			creep.moveTo(Game.spawns.Spawn1);
		}
		if(Game.spawns.Spawn1.spawning == null) {
			let resultA = Game.spawns.Spawn1.renewCreep(creep);
			if(resultA == ERR_FULL || (resultA == ERR_NOT_ENOUGH_ENERGY && creep.memory.role == "harvester") || creep.ticksToLive > 1400) {
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
