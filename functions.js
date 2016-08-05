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
	
	global.calculateDistance =
	function(xa,ya,xb,yb) {
		let xdiff = xb - xa;
		let ydiff = yb - ya;
		let xsqr = Math.pow(xdiff, 2);
		let ysqr = Math.pow(ydiff, 2);
		return Math.sqrt(ysqr + xsqr);
	}

	
