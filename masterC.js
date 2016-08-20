/*
 * Master Controller.
 *
 * The master controller(MC) maintains the empire.  It spawns sub controllers to handle rooms, which spawns another sub controller to handle the towers, rooms, and links in the room.
 *
 * If needed low priority rooms can be disabled so to not overload CPU.
 *
 */

module.exports = {
	setup: 
	function() {
		
		if(Memory.masterC == undefined) {
			Memory.masterC = {};
			Memory.masterC.cacheInvalid = -1;
			Memory.masterC.rooms = {};
		}
		let masterC = Memory.masterC;
		for(spawnM in Game.spawns) {
			let spawn = Game.spawns[spawnM];
			let spawnPos = spawn.getIndexString();
			if(Memory.masterC.rooms[spawn.room.name] == undefined) {
				Memory.masterC.rooms[spawn.room.name] = {spawns:{}, maxEnergy: spawn.room.energyCapacityAvailable, gcl: spawn.room.controller.level, creeps: [], construction: {} , census: {}}; 
			}
			Memory.masterC.rooms[spawn.room.name].spawns[spawnPos] = {id: spawn.id};
		}


		
		
	},

	tick:
	function() {
		let masterC = Memory.masterC;
		this.setup();
		if(masterC.cacheInvalid < Game.time) {
			this.rebuildCache();
                }
		for(room in masterC.rooms) {
			this.tickRoom(room);
		}
	},


	rebuildCache:
	function() {
		let masterC = Memory.masterC;
		masterC.cacheInvalid = Game.time + 5;

                for(room in masterC.rooms) {
                        masterC.rooms[room].creeps =  _(Game.creeps).filter((c) => c.memory.spawnRoom == room).map((c) => c.name);
                        if(Game.rooms[room] != undefined) {
                                Memory.masterC.rooms[room].maxEnergy = Game.rooms[room].energyCapacityAvailable;
                                Memory.masterC.rooms[room].gcl = Game.rooms[room].controller.level;
                        } else {
                                console.log("Did we lose the room in: " + room + "???";
                        }
                }
	},

	tickRoom:
	function(room) {
		let masterCr = Memory.masterC.rooms[room];
		// creeps
		masterCr.census = {};
		for(let i in masterCr.creeps) {
			let creepName = masterCr.creeps[i];
			let creepMem = Memory.creeps[creepName];
			if(creepMem == undefined) {
				continue;
			}
			let role = creepMem.role;
			if(role == undefined) {
				continue;
			}
			
			if(masterCr.census[role] == undefined) {
				masterCr.census[role] = 0;
			}
			if(this.tickCreep(creepName)) {
				masterCr.census[role]++;
			}
		}
	},

	tickCreep:
	function(creepName) {
		let creep = Game.creeps[creepName];
		if(creep == undefined) {
			return false;
		}
		creepRole = creep.memory.role;
		Roles[creepRole].run.run(creep);
		if(creep.checkTimeToReplace() == false) {
			return false;
		}
		return true;
	}
}
