module.exports = {
	getEnergy:
		function(role,room) {
		if(this[role+"energy"] != undefined) {
			return this[role+"energy"](room);
		} else if(Memory.rooms[room].role[role] != undefined) {
			return Memory.rooms[room].role[role].required;
		}
		return 0;
	},

	getNeeded: function(role,room) {
		if(this[role] != undefined) {
			return this[role](room);
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
		var storage = Game.room[room].storage;
		var terminal = Game.room[room].terminal;
		var energy = storage.store.energy + terminal.store.energy;
		const LEVEL0 = 250000;
		const LEVEL1 = 300000;
		const LEVEL2 = 400000;
		const LEVEL3 = 600000;
		const LEVEL4 = 650000;
		if(energy >= LEVEL4) {
			return 3;
		} else if (energy >= LEVEL3) {
			return 2;
		} else if (energy >= LEVEL2) {
			return 3;
		} else if (energy >= LEVEL1) {
			return 2;
		} else if (energy >= LEVEL0) {
			return 1;
		} else {
			return 0;
		}
	},
        upgraderenergy:
        function(room) {
                var storage = Game.room[room].storage;
                var terminal = Game.room[room].terminal;
                var energy = storage.store.energy + terminal.store.energy;
                const LEVEL0 = 250000;
                const LEVEL1 = 300000;
                const LEVEL2 = 400000;
                const LEVEL3 = 600000;
                const LEVEL4 = 650000;
		const 20PARTS = 2200;
		const 10PARTS = 1100;
		const 4PARTS = 550;
		const 1PART = 200;		
                if(energy >= LEVEL4) {
                        return 20PARTS;
                } else if (energy >= LEVEL3) {
                        return 20PARTS;
                } else if (energy >= LEVEL2) {
                        return 10PARTS;
                } else if (energy >= LEVEL1) {
                        return 4PARTS;
                } else if (energy >= LEVEL0) {
                        return 1PART;
                } else {
                        return 0;
                }
        }	
}
