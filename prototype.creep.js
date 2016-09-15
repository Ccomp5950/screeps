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
			value+= BODYPART_COST[creep.body[i].type];
		}
		return value;
	};

	Creep.prototype.calculateSpawnTicks =
	function() {
		return this.body.length * 3;
	}

	Creep.prototype.getBoosted =
	function(boost) {
		let creep = this;
		if(creep.memory.needsBoosted == true) {
			let lab = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LAB && s.mineralType == boost && s.mineralAmount > 20});
			if(lab != undefined) {
				if(creep.pos.getRangeTo(lab) > 1) {
					creep.moveTo(lab);
					return true;
				}
				lab.boostCreep(creep);
				creep.memory.needsBoosted = false;
				creep.memory.boosted = true;
				return false;				
			}
		}
		creep.memory.needsBoosted = false;
		return false;
	}
	

    Creep.prototype.customharvest =
        function() {
	    var creep = this;
	    var resource = creep.pos.lookFor(LOOK_ENERGY);
	    if(resource.len) {
		creep.pickup(resource[0]);
	    }
	    var carryLeft = (creep.carryCapacity - _.sum(creep.carry));

            var source = null; 

			var flagname = "upgraderContainer";
                        var flags = creep.room.find(FIND_FLAGS, {filter: (f) => f.name.substr(0,flagname.length) == flagname })
                        var flag = flags[0];
			var nopullcan = null;
			if(flag != undefined) {
	                        var nopullcan = flag.pos.findClosestByRange(FIND_STRUCTURES, {
	                        filter:(s) => s.structureType == STRUCTURE_CONTAINER && s.pos.getRangeTo(flag) < 2

	                        });
			}

	  
  	    if(source == null) {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE 
				     || s.structureType == STRUCTURE_TERMINAL 
					)
				     && s.store[RESOURCE_ENERGY] > carryLeft
					, maxRooms:1});
	    }
            if(source == null) {
		source = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && (nopullcan == null || s.id != nopullcan.id) && s.store[RESOURCE_ENERGY] > carryLeft });
		if(source != undefined) {
			creep.memory.source = source.id;
		} else {
			creep.memory.source = null;
		}
	    }
            if(source == null && creep.getActiveBodyparts(WORK) > 0) {
			source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => s.energy > 0});
                        if(source != undefined) {
                                creep.memory.source = source.id;
                        } else {
                                creep.memory.source = null;
                        }
            }
	    if(source != undefined) {
		    if(source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE || source.structureType == STRUCTURE_TERMINAL) {
				if(source.store[RESOURCE_ENERGY] < carryLeft) {
					creep.memory.source = null;
					return;
				}
				creep.memory.pulledfrom = source.id
                            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                if(creep.moveTo(source, {maxRooms: 1}) == ERR_NO_PATH) {
                                        creep.memory.source = null;
                                }
                            }
		    return;
		    }
		    else {
							        
	                        if(source.energy < 20) {
	                                creep.memory.source = null;
					if(creep.getActiveBodyParts(WORK) > 0) {
						source = creep.pos.findClosestByRange(validSources[creep.room.name]);
					}
		                        if(source != undefined) {
		                                creep.memory.source = source.id;
		                        } else {
						return;
		                        }
	                        }
		            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
		                if(creep.moveTo(source, {maxRooms: 1}) == ERR_NO_PATH) {
					creep.memory.source = null;
				}
			    }
			
		    return;
		    }
            } else {
		var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY)
		if(energy != undefined) {
			if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energy);
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
					threat += 20;
					break;
				case "heal":
					if(!ally) threat += 50;
					break;
				case "build":
					if(!ally) threat += 1;
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

	Creep.prototype.drivebyRestore =
	function() {
		let creep = this;
		if(creep.ticksToLive < 1000 || creep.memory.gettingdbr == true) {		
			if(creep.ticksToLive > 1400) {
				creep.memory.gettingdbr = false;
				return;
			}
	                let spawns = creep.pos.findInRange(FIND_STRUCTURES,1, { filter: (s) => s.structureType == STRUCTURE_SPAWN && s.spawning == null });
	                if(spawns.length) {
				spawns[0].renewCreep(creep);
				creep.memory.gettingdbr = true;
				return;
			}
		}
	}

	Creep.prototype.mine =
        function() {
            var creep = this;
            var source = Game.getObjectById(creep.memory.source);
            if(source == null || source.pos.getRangeTo(creep) > 1) {
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
			if(creep.memory.setupTime > 140 && creep.room.name == creep.memory.spawnRoom) {
				creep.memory.setupTime = 140;
			}
			if(creep.ticksToLive - creep.memory.setupTime <= 0) {
				creep.memory.replaceMe = true
				return true;
			}
		}

	return false;
	};

	Creep.prototype.onEdge =
        function(extended) {
	let c = this;
	if(extended != true) {
		extended = false;
	}
	if(c.pos.x == 0 || c.pos.x == 49 || c.pos.y == 0 || c.pos.y == 49) {
		return true;
	}
        if(extended && (c.pos.x == 1 || c.pos.x == 48 || c.pos.y == 1 || c.pos.y == 48)) {
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
	function() {
		let creep = this;
		let name = creep.owner.username;
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
					target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.pos.getRangeTo(Game.flags.priority) < 1, maxRooms:1});
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
	Creep.prototype.deposit =
	function (target, resourceType) {
		let creep = this;
		if(target == undefined) {
			return;
		}
		if(resourceType != undefined) {
			creep.transfer(target, resourceType);
			return;
		}
		for(let resource in creep.carry) {
			if(creep.carry[resource] > 0) {
				creep.transfer(target, resource);
				return;
			}
		}

	};
	Creep.prototype.onRampart =
	function() {
		var creep = this;
		var finder = creep.pos.lookFor(LOOK_STRUCTURES);
		if(finder.length == 0) {
			return false;
		}
		for(let structureI of finder){
			var structure = structureI;
			if(structure == undefined) {
				continue;
			}
			if(structure.structureType == STRUCTURE_RAMPART) {
				return true;
			}
		}
	return false;
	};

	Creep.prototype.attackAdjacentCreep =
	function() {
		let creep = this;
		var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
		if(targets.length > 0) {
		    creep.attack(targets[0]);
		    return true;
		}
		return false;
	};

	Creep.prototype.attackHostileCreep =
	function(ignoreEdgeHuggers) {
		if(ignoreEdgeHuggers != true) {
			ignoreEdgeHuggers = false;
		}
		let creep = this;
		let target = Game.getObjectById(creep.memory.killThis);
		if(creep.memory.killThis == undefined || creep.memory.killThis == -1 || target == undefined || Game.time % 9 == 0) {
			creep.memory.killThis = -1;
			var targets = creep.room.find(FIND_HOSTILE_CREEPS, {
                                filter: (c) => c.owner.username == "Invader" || (c.checkIfAlly() == false && c.onRampart() == false && (ignoreEdgeHuggers == false || c.onEdge() == false))
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
			if (creep.pos.getRangeTo(target) > 1) {
		                if(creep.hits < creep.hitsMax) {
		                        creep.heal(creep);
		                }
               	                creep.moveTo(target, {maxRooms:1, ignoreRoads:true});
			} else {
				creep.attack(target);
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
			creep.grabFlag();
			return;
		} else {
			if(creep.memory.spamedError != true) {
				creep.memory.spamedError = true;
				console.log("[" + creep.name + " / " + creep.room.name + "] I can't find a flag.  :(");
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
        function() {
                let creep = this;
		let role = creep.memory.role;
		let flagprefix = role + "Spot";
		let roleName = role + "Name";
		let flag =  _(Game.flags).filter((f) => f.memory.spawn != undefined 
						     && f.name.substr(0,flagprefix.length) == flagprefix 
						     && f.memory.spawn == creep.memory.spawnRoom 
						     && (Game.creeps[f.memory[roleName]] == undefined 
						      || Game.getObjectById(f.memory[role]) == undefined
						      || Game.getObjectById(f.memory[role]).checkTimeToReplace() == true) 
						     && (role != "claimer" || f.needsClaimer() == true)
		).first();
		if(flag != undefined) {
			creep.memory.MyFlag = flag.name;
			return;
		}
		creep.memory.MyFlag = -1;
		return;
        };

	Creep.prototype.setupSpawn =
	function() {
		if(this.memory.spawnTime == undefined) {
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
                                creep.moveTo(flag, {reusePath:50});
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
	function(fRange, ignoreCreeps) {
		let option = null;
		if(ignoreCreeps == true) {
			option = {ignoreCreeps:true};
		}
		let creep = this;
                let flag = Game.flags[creep.memory.MyFlag];
		let result = false;
		if(creep.memory.pos != undefined) {
			if(creep.memory.pos.x != creep.pos.x || creep.memory.pos.y != creep.pos.y) {
				creep.memory.pos.x = creep.pos.x;
				creep.memory.pos.y = creep.pos.y;
				creep.memory.pos.timer = 0;
			} else {
				creep.memory.pos.timer++;
				if(creep.memory.pos.timer > 3) {
					option = null;
				}
			}

		} else {
                                creep.memory.pos = {x: creep.pos.x, y: creep.pos.y, timer:0};

		}
                if(flag != undefined) {
			var flagRoom = flag.pos.roomName;
                        var range = creep.pos.getRangeTo(flag);
			if(range > 999) {
				if(creep.memory.rolewaypoint != -1) {
					var waypointFlag = Game.flags[flagRoom + "_waypoint"];
					if(waypointFlag != undefined) {
						if(creep.pos.getRangeTo(waypointFlag) > 2) {
							creep.moveTo(waypointFlag, option);
							return false;
						} else {
							creep.memory.rolewaypoint = -1;
						}
						
					} else {
						creep.memory.rolewaypoint = -1;
					}
				}
			}
                        if(range > fRange) {
				if(range - fRange < 5) {
					option = null;
				}
                                creep.moveTo(flag, option);
			} 
			if(range == fRange + 1) {
				creep.setRespawnTime();
				if(creep.memory.role == "towerdrainer") {
				return false;
				}
                        } if(range <= fRange) {
				creep.setRespawnTime();
				result = true;;
			}
		return result;
                } else {
                        if(creep.memory.spamedError != true) {
				creep.memory.spamedError = true;
				console.log("[" + creep.name +" / "+ creep.room.name + "] I can't find a flag.  :(");
			}
			creep.say(":( :( :(");
			return false;
                }
	};
	Creep.prototype.repairThis =
	function(target) {
		let creep = this;
		if(target == undefined || target == Infinity) {
			return false;
		}
		if(target.hits >= target.hitsMax - 100) {
			creep.memory.repair = null;
			return false;
		}
		creep.memory.repair = target.id;
		if (creep.pos.getRangeTo(target) > 3){
			creep.repairOnTheMove();
			creep.moveToRange(target.pos, 3);
			return true;
		} else {
                    creep.repair(target);
			return true;
                }
	};


        Creep.prototype.buildThis =
        function(target) {
                let creep = this;
                if(target == undefined) {
                        return false;
                }
                if (creep.pos.getRangeTo(target) > 2) {
                        creep.repairOnTheMove();
                        creep.moveTo(target);
                        return true;
                } else {
                    creep.build(target);
                        return true;
                }
        };

	Creep.prototype.moveToRange = 
	function (target, range) {
		let creep = this;
		PathFinder.use(true);
		let pos = target;
		if (target.pos) {
			pos = target.pos;
		}
		if(creep.pos.getRangeTo(pos) > range) {
			creep.moveTo({pos: pos, range: range}, {
				maxRooms: 1,
			});
		}
	};


	Creep.prototype.saySomething =
	function() {
	let creep = this;
	var say = ["Quit","getting", "mad at", "video","games :)",-1];
	var index = Game.time % ( say.length );
	if(say[index] == -1) return;
	creep.say(say[index],true);
	};

	Creep.prototype.repairOnTheMove =
	function() {
			let creep = this;
                        let target = _(creep.pos.findInRange(FIND_STRUCTURES,2, { filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax })).min((s) => s.hits / s.hitsMax);
			creep.repair(target);
	}
};
