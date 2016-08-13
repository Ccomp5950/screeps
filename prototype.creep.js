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
		var ally = creep.checkIfAlly();
		for(let i = 0; i < creep.body.length; i++) {
			let part = creep.body[i];	

			if(part.hits == 0) continue;

			switch(part.type) {
				case "attack":
				case "ranged_attack":
					threat += 10;
					break;
				case "heal":
					if(!ally) threat += 50;
					break;
				case "build":
					if(!ally) threat += 40;
					break;
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
			if(creep.memory.setupTime > 800) {
				creep.memory.setupTime = 800;
			}
			if(creep.ticksToLive - creep.memory.setupTime <= 0) {
				creep.memory.replaceMe = true
				return true;
			}
		}

	return false;
	};

	Creep.prototype.onEdge =
        function() {
	let c = this;
	if(c.pos.x == 0 || c.pos.x == 49 || c.pos.y == 0 || c.pos.y == 49) {
		return true;
	}
        if(c.pos.x == 1 || c.pos.x == 48 || c.pos.y == 1 || c.pos.y == 48) {
                return true;
        }
	return false;
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
	Creep.prototype.checkIfAlly =
	function(name) {
		if(Memory.allies.indexOf(name) != -1) {
			return true;
		} else {
			return false;
		}
	}
	Creep.prototype.attackHostileStructure =
	function(structure) {
		let creep = this;
		let target = null;
		let cs = false;
		switch(structure) {
			case "FLAG":
				if(Game.flags.priority.room != undefined && Game.flags.priority.room.name == creep.room.name) {
					target = Game.flags.priority.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.pos.getRangeTo(Game.flags.priority) < 1, maxRooms:1});
				}
				break;
			case "ANYTHING":
				target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
				break;
			case FIND_CONSTRUCTION_SITES:
				target = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (s) => s.structureType != STRUCTURE_EXTRACTOR });
				cs = true;
				break;
			case STRUCTURE_WALL:
				for(let range = 10; range < 25; range++) {
					let targets = creep.pos.findInRange(FIND_STRUCTURES,range, {
								filter: (s) => s.structureType == STRUCTURE_WALL
					});
					let weakest = null;
					let weakestHits = 999999999;
					if(targets.length) {
						for(let i = 0; i < targets.length; i++) {
							if(targets[i].hits < weakestHits && creep.room.findPath(creep.pos, targets[i].pos)) {
								weakest = targets[i];
								weakestHits = targets[i].hits;
							}
						}
					target = weakest
					break;;
					}
				}
				if(target == null) {
					target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
										filter: (s) => s.structureType == STRUCTURE_WALL
					});
				}
				break;
			default:
				target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
						filter: (s) => s.structureType == structure && (s.my != true)
				});
				break;
		}
                if (target != undefined) {
			    if (cs) {
                                if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
					creep.cancelOrder('move');
                                        return false;
                                }

				}
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
					creep.cancelOrder('move');
					return false;
				}
                                }
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
					creep.cancelOrder('move');
					return false;
				}
                                }

			creep.memory.killThis = target.id;

                return true;
                }
	return false;
	};
        Creep.prototype.attackSavedTarget =
        function() {	
		let creep = this;
		let target = null;
		target = Game.getObjectById(creep.memory.killThis);
		if(target == null || Game.time % 20 == 0) {
			return false;
		}
		if(target.progress != undefined) {
                        if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
				creep.cancelOrder('move');
                                creep.memory.killThis = null;
                                return false;
                        }
		}
		if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
			if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
				creep.cancelOrder('move');
				creep.memory.killThis = null;
				return false;
			}
		}
		if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        if(creep.moveTo(target, {maxRooms:1}) == ERR_NO_PATH) {
				creep.cancelOrder('move');
                                creep.memory.killThis = null;
				return false;
                        }

		}
	return true;
	};
	Creep.prototype.attackHostileCreep =
	function() {
		let creep = this;
		let target = Game.getObjectById(creep.memory.killThis);
		if(target == null || Game.time % 10 == 0) {
			var targets = creep.room.find(FIND_HOSTILE_CREEPS, {
                                filter: (c) => c.checkIfAlly() == false
	                });
			let yugeThreat = null;
			let yugestThreat = -1;
			for (let enemy_creep of targets) {
	                        var creepThreat = enemy_creep.getThreat();
				var pathTo = creep.pos.findPathTo(enemy_creep);
				if(pathTo == null || pathTo.length == 0) {
					continue;
				}
				var pathLast = pathTo[pathTo.length -1];
				var hasPath = false;
				if(pathTo.length > 0 && pathLast.x == enemy_creep.pos.x && pathLast.y == enemy_creep.pos.y) {
					hasPath = true;
				}
	                        if(yugestThreat < creepThreat && hasPath) {
	                                yugeThreat = enemy_creep;
        	                        yugestThreat = creepThreat;
	                        }
			}
			target = yugeThreat;
                }
                if (target != undefined) {
				creep.memory.killThis = target.id;
                            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                	                creep.moveTo(target, {maxRooms:1});
			}
			
		return true;
		}
		return false;
	};

	Creep.prototype.setupFlag =
	function() {
		let creep = this;
		if(creep.memory.MyFlag == null)
		{
			creep.memory.MyFlag = -1;
		}

		if(creep.memory.MyFlag != -1) {
			return;
		}
		creep.findFlag();
		if(creep.memory.MyFlag != -1) {
			console.log("[" + creep.name + "] I'm grabbing the position at: " + creep.memory.MyFlag);
			creep.grabFlag();
			return;
		} else {
			if(creep.memory.spamedError != true) {
				creep.memory.spamedError = true;
				console.log("[" + creep.name + "] I can't find a flag.  :(");
			}
			creep.say(":(");
		}
	};

	Creep.prototype.grabFlag =
	function() {
		let creep = this;
		let role = creep.memory.role;
                let flag = Game.flags[creep.memory.MyFlag];
                if(flag != null) {
                        flag.memory[role] = creep.id;
			let fs = role + "Name";
			flag.memory[fs] = creep.name;
                }
        };

        Creep.prototype.findFlag =
        function(flag) {
                let creep = this;
		let role = creep.memory.role;
                for(let i = 1; i <= 50  ; i++) {
                        flagName = role +"Spot" + i.toString();
                        if(Game.flags[flagName] != null) {
                                let flag = Game.flags[flagName];
                                residentCreep = null;
                                residentCreep = Game.getObjectById(flag.memory[role]);
                                if(residentCreep == null || residentCreep.checkTimeToReplace()) {
					creep.memory.MyFlag = flagName;	
                                        return
                                }
                        } else {
				creep.memory.MyFlag = -1;
				return;
			}
                }
        return;
        };

	Creep.prototype.setupSpawn =
	function() {
		if(this.memory.spawnTime == null) {
			this.memory.spawnTime = Game.time;
		}
	};

	Creep.prototype.setRespawnTime =
	function() {
		if(this.memory.setupTime == null) {
			this.memory.setupTime = Game.time - this.memory.spawnTime;
		}
	};

	Creep.prototype.gotoWaypoint =
	function() {
		let creep = this;
                if(creep.memory.waypoint == undefined) {
                        creep.memory.waypoint = 1;
                }
                var flag =  Game.flags["waypoint" + creep.memory.waypoint.toString()];

                if(creep.memory.waypoint != -1 &&  flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.moveTo(flag);
                        } else {
                                creep.memory.waypoint += 1;
                        }
			return true;
                } else {
                        creep.memory.waypoint = -1;
                }
		return false;

	}

	Creep.prototype.approachAssignedFlag =
	function(fRange) {
		let creep = this;
                let flag = Game.flags[creep.memory.MyFlag];
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > fRange) {
                                creep.moveTo(flag);
				return false;
                        } else {
				creep.setRespawnTime();
				return true;
			}
                } else {
                        console.log("[" + creep.name + "] I can't find a flag :(");
			creep.say(":( :( :(");
			return false;
                }
	};

};
