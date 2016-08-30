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
					if(link.energy == link.energyCapacity && linkMem.priority > 0) {
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
				if(Memory.rooms[roomM].labs[labIndex].id == undefined) {
					Memory.rooms[roomM].labs[labIndex].id = lab.id;
					continue;
				}
				if(Memory.rooms[roomM].labs[labIndex].react_labs == undefined) {
					Memory.rooms[roomM].labs[labIndex].react_labs = [];
					continue;
				}
                                if(Memory.rooms[roomM].labs[labIndex].emptyMe == undefined) {
                                        Memory.rooms[roomM].labs[labIndex].emptyMe = false;
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
