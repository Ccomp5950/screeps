module.exports = {
	getEnergy:
		function(role,room) {
		if(this[role+"energy"] != undefined) {
			let energy = this[role+"energy"](room);
			Memory.rooms[room].role[role].requirement = energy;
			return energy;
		} else if(Memory.rooms[room].role[role] != undefined) {
			return Memory.rooms[room].role[role].requirement;
		}
		return 0;
	},

	getNeeded: function(role,room) {
		if(this[role] != undefined) {
			let numberOcreeps = this[role](room);
			//Memory.rooms[room].role[role].minimum = numberOcreeps;
			return numberOcreeps;
		} else if(Memory.rooms[room].role[role] != undefined) {
				return Memory.rooms[room].role[role].minimum;
		} 
		return 0;
	},
	mineralminer:
	function(room) {
		var roomO = Game.rooms[room];
		var needed = 0;
		if(roomO.controller.level < 6) {
			return needed;
		}
		if(Memory.rooms[room].mineMinerals == true) {
                        let mineral = Game.getObjectById(Memory.rooms[room].mineral);
			let extractor = Game.getObjectById(Memory.rooms[room].extractor);
                        if(mineral == undefined) {
				mineral = roomO.storage.pos.findClosestByRange(FIND_MINERALS);
				Memory.rooms[room].mineral = mineral.id;
			}
                        if(extractor == undefined) {
				extractor = roomO.storage.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR});
				Memory.rooms[room].extractor = extractor.id;
			}
			var stored = 0;
			if(roomO.storage != undefined && roomO.storage.store[mineral.mineralType] != undefined) {
				stored += roomO.storage.store[mineral.mineralType];
			}
                        if(roomO.terminal != undefined && roomO.terminal.store[mineral.mineralType] != undefined) {
                                stored += roomO.terminal.store[mineral.mineralType];
			}
			if(extractor != undefined && mineral != undefined && mineral.ticksToRegeneration == undefined  && (roomO.storage != undefined && stored <= 220000)) {
				needed = 1;
			}
		}
		return needed;

	},
	mmfetcher:
	function(room) {
		return this["mineralminer"](room);
	},
        claimer : 
        function(room) {
                var needed = 0;
                flags = _.filter(Game.flags, function(o) { if(o.name.substr(0,11) == "claimerSpot" && o.memory.spawn == room) return true})
                for(flagM in flags) {
                        let flag = flags[flagM];
                        var ticks = 0;
                        if(flag.room != undefined && flag.room.controller.reservation != undefined) {
                                ticks = flag.room.controller.reservation.ticksToEnd;
                        }
			let reserve_min = Memory.config.reserve_min_ticks;
	                if(flag.memory.active == true && ticks < reserve_min) {
                                needed++;
                        }
                }
                return needed;
        },

	builder:
	function(room) {
		if(Game.rooms[room] == undefined) return 0;

		let roomO = Game.rooms[room];

		let sites = roomO.find(FIND_CONSTRUCTION_SITES);

		if(sites.length > 0) return roomO.memory.role.builder.minimum;

		return 0;
	},

	upgrader:
	function(room) {
		if(Memory.rooms[room].remotelyUpgraded == true) {
                                return 0;
		}
		if(Memory.rooms[room].only1upgrader == true) {
				return 1;
		}
		var gcl = Game.rooms[room].controller.level;
		if(gcl == 8) {
			return 1;
		}
		if(Memory.rooms[room].skipRCLcheck != true) {
			if(gcl == 4) {
				return 1;
			}
		
			if(gcl <= 3) {
				return 3;
			}
		}
		var storage = Game.rooms[room].storage;
		var terminal = Game.rooms[room].terminal;
		if(terminal == undefined) {
			terminal = {store: {energy: 100000}};
		}
		if(storage == undefined) {
			storage = {store: {energy: 150010}};
		}
		var energy = storage.store.energy + terminal.store.energy;
		const LEVEL0 = 250000;
		const LEVEL1 = 300000;
		const LEVEL2 = 400000;
		const LEVEL3 = 600000;
		const LEVEL4 = 650000;
		const LEVEL5 = 700000;

		if(energy >= LEVEL5) {
			return 3;
		} else if(energy >= LEVEL4) {
			return 3;
		} else if (energy >= LEVEL3) {
			return 2;
		} else if (energy >= LEVEL2) {
			return 2;
		} else if (energy >= LEVEL1) {
			return 2;
		} else if (energy >= LEVEL0) {
			return 3;
		} else {
			return 1;
		}
	},
        upgraderenergy:
        function(room) {
                var gcl = Game.rooms[room].controller.level;
		var max = Game.rooms[room].energyCapacityAvailable
                if(Memory.rooms[room].only1upgrader == true) {
                                return 200;
                }
                if(Memory.rooms[room].skipRCLcheck != true) {
	                if(gcl == 4 || gcl == 3 || gcl == 2) {
				if(max >= 550) return 550;
				return 200;
	                }
	                if(gcl == 1) {
	                        return 200;
	                }
		}

                var storage = Game.rooms[room].storage;
                var terminal = Game.rooms[room].terminal;
                if(terminal == undefined) {
                        terminal = {store: {energy: 0}};
                }
                if(storage == undefined) {
                        storage = {store: {energy: 0}};
                }
                var energy = storage.store.energy + terminal.store.energy;
                if(gcl == 8) {
                        if(energy <= 200000) {
                                return 200;
                        } else {
                                return 1750;
                        }
                }
                const LEVEL0 = 250000;
                const LEVEL1 = 300000;
                const LEVEL2 = 400000;
                const LEVEL3 = 600000;
                const LEVEL4 = 650000;
		const LEVEL5 = 700000;
		const PARTS25 = Math.min(3200, max);
		const PARTS20 = Math.min(2400, max);
		const PARTS10 = Math.min(1100, max);
		const PARTS4 = Math.min(550, max);
		const PART1 = 200;		
		if(energy >= LEVEL5) {
			return PARTS25;			// 75
                } else if(energy >= LEVEL4) {
                        return PARTS20;			// 60
                } else if (energy >= LEVEL3) {
                        return PARTS20;			// 40
                } else if (energy >= LEVEL2) {
                        return PARTS10;			// 20			
                } else if (energy >= LEVEL1) {
                        return PARTS4;			// 8
                } else if (energy >= LEVEL0) {
                        return PART1;			// 3
                } else {
                        return PART1;			// 1
                }
        }	
}
