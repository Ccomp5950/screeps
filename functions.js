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
	global.roomLink =
	function(room, braces) {
		if(braces == false) {
			return "<a href='https://screeps.com/a/#!/room/" + room + "'>" + room + "</a>"
		}
		return "[<a href='https://screeps.com/a/#!/room/" + room + "'>" + room + "</a>] "

	}
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
		//console.log("Checking flag: " + flag.name + " Damage: " + tdamage + " Distance: " + distance);
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

	global.clearWaypoints =
	function() {

		if(Memory.firstFlag == undefined) {
			Memory.firstFlag = 1;
		}
		for(let i = Memory.firstFlag; i <= 20; i++) {
			let name ="waypoint" + i.toString();
			if(Game.flags[name] != undefined) {
				Memory.firstFlag = ++i;
				Game.flags[name].remove();
				return false;
			}
		}
		Memory.firstFlag = 1;
		return true;
	}

        global.handleRamparts =
	function(room) {
		let open = true;
		let change = false;
		let scary = true;
		if(Memory.rooms[room].rampartsOpen == undefined) {
			Memory.rooms[room].rampartsOpen = true;
			open = true;
			change = true;
			return;
		}
		let meanies = Game.rooms[room].find(FIND_HOSTILE_CREEPS, {
			filter: (c) => c.checkIfAlly() == false
		});
		let allies = Game.rooms[room].find(FIND_HOSTILE_CREEPS, {
			filter: (c) => c.checkIfAlly() == true
		});
		if(meanies.length > 0 && Memory.rooms[room].rampartsOpen == true) {
			Memory.rooms[room].rampartsOpen = false;
			open = false;
			change = true;
		}
		else if (allies.length > 0 && meanies.length == 0 && Memory.rooms[room].rampartsOpen == false) {
			Memory.rooms[room].rampartsOpen = true;
			open = true;
			change = true;
		}
		if(change == false) {
			if(Game.time % 5 != 0) return;
			if(meanies.length > 0) return;
			if(Memory.rooms[room].rampartsOpen == false) {
				open = true;
				Memory.rooms[room].rampartsOpen = true;
			}
		}
		let roomO = Game.rooms[room];
		if(roomO == undefined) return;

		let ramparts = roomO.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
		for(let i in ramparts) {
			let rampart = ramparts[i];
			if(rampart.isPublic != open) rampart.setPublic(open);
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
				Memory.rooms[roomM].labs[labIndex].amount = lab.mineralAmount;
				if(labMem.active != true || labMem.mineral == null || lab.cooldown > 0) {
					continue;
				}
				// OH SHIT SON.
				if(labMem.react == true && lab.mineralAmount < lab.mineralCapacity) {
					let mineral = labMem.mineral;
					let lab1 = _(Memory.rooms[roomM].labs).filter((o) => o.mineral == labMem.react_labs[0] && o.amount >= 5).first();
					let lab2 = _(Memory.rooms[roomM].labs).filter((o) => o.mineral == labMem.react_labs[1] && o.amount >= 5).first();
					if(lab1 != undefined && lab2 != undefined) {
						let lab1A = Game.getObjectById(lab1.id);
						let lab2A = Game.getObjectById(lab2.id);
						if(lab1A.mineralAmount >= 5 && lab2A.mineralAmount >= 5) {
							lab.runReaction(lab1A,lab2A);
						}
					}
				}
			
			}
		}
	}

	global.terminal =
	function(roomName) {
		let room = Game.rooms[roomName];
		if(room == undefined) return {send: function() { console.log("Room Undefined")}}

		let terminal = room.terminal
		if(terminal == undefined) return {send: function() { console.log("Terminal Undefined")}}

		return terminal;
	}

        global.structure =
	function(roomName) {
		let room = Game.rooms[roomName];
		if(room == undefined) {
			console.log("Room " + roomName + "Undefined")
			return {};
		}
		let storage = room.storage;
                if(storage == undefined) {
                        console.log("Storage in " + roomName + "Undefined")
                        return {};
		}
		return storage;
	}

	global.creep =
	function(creepName) {
		let creep = Game.creeps[creepName];
		if(creep == undefined) {
			console.log("Creep " + creepName + " undefined");
			return {};
		}
		return creep;
	}

        global.nuke =
        function(roomName) {
                let room = Game.rooms[roomName];
                if(room == undefined) return {launchNuke: function() { console.log("Room Undefined")}}

		let nuke = Game.getObjectById(room.memory.nuke)
		if(nuke == undefined) {
			nuke = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_NUKER});
			if(nuke.length) {
			nuke = nuke[0];
			room.memory.nuke = nuke.id;
			} else {
			nuke = undefined;
			}
			
		}
		if(nuke == undefined) return {launchNuke: function() { console.log("NukeUndefined")}}

		return nuke;
	}
	global.toUTF16 =
	function(codePoint) {
		var TEN_BITS = parseInt('1111111111', 2);
		function u(codeUnit) {
			return '\\u'+codeUnit.toString(16).toUpperCase();
		}

		if (codePoint <= 0xFFFF) {
			return u(codePoint);
		}
		codePoint -= 0x10000;
	        // Shift right to get to most significant 10 bits
		var leadSurrogate = 0xD800 + (codePoint >> 10);
		// Mask to get least significant 10 bits
		var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);
		return u(leadSurrogate) + u(tailSurrogate);
	}


	global.drawVisuals =
	function() {
		if(Memory.config != undefined && Memory.config.drawVisuals == true) return true;
		return false;
	}

	global.handleBuild =
	function(roomName) {
		let room = Game.rooms[roomName];
		if(room == undefined || room.controller == undefined || room.controller.my != true || room.controller.level == undefined) {
			return;
		}
		let towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
		let towerC = room.find(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
		let numtower = towers.length + towerC.length;
		if(numtower < CONTROLLER_STRUCTURES.tower[room.controller.level]) {
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
		if(CONTROLLER_STRUCTURES.storage[room.controller.level] && (room.storage == undefined || room.storage.my != true)) {
			if(room.storage != undefined && room.storage.my != true) {
				room.storage.destroy();
				return;
			}
			
			var storageflagname = roomName + "_storage"
			var storageflag = Game.flags[storageflagname];
			if(storageflag != undefined) {
				room.createConstructionSite(storageflag.pos, STRUCTURE_STORAGE)
				return;
			}
		}
		if(CONTROLLER_STRUCTURES.terminal[room.controller.level] && (room.terminal == undefined || room.terminal.my != true)) {
                        if(room.terminal != undefined && room.terminal.my != true) {
                                room.terminal.destroy();
				return;
			}
                        var terminalflagname = roomName + "_terminal"
                        var terminalflag = Game.flags[terminalflagname];
                        if(terminalflag != undefined) {
                                room.createConstructionSite(terminalflag.pos, STRUCTURE_TERMINAL)
				return;
			}
		}









        };
