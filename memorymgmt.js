module.exports = {
	master: function(roles) {
		this.setup();
		if(Game.time % 25 == 0) this.structures();
		this.creeps();
		if(Game.time % 5 == 0) this.delFlags();
		this.newFlags();
		this.roles();
		//this.spawns();
	},
/*
	spawns: function() {
		for(let spawnM in Game.spawns) {
			let spawn = Game.spawns[spawnM];
			let defaultMem = {name:spawn.name, spawning:false};

			if(Memory.spawns == undefined) {
				newBody.push(defaultMem);
				Memory.spawns = newBody;
				return;
			}
			let index = Memory.spawns.indexOf(spawn.name);
			if(index = -1) {
				Memory.spawns.push(defaultMem);
				return;
			}
			else {
				Memory.spawns[index].spawning = false;
			}
			
		}
	},
*/
	newRoles: function(roles) {
		for(let roleM in roles) {
			let role = roles[roleM];
			for(let room in Memory.rooms) {
				if(Memory.rooms[room].role == undefined) {
					Memory.rooms[room].role = {};
				}
				if(Memory.rooms[room].role[role.namer] == undefined) {
					console.log("[" + room + "] Adding " + role.namer + " role");
					Memory.rooms[room].role[role.namer] = {minimum:role.minimum,requirement:role.requirement,current:0};
				}
			}
		}
	},

	roles: function() {
		for(let room in Memory.rooms) {
			let roomM = Memory.rooms[room];
			Memory.rooms[room].currentCreeps = 0;
			Memory.stats['room.' + room + '.requiredCreeps'] = 0;
			for(let role in roomM.role) {
				if(role == "[object Object]") {
					delete Memory.rooms[room].role[role];
					continue;
				}
				Memory.stats['room.' + room + '.requiredCreeps'] += Memory.rooms[room].role[role].minimum;
				Memory.rooms[room].role[role].current = 0;
			}
		}
	},

	setup: function() {
		if(Memory.rooms == undefined)  Memory.rooms = {};
		if(Memory.allies == undefined) Memory.allies = [];
		if(Memory.flags == undefined)  Memory.flags = [];
		var defaultConfig = {	drawVisuals: false,
		       			maxDefenseHits: 301000000,
				       	profiler: false, 
					pumpEnergyHere: "", 
					pumpEnergyHereNext: "",
					clearWaypointFlags: false, 
					reserve_min_ticks: 3500
		};
		if(Memory.config == undefined) Memory.config = defaultConfig;
		for(let entry in defaultConfig) {
			if(Memory.config[entry] == undefined) Memory.config[entry] = defaultConfig[entry];
		}
		if(Memory.stats == undefined)  Memory.stats = {};
		if(Memory.structure == undefined) Memory.structure = {};

	},

	delFlags: function() {
	    for (let name in Memory.flags) {
	        if (Game.flags[name] == undefined) {
	                console.log("Removed " + name+ " from flag list");
	            delete Memory.flags[name];
	        }
	    }
	},

	newFlags: function() {
		for (let name in Game.flags) {
			if(Memory.flags[name] == undefined) {
				Memory.flags[name] = {}
				continue;
		        }
			if(Memory.flags[name].active == undefined) {
				Memory.flags[name].active = false;
				continue;
			}
			if(Memory.flags[name].spawn == undefined) {
				Memory.flags[name].spawn = "";
				continue;
			}
		}
	},

	structures: function() {
		for(let id in Memory.structure) {
			let deleteit = true;
			for(role in Memory.structure[id]) {
				if(Memory.structure[id][role] == undefined) continue;
				if(Memory.structure[id][role].lastHandled == undefined) continue;
				if(Memory.structure[id][role].lastHandled >= Game.time - 3) {
					deleteit = false;
					break;
				}
				delete Memory.structure[id][role];
			}
			if(deleteit)
			delete Memory.structure[id];
		}
	},

	creeps: function() {
	    for (let name in Memory.creeps) {
	        if (Game.creeps[name] == undefined) {
	                let flag = ""
	                if(Memory.creeps[name].MyFlag != null) {
	                        flag = "(" + Memory.creeps[name].MyFlag + ")";
	                }
	                if(Memory.creeps[name].ticksToLive > 1 && (Memory.creeps[name].role != "labtender" || Memory.creeps[name].ticksToLive > 20)) {
				console.log("RIP: " + name + " the " +Memory.creeps[name].role + " in "+ Memory.creeps[name].currentRoom + " with " + Memory.creeps[name].currentHits + "/" + Memory.creeps[name].currentMaxHits + " HPs and "+ Memory.creeps[name].ticksToLive + " Ticks Left " + flag);
			}
	            delete Memory.creeps[name];
	        }
	    }
	}
}
