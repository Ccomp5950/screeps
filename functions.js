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
		for(roleM in roles) {
			rolecount[roles[roleM].namer] = 0;
		}
		for(creepM in Game.creeps) {
			rolecount[Game.creeps[creepM].role]++;
		}
		for(roleM in roles) {
			console.log("You have " + rolecount[roles[roleM].namer] + " " + roles[roleM].namer +"'s creeps");
		}
	}

	
