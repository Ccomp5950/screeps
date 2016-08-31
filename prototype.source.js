module.exports = function() {
    // create a new function for StructureSpawn
   	Source.prototype.isFree =
        function(creep) {
                var opens = 0;
                var spawn = this;
		
		if(creep != undefined && creep.pos.getRangeTo(spawn) <= 1) {
			return true;
		}
                var offsets =   [[1,1],
                                 [1,0],
                                 [0,1],
                                 [-1,1],
                                 [1,-1],
                                 [-1,0],
                                 [-1,-1],
                                 [0,-1]
                                ];
                for(let offset of offsets) {
                        let xa = spawn.pos.x + offset[0];
                        let ya = spawn.pos.y + offset[1];
                        let checkpos = new RoomPosition(xa, ya, spawn.room.name);
                        let terrain = checkpos.lookFor(LOOK_CREEPS);
                        if(terrain.length) {
				continue;
                        }
			terrain = checkpos.lookFor(LOOK_TERRAIN);
			if(terrain.length && terrain != "plain" && terrain != "swamp") {
                                continue;
                        }

			
                        return true;
                }
        return false;
        }
	Source.prototype.energyHarvested =
	function() {
		let s = this;
		let amount = 0;
		if(Memory.InvaderTracker == undefined) {
			tmpa = {};
			tmpa[s.id] = {respawning: -1, energy: s.energy};
			Memory.InvaderTracker = tmpa;
			
		}
		if(Memory.InvaderTracker[s.id] == undefined) {
			Memory.InvaderTracker[s.id] = {respawning: -1, energy: s.energy};
		}
	
		let ticks = -1;
		if(s.ticksToRegeneration == undefined || s.energy == 3000 || Memory.InvaderTracker[s.id].respawning == -1) {
			ticks = -1;
		}else if(s.energy != Memory.InvaderTracker[s.id].energy) {
			amount = Memory.InvaderTracker[s.id].energy - s.energy;
		}

		if(s.ticksToRegeneration != undefined) {
			ticks = s.ticksToRegeneration;
		}

                Memory.InvaderTracker[s.id].respawning = ticks;
                Memory.InvaderTracker[s.id].energy = s.energy;
		return amount;
	}
};
