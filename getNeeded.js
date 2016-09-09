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
		var gcl = Game.rooms[room].controller.level;
		if(gcl == 8) {
			return 1;
		}
		if(gcl == 4) {
                        if(Memory.rooms[room].remotelyUpgraded == true) {
                                return 0;
                        }
			return 1;
		}
		if(gcl <= 3) {
			if(Memory.rooms[room].remotelyUpgraded == true) {
				return 0;
			}
			return 3;
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
                if(gcl == 4 || gcl == 3 || gcl == 2) {
                        return 550;
                }
                if(gcl == 1) {
                        return 200;
                }
		if(gcl == 8) {
			return 1750;
		}

                var storage = Game.rooms[room].storage;
                var terminal = Game.rooms[room].terminal;
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
