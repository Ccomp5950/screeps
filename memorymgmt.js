{
	master: function() {
		this.setup();
		if(Game.time % 25 == 0) this.structures();
		this.creeps();
		if(Game.time % 5 == 0) this.delFlags();
		this.newflags();
	},

	setup: function() {
		if(Memory.structure == undefined) {
			Memory.structure = [];
		}
		if(Memory.myrooms == undefined) {
			myrooms = [];
			for(let room in Game.rooms) {
				myrooms.push(Game.rooms[room].name);
			}
		Memory.myrooms = myrooms;
		}
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
			if(Game.flags[name].memory == null) Memory.flags[name].lala = -1;
	        }
	},

	structures: function() {
		for(let id in Memory.structure) {
			let deleteit = true;
			for(role in Memory.structure[id]) {
				if(Memory.structure[id][role] == undefined) continue;
				if(Memory.structure[id][role][lastHandled] == undefined) continue;
				if(Memory.structure[id][role][lastHandled] >= Game.time - 3) {
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
	                console.log("RIP: " + name + " the " +Memory.creeps[name].role + " in "+ Memory.creeps[name].currentRoom + " with " + Memory.creeps[name].currentHits + "/" + Memory.creeps[name].currentMaxHits + " HPs and "+ Memory.creeps[name].ticksToLive + " Ticks Left " + flag);
	            delete Memory.creeps[name];
	        }
	    }
	}
}
