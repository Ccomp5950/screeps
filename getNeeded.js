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
			Memory.rooms[room].role[role].minimum = numberOcreeps;
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
			return 0;
		}
		if(Memory.rooms[room].mineMinerals == true) {
                        let mineral = Game.getObjectById(Memory.rooms[room].mineral);
			let extractor = Game.getObjectById(Memory.rooms[room].extractor);
                        if(mineral == undefined) {
				mineral = roomO.storage.pos.findClosestByRange(FIND_MINERALS);
				Memory.rooms[room].mineral = mineral.id;
			}
                        if(extractor != undefined) {
				extractor = roomO.storage.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR});
				Memory.rooms[room].extractor = extractor.id;
			}
			if(extractor != undefined && mineral != undefined && mineral.ticksToRegeneration == undefined) {
				needed = 1;
			}
		}
		return needed;

	},
	mmfetcher:
	function(room) {
		return Memory.rooms[room].role["mineralminer"].minimum;
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
                        if(flag.memory.active == true && ticks < 2000) {
                                needed++;
                        }
                }
                return needed;
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
		if(gcl == 8) {
			return 1750;
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
                const LEVEL0 = 250000;
                const LEVEL1 = 300000;
                const LEVEL2 = 400000;
                const LEVEL3 = 600000;
                const LEVEL4 = 650000;
		const LEVEL5 = 700000;
		const PARTS25 = 3200;
		const PARTS20 = 2400;
		const PARTS10 = 1100;
		const PARTS4 = 550;
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
