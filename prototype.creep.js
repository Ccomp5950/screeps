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
		if(creep.memory.needsBoosted == true && (creep.memory.boosts == undefined || creep.memory.boosts.indexOf(boost) == -1)) {
			let lab = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LAB && s.mineralType == boost && s.mineralAmount > 20});
			if(lab != undefined) {
				if(creep.pos.getRangeTo(lab) > 1) {
					creep.moveTo(lab);
					return true;
				}
				lab.boostCreep(creep);
				creep.memory.boosted = true;
				if(creep.memory.boosts == undefined) {
					creep.memory.boosts = [boost];
				} else {
					creep.memory.boosts.push(boost);
				}
				return false;				
			}
		}
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
	    
            var source = Game.getObjectById(creep.memory.source); 
	    if(source != null && ((source.energy != undefined && source.energy <= carryLeft) || (source.store != undefined && source.store.energy <= carryLeft))) {
		source = null
	    }
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
		if(creep.approachPos(source.pos,1)) return;
		if(source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE || source.structureType == STRUCTURE_TERMINAL) {
			if(source.store[RESOURCE_ENERGY] < carryLeft) {
				creep.memory.source = null;
				return;
			}
			creep.memory.pulledfrom = source.id
			creep.withdraw(source, RESOURCE_ENERGY)
			creep.memory.source = null;
			return;
		}
		else {
			creep.harvest(source);
		}
	} else {
		var energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
		if(energy != undefined) {
			if(creep.approachPos(energy.pos,1)) return;
			creep.pickup(energy); 
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
				case "carry":
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
            if(source == undefined) {
	
			sources = creep.pos.findInRange(FIND_SOURCES, 1);
                        if(sources.length > 0) {
				source = sources[0];
				creep.memory.source = source.id;
                        } else {
                                creep.memory.source = null;
                        }
            }
            if(source != undefined) {
		if(source.energy >= 1) {
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
	function(structure, disregardRampart, ranged) {
		let creep = this;
                if(ranged != true) {
                        ranged = false;
		}
		let target = null;
		let cs = false;
		if(disregardRampart != true) {
			disregardRampart = false;
		}
		switch(structure) {
			case "FLAG":
				if(Game.flags.priority != undefined && Game.flags.priority.room != undefined && Game.flags.priority.room.name == creep.room.name) {
					target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.pos.getRangeTo(Game.flags.priority) < 1, maxRooms:1});
				} else if (Game.flags[creep.room.name + "_priority"] != undefined && Game.flags[creep.room.name + "_priority"].room != undefined && Game.flags[creep.room.name + "_priority"].room.name == creep.room.name) {
					target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.pos.getRangeTo(Game.flags[creep.room.name + "_priority"]) < 1, maxRooms:1});
				}
				break;
			case "ANYTHING":
				target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType != STRUCTURE_CONTROLLER});
				break;
			case FIND_CONSTRUCTION_SITES:
				target = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (s) => s.structureType != STRUCTURE_EXTRACTOR && s.progress > 1});
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
				if(creep.room.controller == undefined || creep.room.controller.my != true) {
					target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
							filter: (s) => s.structureType == structure && (s.my != true && (disregardRampart == true || s.onRampart() == false))
					});
				}
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
                            if ((!ranged && creep.attack(target) == ERR_NOT_IN_RANGE) || (ranged && creep.rangedAttack(target) == ERR_NOT_IN_RANGE)) {
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
	function(ranged) {
		attackRange = 3;
		if(ranged != true) {
			ranged = false;
			attackRange = 1;
		}
		let creep = this;
		var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, attackRange, {filter: (c) => c.onRampart() == false && c.checkIfAlly() == false});
		if(targets.length > 0) {
		    if(ranged) {
			creep.rangedAttack(targets[0]);
			return true;
		    }
		    creep.attack(targets[0]);
		    return true;
		}
		return false;
	};

	Creep.prototype.attackHostileCreep =
	function(ignoreEdgeHuggers, ignoreSK, ranged) {
		if(ignoreEdgeHuggers != true) {
			ignoreEdgeHuggers = false;
		}
		if(ignoreSK != true) {
			ignoreSK = false;
		}
		let attackRange = 3;
		if(ranged != true) {
			attackRange = 1;
			ranged = false;
		} 
		let creep = this;
		let target = Game.getObjectById(creep.memory.killThis);
		if(creep.memory.killThis == undefined || creep.memory.killThis == -1 || target == undefined || Game.time % 9 == 0) {
			creep.memory.killThis = -1;
			target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
										filter: (c) =>  c.owner.username == "Invader" || 
			(c.checkIfAlly() == false && c.onRampart() == false && (ignoreEdgeHuggers == false || c.onEdge() == false) && (c.owner.username != "Source Keeper" || ignoreSK == false))
			});
                }
                if (target != undefined) {
			creep.memory.killThis = target.id;
			flee = false;
			if(target.body != undefined && target.getActiveBodyparts(ATTACK)) {
				attackRange = 3;
				flee = true;
			}
			if (creep.pos.getRangeTo(target) > attackRange) {
		                if(creep.hits < creep.hitsMax) {
		                        creep.heal(creep);
		                }
				creep.moveToRange(target.pos, attackRange);
			} else {
				if(ranged) {
					creep.rangedAttack(target)
				} else {
					creep.attack(target);
					creep.moveTo(target);
				}
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

	Creep.prototype.gotoTimeout =
	function() {
		var creep = this;
		var flag = Game.flags[creep.pos.roomName + "_timeout"];
		if(flag == undefined) {
			creep.say("no timeout");
			return;
		}
		creep.approachPos(flag.pos,2);
	};

	Creep.prototype.approachPos =
	function(pos, range, ignoreRoads) {
		let creep = this;
		if(ignoreRoads != true) ignoreRoads = false;
		if(creep.memory.moved == true || creep.fatigue != 0) return;
		let option = {ignoreCreeps:true, reusePath:50, ignoreRoads: ignoreRoads};
		if(range == null || range == undefined) {
			range = 0;
		}
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
		if(creep.pos.getRangeTo(pos) > range) {
			creep.moveTo(pos, option);
			creep.memory.moved = true;
			return true;
		}
	creep.memory.pos = undefined;
	return false;
	}

	Creep.prototype.approachAssignedFlag =
	function(fRange, ignoreCreeps, retainPath, overideFlag) {
		if(retainPath == undefined) {
			retainPath = 50;
		}
		let option = null;
		if(ignoreCreeps == true) {
			option = {ignoreCreeps:true, reusePath:retainPath};
		}
		let creep = this;
		if(creep.memory.moved || creep.fatigue != 0) return false;
		let flag = Game.flags[creep.memory.MyFlag];
		if(overideFlag != null) flag = overideFlag
		let result = false;

		if(flag != undefined) {
			var flagRoom = flag.pos.roomName;
                        var range = creep.pos.getRangeTo(flag);
			if(range > 999) {
				if(creep.memory.rolewaypoint != -1) {
					var waypointFlag = Game.flags[flagRoom + "_waypoint"];
					if(waypointFlag != undefined) {
						if(creep.approachPos(waypointFlag.pos, 1, true)) {
							creep.memory.moved = true;
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
                                creep.approachPos(flag.pos,0);
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
	Creep.prototype.doVisual =
	function() {
		if(Memory.config.drawVisuals != true) return;
		let textColor = 'white';
		if(Memory.config.creepColor != undefined) textColor = Memory.config.creepColor;
		let creep = this;
		let y = creep.pos.y;
		let x = creep.pos.x;
		let textAlign = "center";
		if(creep.pos.y >= 2) {
			y--;
		} else {
			y++;
		}
		if(creep.memory.role == "upgrader") {
			if(creep.ticksToLive != undefined) new RoomVisual(creep.room.name).text(creep.ticksToLive, creep.pos.x , creep.pos.y -1, {color: "white",size: 0.5});
			return;
		}
		var text = creep.memory.role;
		if(creep.ticksToLive != undefined) text += "(" + creep.ticksToLive + ")";
		if(creep.memory.pos != undefined && creep.memory.pos.timer != undefined) text += " [" + creep.memory.pos.timer + "]";
		new RoomVisual(creep.room.name).text(text, x, y, {color: textColor, size: 0.5, align: textAlign});
	};
	Creep.prototype.repairThis =
	function(target) {
		let creep = this;

		if(target == undefined || target == Infinity) {
			return false;
		}
		if(target.hits >= target.hitsMax - 100) {
			creep.memory.repairing = null;
			return false;
		}
		creep.memory.repairing = target.id;
		target.iGotIt(creep);
		if (creep.pos.getRangeTo(target) > 3){
			creep.repairOnTheMove();
			creep.approachPos(target.pos, 3);
			return true;
		} else {
                    creep.repair(target);
			creep.memory.repairCached++;
			return true;
                }
	};


        Creep.prototype.buildThis =
        function(target) {
                let creep = this;
                if(target == undefined) {
                        return false;
                }
		creep.repairOnTheMove();
		if(creep.approachPos(target.pos, 2))  return true;
		creep.build(target);
		return true;
        };

	Creep.prototype.moveToRange = 
	function (target, Arange, flee) {
		let pos = target;
		if (target.pos != undefined) {
			pos = target.pos;
		}
		this.approachPos(pos, Arange);
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
                        let target = _(creep.pos.findInRange(FIND_STRUCTURES,2, { filter: (s) => (s.structureType == STRUCTURE_ROAD) && s.hits < s.hitsMax })).min((s) => s.hits / s.hitsMax);
			if(target != undefined && target != Infinity) {
				creep.repair(target);
				return;
			}
			target = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 2)
			if(target.length) {
				creep.build(target[0]);
			}
	}
};
