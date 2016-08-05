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
	Creep.prototype.getThreat =
	function() {
		var creep = this;
		var threat = 0;
		var log = 1;
		for(let i = 0; i < creep.body.length; i++) {
			let part = creep.body[i];	
			if(part.type == "attack" && part.hits > 0) {
				threat += 2;
			}
			else if(part.type == "ranged_attack" && part.hits > 0) {
				threat += 3;
			}
			else if (part.type == "heal" && part.hits > 0) {
				threat += 10;
			}
			else if (part.type == "tough" && part.hits > 0) {
				threat += 1;
			}
			else if (part.type == "build" && part.hits > 0) {
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
	};
	Creep.prototype.checkTimeToReplace =
	function() {
		let creep = this;
		if(creep.memory.setupTime != null) {
			if(creep.memory.setupTime > 200) {
				creep.memory.setupTime = 200;
			}
			if(creep.ticksToLive - creep.memory.setupTime <= 0) {
				creep.memory.replaceMe = true
				return true;
			}
		}

	return false;
	};
	Creep.prototype.findMiningFlag =
	function() {
		let creep = this;
		for(let i = 0; i <= Memory.miningSpots; i++) {
			flagName = "miningSpot" + i.toString();
			if(Game.flags[flagName] != null) {
				let flag = Game.flags[flagName];
				residentCreep = null;
				residentCreep = Game.getObjectById(flag.memory.Miner);
				if(residentCreep == null || residentCreep.checkTimeToReplace()) {
					return flag.name;
				}
			}
		}
	return -1;
	};

	Creep.prototype.claimMiningFlag =
	function() {
		let creep = this;
		let flag = Game.flags[creep.memory.myFlag];
		if(flag != null) {
			flag.memory.Miner = creep.id;
			flag.memory.MinerName = creep.name;
		}
	};
        Creep.prototype.findFetchingFlag =
        function() {
                let creep = this;
                for(let i = 0; i <= Memory.miningSpots; i++) {
                        flagName = "miningSpot" + i.toString();
                        if(Game.flags[flagName] != null) {
                                let flag = Game.flags[flagName];
                                residentCreep = null;
                                residentCreep = Game.getObjectById(flag.memory.Fetcher);
                                if(residentCreep == null || residentCreep.checkTimeToReplace()) {
                                        return flagName;
                                }
                        }
                }
        return -1;
        };

        Creep.prototype.claimFetchingFlag =
        function() {
                let creep = this;
                let flag = Game.flags[creep.memory.myFlag];
                if(flag != null) {
                        flag.memory.Fetcher = creep.id;
			flag.memory.FetcherName = creep.name;
                }
        };

        Creep.prototype.findClaimingFlag =
        function() {
                let creep = this;
                for(let i = 1; i <= Memory.claimingSpots  ; i++) {
                        flagName = "claim" + i.toString();
                        if(Game.flags[flagName] != null) {
                                let flag = Game.flags[flagName];
                                residentCreep = null;
                                residentCreep = Game.getObjectById(flag.memory.Claimer);
                                if(residentCreep == null || residentCreep.checkTimeToReplace()) {
                                        return flagName;
                                }
                        }
                }
        return -1;
        };

        Creep.prototype.claimClaimingFlag =
        function() {
                let creep = this;
                let flag = Game.flags[creep.memory.myFlag];
                if(flag != null) {
                        flag.memory.Claimer = creep.id;
			flag.memory.ClaimerName = creep.name;
                }
        };
	Creep.prototype.getAwayFromEdge =
	function() {
		let creep = this;
		let moved = true;
                if(creep.pos.x == 0) {
                        creep.move(RIGHT);
			creep.move(TOP_RIGHT);
			creep.move(BOTTOM_RIGHT);
			creep.move(RIGHT);
                } else if(creep.pos.x == 49){
			creep.move(LEFT);
			creep.move(BOTTOM_LEFT);
			creep.move(TOP_LEFT);
			creep.move(LEFT);
                } else if(creep.pos.y == 0) {
			creep.move(BOTTOM);
			creep.move(BOTTOM_LEFT);
			creep.move(BOTTOM_RIGHT);
			creep.move(BOTTOM);
		} else if(creep.pos.y == 49) {
			creep.move(TOP);
			creep.move(TOP_RIGHT);
			creep.move(TOP_LEFT);
			creep.move(TOP);
		} else {
			moved = false;
		}
	return moved;

	};
	Creep.prototype.attackHostileStructure =
	function(structureType) {
		let creep = this;
		let target = null;
		switch(structureType) {

			case "ANYTHING":
				target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
				break;
			case STRUCTURE_WALL:
				for(let range = 2; range < 10; range++) {
					let targets = creep.pos.findInRange(STRUCTURE_WALL, range);
					let weakest = null;
					let weakestHits = 999999999;
					if(targets.length) {
						for(let i = 0; i < targets.length; i++) {
							if(targets[i].hits < weakestHits) {
								weakest = targets[i];
								weakestHits = targets[i].hits;
							}
						}
					target = weakest
					break;;
					}
				}
				break;
			default:
				target = creep.pos.findClosestByPath(structureType);
				break;
		}
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return true;
                }
	return false;
	}
	
};
