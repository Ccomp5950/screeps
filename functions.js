	global.checkRoles =
	function(role) {
		let count = 0;
		for(creepM in Game.creeps) {
			let creep = Game.creeps[creepM];
			if(creep.memory.role == role) {
				count++;
			}
		
		}
		return count;
	};

	global.displayRoles =
	function() {
		var rolecount = new Object();
		for(creepM in Game.creeps) {
			let creep = Game.creeps[creepM];
			if(rolecount[creep.memory.role] == null) {
				rolecount[creep.memory.role] = 0;
			}
			rolecount[creep.memory.role]++;
		}
		for(roleM in rolecount) {
			console.log("You have " + rolecount[roleM] + " " + roleM +"'s creeps");
		}
	return null;
	};

	global.distCheck =
	function() {
	if(Game.flags.check1 != undefined && Game.flags.check2 != undefined) {
		let x1 =  Game.flags.check1.pos.x;
		let x2 =  Game.flags.check2.pos.x;
		let y1 =  Game.flags.check1.pos.y;
		let y2 =  Game.flags.check2.pos.y;
		let range = Game.flags.check1.pos.getRangeTo(Game.flags.check2.pos);
		console.log("Range Check ("+ x1 + "/" +y1 +") / ("+ x2 +"/" + y2 +"): "+ range);
	}
}	
	global.calculateDistance =
	function(xa,ya,xb,yb) {
		let xdiff = xb - xa;
		let ydiff = yb - ya;
		let xsqr = Math.pow(xdiff, 2);
		let ysqr = Math.pow(ydiff, 2);
		return Math.sqrt(ysqr + xsqr);
	}

	global.towercalc =
	function(room) {
            var nameNumber = 1;
	    var towerFlags = [];
            while(nameNumber < 7) {
                let name="tower" + nameNumber.toString();
		if(Game.flags[name] != undefined && Game.flags[name].pos.roomName == room) {
			towerFlags.push(Game.flags[name])
		}
		nameNumber++;
            }
	    var damage = 0;
	    var checkflag = Game.flags.towershoot;
	    for(let index in towerFlags) {
		//MAX(150, MIN(600, (25 - L4) * 30))
		let flag = towerFlags[index];
		let distance = checkflag.pos.getRangeTo(flag);
		let tdamage = Math.max(150, Math.min(600, (25 - distance) * 30));
		console.log("Checking flag: " + flag.name + " Damage: " + tdamage + " Distance: " + distance);
		damage += tdamage;	
	    }
	return "XXX Tower Damage Report for (" + room + " | " + checkflag.pos.x + "/" + checkflag.pos.y +"): Damage: " + damage + " Towers: " + towerFlags.length;
	}

	global.getClaimersNeeded =
	function() {
		var needed = 0;
		flags = _.filter(Game.flags, function(o) { if(o.name.substr(0,11) == "claimerSpot") return true})
		for(flagM in flags) {
			let flag = flags[flagM];
			var ticks = 0;
			if(flag.room != undefined && flag.room.controller.reservation != undefined) {
				ticks = flag.room.controller.reservation.ticksToEnd;
			}
			if(flag.memory.active == true && ticks < 2000) {
				needed++;
			}
		}
		return needed;
	}

	global.handleLinks =
	function() {
		for(let roomM in Memory.rooms) {
			let room = Memory.rooms[roomM];
			if(room.links == undefined && Game.rooms[roomM] != undefined) {
	                        let targets = Game.rooms[roomM].find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK});
				if(targets.length) {
					room.links = {};				
		                        for(let targetM in targets) {
						let target = targets[targetM];
						let linkPos = target.pos.x.toString() + "_" + target.pos.y.toString();	
						room.links[linkPos] = {};
						room.links[linkPos].id = target.id;
						room.links[linkPos].priority = 0;
					}
				} else {
					room.links = {};
				}
			}
			for(let linkM in room.links) {
				let linkMem = room.links[linkM]
				let link = Game.getObjectById(linkMem.id);
					if(link != undefined && link.energy == link.energyCapacity && linkMem.priority > 0) {
						link.transferToLowerPriority();
					}
			}
		}
	}

	global.handleLabs =
	function() {
		for(let roomM in Memory.rooms) {
			let room = Game.rooms[roomM];
			if(Game.rooms[roomM] == undefined) {
				continue;
			}
			let roomLabs = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LAB});
			for(labs in roomLabs) {
				let lab = roomLabs[labs];
				let labIndex = lab.getIndexString();
				if(Memory.rooms[roomM].labs == undefined) {
					Memory.rooms[roomM].labs = {}
				}
				if(Memory.rooms[roomM].labs[labIndex] == undefined) {
					Memory.rooms[roomM].labs[labIndex] = {mineral:null, active:false, react:false, amount: 300, react_labs: [], id: lab.id, emptyMe: false};
					continue;
				}

				labMem = Memory.rooms[roomM].labs[labIndex];
				if(labMem.active != false || labMem.mineral == null || lab.cooldown > 0) {
					continue;
				}
				// OH SHIT SON.
				if(labMem.react == true && lab.mineralAmount < lab.mineralCapacity) {
					let mineral = labMem.mineral;
					let lab1 = _(Memory.rooms[roomM].labs).filter((o) => o.mineral == labMem.react_labs[0]).first();
					let lab2 = _(Memory.rooms[roomM].labs).filter((o) => o.mineral == labMem.react_labs[1]).first();
					if(lab1 != undefined && lab2 != undefined) {
						let lab1A = Game.getObjectById(lab1.id);
						let lab2A = Game.getObjectById(lab2.id);
						if(lab1A.mineralAmount > 10 && lab2A.mineralAmount > 10) {
							lab.runReaction(lab1A,lab2A);
						}
					}
				}
			
			}
		}
	}

	global.handleBuild =
	function(roomName) {
		let room = Game.rooms[roomName];
		let towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
		let towerC = room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
		let num = towers.length + towerC.length;
		if(num < CONTROLLER_STRUCTURES.tower[room.controller.level]) {
			    var nameNumber = 1;
		            var name=roomName + "_tower" + nameNumber.toString();
		            while(Game.flags[name] != undefined) {
				let needsTower = true;
				let flag = Game.flags[name];
		                var sfinder = flag.pos.lookFor(LOOK_STRUCTURES);
				var cfinder = flag.pos.lookFor(LOOK_CONSTRUCTION_SITES);
				if(sfinder.length > 0) {
			                for(let structureI of sfinder){
			                        var structure = structureI;
			                        if(structure == undefined) {
			                                continue;
			                        }
			                        if(structure.structureType == STRUCTURE_TOWER) {
			                                needsTower = false;
						}
					}
	                        } 
				if(cfinder.length > 0) {
                                        for(let constructureI of cfinder){
	                                        var constructure = constructureI;
	                                        if(constructure == undefined) {
	                                                continue;
	                                        }
	                                        if(constructure.structureType == STRUCTURE_TOWER) {
	                                                needsTower = false;
						}
					}
				}
				if(needsTower == true) {
					room.createConstructionSite(flag.pos, STRUCTURE_TOWER)
					return;
				} else {
				nameNumber++;
				name=roomName + "_tower" + nameNumber.toString();
				}
				
	                }
		}
        };
